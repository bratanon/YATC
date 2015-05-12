/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

Template.registerHelper("formatTimestamp", function (timestamp) {
    return moment(new Date(timestamp)).format(Meteor.settings.public.dateFormat);
});

Template.message.helpers({
    messageType: function() {
        return "message-" + this.type;
    }
});

Template.message.onRendered(function() {
    if (this.data.type === "default" && this.data.username !== Session.get("username")) {
        $('#chatAudio')[0].play();
    }

    var $scroll_container = $("#chat-container");
    $scroll_container.scrollTop($scroll_container.prop("scrollHeight"));
});

// Someone is joining.
Streamy.on("__join__", function(message) {
    var msg = message.username + " has joined.";
    insertMessage(message.time, msg, "join");
});

// Someone is leaving.
Streamy.on('__leave__', function(message) {
    var msg = message.username + " has left.";
    insertMessage(message.time, msg, "leave");
});

// Incoming message.
Streamy.on("__message__", function(message) {
    var client = Clients.findOne({
        sid: message.__from
    });

    if (client == null) {
        return;
    }

    insertMessage(message.time, message.content, message.type, client.username);
});

/**
 * Inserts a message in the local minimongo database.
 *
 * @param {String} time - A UNIX timestamp when the message were created.
 * @param {String} content - The message content.
 * @param {String} type - The message typ.
 * @param {String} [sender] - The sender name, or null.
 */
insertMessage = function (time, content, type, sender) {
    if (!isAuthenticated()) {
        return;
    }

    if (sender === undefined) {
        sender = null;
    }

    Messages.insert({
        time: time,
        content: content,
        username: sender,
        type: type
    });
};