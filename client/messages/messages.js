Messages = new Mongo.Collection(null);

Template.messages.helpers({
    messages: function() {
        return Messages.find({}, {sort: {time: 1}});
    }
});

Streamy.on("__join__", function(message) {
    var msg = message.username + " has joined.";
    insertMessage(message.time, msg, null, "join");
});

Streamy.on('__leave__', function(message) {
    var msg = message.username + " has left.";
    insertMessage(message.time, msg, null, "leave");
});

Streamy.on("__message__", function(message) {
    var client = Clients.findOne({
        sid: message.__from
    });

    if (client == null) {
        return;
    }

    insertMessage(message.time, message.content, client, message.type);
});

insertMessage = function (time, content, client, type) {
    if (!isAuthed()) {
        return;
    }

    Messages.insert({
        time: time,
        content: content,
        username: (client && client.username) ? client.username : null,
        type: type
    });
};