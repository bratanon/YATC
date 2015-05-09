Meteor._debug = (function (super_meteor_debug) {
    return function (error, info) {
        if (!(info && _.has(info, 'msg')))
            super_meteor_debug(error, info);
    }
})(Meteor._debug);

Meteor.subscribe('clients');

var Messages = new Mongo.Collection(null);

Meteor.startup(function() {
    if (!isAuthed()) {
        vex.defaultOptions.className = 'vex-theme-os';
        vex.dialog.prompt({
            message: 'To start chat we need to know who you are',
            placeholder: 'What is your name?',
            callback: function(name) {
                setUsername(name);
                init();
            },
            showCloseButton: false,
            escapeButtonCloses: false,
            overlayClosesOnClick: false,
            buttons: [
                vex.dialog.buttons.YES
            ]
        });
    }
    else {
        init();
    }
});

Streamy.on("__join__", function(data) {
    var msg = data.username + " has joined.";
    insertMessage(data.time, msg, null, "__join__");
});

Streamy.on('__leave__', function(data) {
    var msg = data.username + " has left.";
    insertMessage(data.time, msg, null, "__leave__");
});

Streamy.on("__message__", function(message) {
    var client = Clients.findOne({
        sid: message.__from
    });

    insertMessage(message.time, message.content, client, "__message__");
});

Template.messages.helpers({
    messages: function() {
        return Messages.find({}, {sort: {time: 1}});
    }
});

Template.message.helpers({
    isMessage: function() {
        return this.type === "__message__";
    },
    isJoin: function() {
        return this.type === "__join__";
    },
    isLeave: function() {
        return this.type === "__leave__";
    },
    isLocalMessage: function() {
        return this.type === "__local__";
    },
    messageType: function() {
        return "message-" + this.type.replace(/\_/g, "");
    }
});

Template.message.rendered = function() {
    var $scroll_container = $("#chat-container");
    $scroll_container.scrollTop($scroll_container.prop("scrollHeight"));
};

Template.message_form.events = {
    'submit form': function(event) {
        event.preventDefault();

        if (!isAuthed()) {
            return;
        }

        var $element = $("#message");
        var content = $element.val();

        Streamy.broadcast("__message__", {
            time: TimeSync.serverTime(),
            content: content,
            type: "message"
        });

        $element.val('');
    }
};

Template.registerHelper("formatTimestamp", function (timestamp) {
    return moment(new Date(timestamp)).format("HH:mm:ss");
});

function insertMessage(time, content, client, type) {
    if (!isAuthed()) {
        return;
    }

    Messages.insert({
        time: time,
        content: content,
        username: (client && client.username) ? client.username : null,
        type: type
    });
}

function init() {
    $("#message").focus();
    insertMessage(TimeSync.serverTime(), "YATC - Yet another tjatter client by BratAnon", null, "__local__");
    insertMessage(TimeSync.serverTime(), "Welcome " + Session.get("username"), null, "__local__");
}

function setUsername(username) {
    Session.set("username", username);
    Streamy.emit('username_set', {
        username: username
    });
}

function isAuthed() {
    return Session.get("username") != undefined;
}
