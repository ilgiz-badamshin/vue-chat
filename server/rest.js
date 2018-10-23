function Chat() {
    this.id = null;
    this.name = null;
    this.messages = [];
    this.user_ids = [];
    this.show_old = false;
}

function Message() {
    this.id = null;
    this.chat_id = null;
    this.user_id = null;
    this.message = null;
    this.created_at = null;
    this.updated_at = null;
    this.is_deleted = false;
    this.is_seen = false;
    this.attachments = [];
    this.user = {};
}

function Attachment() {
    this.id = null;
    // this.chat_id = null;
    this.message_id = null;
}

function User() {
    this.id = null;
    this.name = null;
}

//@TODO User id from socket or by cookie?
var chats = [
    {
        id: "1",
        name: 'My First Chat',
        messages: [],
        user_ids: [],
    },
    {
        id: "2",
        name: 'MySecond chat',
        messages: [],
        user_ids: [],
    },
];
const util = require('util');

console.log(util.inspect(chats));

module.exports = {
    getChat(chat_id) {
        var limit = 5;
        var chat = chats.find(x => x.id === chat_id);
        chat = JSON.parse(JSON.stringify(chat));
        //@TODO messages should contain last X messages to show in new activated chat
        chat.show_old = chat.messages.length > limit;
        chat.messages = chat.messages.slice(Math.max(chat.messages.length - limit, 0));
        return chat;
    },
    getChats: function () {
        var limit = 5;
        var new_chats = JSON.parse(JSON.stringify(chats));
        //@TODO messages should contain last X messages to show in new activated chat
        new_chats.forEach(function (chat) {
            chat.show_old = chat.messages.length > limit;
            chat.messages = chat.messages.slice(Math.max(chat.messages.length - limit, 0));
        });
        return new_chats;
    },

    saveMessage: function (chat_id, message, socket) {
        var chat = chats.find(x => x.id === chat_id);
        var id = 1;
        var user_ids = chat.user_ids;
        if (chat.messages.length > 0) {
            id = chat.messages[chat.messages.length - 1].id + 1;
        }
        var user = new User();
        user.id = socket.user.id;
        user.display_name = socket.user.display_name;

        var chat_message = new Message();
        chat_message.id = id;
        chat_message.chat_id = chat_id;
        chat_message.message = message;
        chat_message.user_id = socket.user.id;
        chat_message.user_id = socket.user.id;
        chat_message.created_at = chat_message.updated_at = new Date();
        chat_message.user = user;

        chat.messages.push(chat_message);
        var response = {
            message: chat_message,
            user_ids: user_ids
        };
        return response;
    },

    loadOldMessages: function (chat_id, to_id, limit) {
        var chat = chats.find(x => x.id === chat_id);
        var messages = [];
        var show_old = false;
        if (typeof chat !== 'undefined') {
            var filtered = chat.messages.filter(function (item) {
                return !to_id || item.id < to_id;
            });
            show_old = filtered.length > limit;
            messages = filtered.slice(Math.max(filtered.length - limit, 0));
        }
        var response = {
            messages: messages,
            show_old: show_old,
        };
        return response;
    },

    createChat: function (user_id, name, socket) {
        var chat = new Chat();
        chat.id = 'new-' + user_id;
        chat.name = 'new - ' + name;
        chat.messages = [];
        chat.user_ids = [user_id, socket.user.id];
        chats.push(chat);
        return chat;
    },

    getUserInfo: function (socket) {
        // var url = frontendUrl + '/chat/frontend/get-user-info';
        // if (socket.request._query['isEmployee'] !== undefined && socket.request._query['isEmployee'] == 'true') {
        //     url = backendUrl + '/chat/backend/get-user-info';
        // }
        //
        // return requestify.get(url, {
        //     dataType: 'json',
        //     headers: {
        //         'Cookie': socket.request.headers["cookie"],
        //         'User-Agent': socket.request.headers["user-agent"],
        //         'X-Requested-With': 'XMLHttpRequest'
        //     }
        // }).then(function (response) {
        //     return response.getBody();
        // }, function () {
        //     return false;
        // });
        return (new Promise(function (resolve, reject) {
                var user = new User();
                user.id = socket.request._query['user_id'];
                user.display_name = socket.request._query['name'];
                resolve(user);
            }
        ))
    },
}