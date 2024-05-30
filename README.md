# MyRobo
## Overview
MyRobo is a web application for robot simulation.

### Core principles
MyRobo uses two libraries, simulation and animation, 
to display the results of the robot simulation on the simulation side as an animation.

### Robot Simulation Principle
Robot simulation is performed by giving angular velocity to the robot's joints on the simulation side.
When the simulation time is updated, the joint angles change based on the angular velocity, 
and the changes in the joint angles cause the links, which are the robot's body, to change.

### Running the service
MyRobo allows the user to see the simulation robot (AR) executing a service set by the user.
The service here is the movement of the robot body or end effector to the target point.
Therefore, the following steps are performed. 1.

1. The user sets the target location.
2. The controller determines the angular velocity of each joint so that the robot can reach the target point.
3. The simulation time is updated
4. The robot's state (Link) is updated

Repeat 2-4 until the robot can reach the target point.

## Operation
### Run from an android terminal
(Notes)

Set `DEBUG=false`  in `MyRobo/src/config/config.js`.

When you start the application, click the button for AR function in the lower right corner. 
(If the device does not support AR, it will not be displayed.)

- First, a ring-shaped object is displayed.
- You can move the object by tilting and rotating the device.
- Click on the ring-shaped object (not the middle part), the the robot will appear in place of the ring-shaped object.
- Move the purple object to the target point. 
- Click `[Ready]` button to determine the target point.
- Click` [GO]` button to move to the target point.
- `[ReSize]` button can be used to change the object's size, tilt, and position. 
  Touch the object. to change the target object,

### Running on PC
(Notes)
Set `DEBUG=true` in  `MyRobo/src/config/config.js`.

This is executed to check the operation.
The robot appears from start.
You can move the mobile robot with keyboard operation `W`, `A`, `S`, `D` on PC.

## How to run locally
If you want to develop for the long term, we recommend using Apache.
If you want to use it for a short term, you can use a script to set up a web server in python.

First, copy `https_server.py,example` and rename it to `https_server.py`. (To avoid uploading files with IP addresses to git)
Set the fourth line of `https_server.py` to the IP address of the environment in which you want to run it.
 (You can check it with `ipconfig` at the command prompt)
Execute the following in the directory `MyRobo`.

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

At runtime, type

```
python3 https_server.py
```