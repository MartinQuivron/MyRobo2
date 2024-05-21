import http.server
import ssl
import socket

def get_ip_address():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]

server_address = (get_ip_address(), 4443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile='./cert/cert.pem', keyfile='./cert/key.pem', server_side=True)

print("Serving on https://{}:{}".format(*server_address))
httpd.serve_forever()
