# venbest-test-task

## Description
Write two programs on Node.js; the first will act as a server, the second - a client. To interact
they will be on [ZeroMQ] (http://zeromq.org/). "Server" - depending
in these comments.

The "server" should:

1. accept the following command line arguments: `pub`,` sub`
1. connect ZeroMQ pub-socket over TCP to the host `127.0.0.1` on the port` pub` (socket.bindSync)
1. connect to the ZeroMQ sub-socket over TCP to the host `127.0.0.1` on the port` sub` (socket.bindSync)
1. connect to the database (SQLite)
1. subscribe to messages with the first frame `api_in`
1. when receiving a message on a sub-socket
1. parse json transmitted in the second message frame
1. if in json the `type` field is equal to the string` "login" `
1. Verify the user password.
1. depending on the result of the verification, send a message on the pub socket (its format is lower)

The "customer" must:

1. accept the following command line arguments: `pub`,` sub`
1. connect ZeroMQ pub-socket over TCP to the host `127.0.0.1` on the port` sub` (socket.connect)
1. connect ZeroMQ south of the socket over TCP to the host `127.0.0.1` on the port` pub` (socket.connect)
1. sign a sub-socket on messages with the first frame `api_out`
1. when receiving a message on a sub-socket
1. parse json transmitted in the second message frame
1. if in json the `status` field is equal to the string` "ok" `- output to the console` "ok" `
1. if in json the `status` field is equal to the string" "error" `- display the value of the` error` field in the console
1. request user login (via command version)
1. ask the user for a password (via the command version)
1. Send a message through the pub socket with the first frame `api_in`, the second - json string
with fields enter: 'login', email and pwd - data from the user, msg_id - randomly generated string


## Incoming message format ##

The first frame is `api_in`, the second:

{
type: "login",
Email: "foo@bar.baz",
pwd: "xxx",
msg_id: "yyyy"
}

## Outgoing message format ##

The first frame is `api_out`, the second:

// success:
{
msg_id: "yyyy", // equal to the value of the incoming message
user_id: "N", // get the user from the database
status: ok
}

// error
{
msg_id: "yyyy",
status: "error",
error: "xxx"
}

The error field may take one of the following. values:

`WRONG_PWD` - wrong login or password;
`WRONG_FORMAT` - no one of the fields or fields are empty.


## Installation 

`npm install`

`npm start`
   
    
## Screenshot Running App

![](https://i.imgur.com/XleTUjn.png)
![](https://i.imgur.com/sMk3dPs.png)
![](https://i.imgur.com/JoIW1o4.png)
