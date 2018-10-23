var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var rest = require('./rest.js');
/**
 * Set up a basic Express server.
 */
app.set('port', 3000);
app.use(express.static(__dirname + '/'));

app.get('/', function (request, response) {
    response.render('index.html');
});

server.listen(app.get('port'), function () {
    console.log('Express server listening.');
});

/**
 * Declare some variables for later use.
 */
var chatRoom = function (chat_id) {
    return 'chat' + chat_id;
};
var userRoom = function (user_id) {
    return 'гыук' + user_id;
};

io.use(function (socket, next) {
    rest.getUserInfo(socket).then(function (user) {
        if (socket.request.headers.cookie) {
            socket.user = user;
            return next();
        } else {
            next(new Error('Authentication error'));
        }
    });
});

function leaveChat(user_d, chat_id) {
    const socket_ids = io.sockets.adapter.rooms[userRoom(user_d)].sockets;
    for (const socket_id in socket_ids) {
        //this is the socket of each client in the room.
        var sock = io.sockets.connected[socket_id];
        sock.leave(chatRoom(chat_id));
    }
}

/**
 * Listen for a new connection on the server.
 */
io.on('connection', function (socket) {
    console.log('Socket connected with ID of ', socket.id, ' and user id is ', socket.user.id, ' name: ', socket.user.name);

    socket.join(userRoom(socket.user.id));


    socket.on('disconnect', function () {
    })
    /**
     * This will get fired whenever a user submits a message to the chat. The
     * server will create a message object to store all of the various
     * metadata and store it in $sentMessages. It will then emit a
     * message to the client to tell it to output the message
     * in the chat to all users.
     */
    socket.on('send message', function (chat_id, message) {
        let response = rest.saveMessage(chat_id, message, socket);
        io.to(chatRoom(response.message.chat_id)).emit('message_received', response.message);
        //TODO or socket.nsp.to?

        response.user_ids.forEach(function (user_id) {
            socket.nsp.to(userRoom(user_id)).emit('activate_chat', chat_id);
        });
    });

    socket.on('load chats', function (ack) {
        const chats = rest.getChats();
        ack(chats);
        chats.forEach(function (chat) {
            socket.join(chatRoom(chat.id));
        });
    });

    socket.on('load chat', function (chat_id, ack) {
        const chat = rest.getChat(chat_id);
        if (chat) {
            ack(chat);
            socket.join(chatRoom(chat.id));
        }
    });

    socket.on('create chat', function (user_id, name) {
        const chat = rest.createChat(user_id, name, socket);
        // socket.join(chatRoom(chat.id));
        socket.nsp.to(userRoom(socket.user.id)).emit('activate_chat', chat.id);
    });

    socket.on('open chat', function (chat_id) {
        io.to(userRoom(socket.user.id)).emit('activate_chat', chat_id);
    });

    socket.on('close chat', function (chat_id) {
        io.to(userRoom(socket.user.id)).emit('chat_closed', chat_id);
        leaveChat(socket.user.id, chat_id);
    });

    socket.on('leave chat', function (chat_id) {
        // socket.leave(chatRoom(chat_id));
    });

    socket.on('load old messages', function (chat_id, to_id, limit, ack) {
        const response = rest.loadOldMessages(chat_id, to_id, limit);
        ack(response.messages, response.show_old);
    });

    //@TODO Securyty problem: check is user can join to chat
    socket.on('join chat', function (chat_id) {
        socket.join(chatRoom(chat_id));
    });
});