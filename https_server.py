import http.server  # Importing the http.server module for creating an HTTP server
import ssl  # Importing the ssl module for enabling SSL encryption
import socket  # Importing the socket module for getting the IP address

def get_ip_address():
    # Creating a socket object and connecting to a remote server to get the IP address
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    return s.getsockname()[0]  # Returning the IP address

# Setting up the server address using the IP address and port number
server_address = (get_ip_address(), 4443)

# Creating an HTTP server object with the server address and a request handler
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# Wrapping the server socket with an SSL context using the certificate and key files
httpd.socket = ssl.wrap_socket(httpd.socket, certfile='./cert/cert.pem', keyfile='./cert/key.pem', server_side=True)

# Printing the server address to the console
print("Serving on https://{}:{}".format(*server_address))

# Starting the server and serving requests indefinitely
httpd.serve_forever()
