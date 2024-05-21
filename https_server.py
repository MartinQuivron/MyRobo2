import http.server
import ssl

server_address = ('192.168.100.206', 4443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
httpd.socket = ssl.wrap_socket(httpd.socket, certfile='./cert/cert.pem', keyfile='./cert/key.pem', server_side=True)

print("Serving on https://{}:{}".format(*server_address))
httpd.serve_forever()