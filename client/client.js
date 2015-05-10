Meteor._debug = (function (super_meteor_debug) {
    return function (error, info) {
        if (!(info && _.has(info, 'msg')))
            super_meteor_debug(error, info);
    }
})(Meteor._debug);

Meteor.subscribe('clients');

var Messages = new Mongo.Collection(null);

Meteor.startup(function() {
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.prompt({
        message: 'To start chat we need to know who you are',
        callback: function(name) {
            setUsername(name);
            init();
        },
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        buttons: [
            vex.dialog.buttons.YES
        ],
        input: '<input name="name" type="text" class="vex-dialog-prompt-input" placeholder="What is your name?" required pattern="^[a-öA-Ö][a-öA-Ö0-9-_\\.]{1,20}$">',
        onSubmit: function(event) {
            event.preventDefault();
            event.stopPropagation();

            var client = Clients.findOne({
                username: { $regex : new RegExp(this.name.value, "i") }
            });

            if (client != null) {
                alert('The name is already taken.');
                return false;
            }

            var $vexContent = $(this).parent();
            $vexContent.data().vex.value = this.name.value;
            return vex.close($vexContent.data().vex.id);
        }
    });
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

Template.messages.helpers({
    messages: function() {
        return Messages.find({}, {sort: {time: 1}});
    }
});

Template.message.helpers({
    messageType: function() {
        return "message-" + this.type;
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
        var content = $element.val().trim();

        if (content.indexOf('/') === 0) {
            parseCommand(content);
            $element.val('');
            return;
        }

        Streamy.broadcast("__message__", {
            time: TimeSync.serverTime(),
            content: content,
            type: "default"
        });

        $element.val('');
    }
};

Template.registerHelper("formatTimestamp", function (timestamp) {
    return moment(new Date(timestamp)).format("HH:mm:ss");
});

Template.registerHelper("equals", function (a, b) {
    return a === b;
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
    insertMessage(TimeSync.serverTime(), "YATC - Yet another tjatter client by BratAnon", null, "local");
    insertMessage(TimeSync.serverTime(), "Welcome " + Session.get("username"), null, "local");
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

/**
 * COMMANDS
 */

var commands = {
    me: function(string) {
        Streamy.broadcast("__message__", {
            time: TimeSync.serverTime(),
            content: string,
            type: "me"
        });
    },
    slap: function(string) {
        var recipient = string.split(" ")[0].toLowerCase();
        var client = Clients.findOne({
            username: recipient
        });

        if (client == null) {
            insertMessage(TimeSync.serverTime(), "User \"" + recipient + "\" doesn't exísts.", null, "__local__");
            return;
        }

        Streamy.broadcast("__message__", {
            time: TimeSync.serverTime(),
            content: "slaps " + client.username + " around a bit with a large trout",
            type: "slap"
        }, client.sid);

        Streamy.sessions(client.sid).emit("__message__", {
            time: TimeSync.serverTime(),
            content: "slaps you around a bit with a large trout",
            type: "slap"
        });
    }
};

function parseCommand(string) {
    if (string.indexOf('/') !== 0) {
        throw new Meteor.Error('Not a command');
    }

    var args_separator = string.indexOf(" ");
    var commandName = string.substring(1, args_separator);
    var args = string.substring(args_separator).trim();

    if (args.length < 1) {
        return;
    }

    if (commands[commandName] === undefined) {
        throw new Meteor.Error('Couldnt find command :' + commandName);
    }

    commands[commandName](args);
}
