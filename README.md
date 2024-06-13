# MyRobo
## Overview
MyRobo is a web application for robot simulation using OimoJS physic engine

### Running the service
MyRobo allows the user to see the simulation robot (AR) executing a service set by the user.
The service here is the movement of the robot body or end effector to the target point.
Therefore, the following steps are performed. 1.

1. The user sets the target location.
2. The controller determines the angular velocity of each joint so that the robot can reach the target point.
3. The simulation time is updated
4. The robot's state (Link) is updated
5. 

## Operation
(Notes)

In the website choose between PC and mobile device.

When you start the application, click the button for AR function in the lower right corner.

- First, a ring-shaped object is displayed.
- You can move the object by tilting and rotating the device.
- You can make the vacuum cleaner, the arrival point and cubes appear using the buttons.
- Move objects by dragging them. 
- Click `[Move]` button to move the vacuum cleaner to the arrival point.

## How to run locally
If you want to develop for the long term, we recommend using Apache.
If you want to use it for a short term, you can use a script to set up a web server in python.

To run the project enter this command:
```
python3 https_server.py
```

### How to create a certificate file
The certificate file exists in `MyRobo/cert`.
If you need to create it for some reason, just execute the following.

(Certificate - necessary for https communication on the local host)

```
openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -nodes

```

and put the two files you created into the directory `MyRobo/cert`.
