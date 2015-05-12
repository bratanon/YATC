/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

// Override Meteor._debug to filter for custom msgs.
Meteor._debug = (function (super_meteor_debug) {
    return function (error, info) {
        if (!(info && _.has(info, 'msg')))
            super_meteor_debug(error, info);
    }
})(Meteor._debug);

Template.registerHelper("equals", function (a, b) {
    return a === b;
});

// A socket connection is established.
Streamy.onConnect(function() {
    if (Session.get("username") !== undefined) {
        if (!checkUsername(Session.get("username"))) {
            askForUsername();
            return;
        }

        emitUsername(Session.get("username"));
        init();
    }
    else {
        askForUsername();
    }
});

/**
 * Asks the user for a username in a prompt popup.
 */
function askForUsername() {
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.prompt({
        message: 'To start chat we need to know who you are',
        showCloseButton: false,
        escapeButtonCloses: false,
        overlayClosesOnClick: false,
        buttons: [
            vex.dialog.buttons.YES
        ],
        input: '<input name="username" type="text" class="vex-dialog-prompt-input" placeholder="What is your name?" required pattern="^[a-öA-Ö][a-öA-Ö0-9-_\\.]{1,20}$">',
        callback: function(username) {
            Session.set("username", username);
            emitUsername(username);
            init();
        },
        onSubmit: function(event) {
            event.preventDefault();
            event.stopPropagation();

            if (!checkUsername(this.username.value)) {
                return false;
            }

            var $vexContent = $(this).parent();
            $vexContent.data().vex.value = this.username.value;
            return vex.close($vexContent.data().vex.id);
        }
    });
}

/**
 * Perform init tasks.
 */
function init() {
    $("#message").focus();
    insertMessage(TimeSync.serverTime(), "YATC - Yet another tjatter client by BratAnon", null, "local");
    insertMessage(TimeSync.serverTime(), "Welcome " + Session.get("username"), null, "local");
}

/**
 * Emit the username to the server.
 *
 * @param {String} username The username
 */
function emitUsername(username) {
    Streamy.emit("username_set", {
        username: username
    });
}

/**
 * Checks if the username is in use.
 *
 * @param {String} username The username
 */
function checkUsername(username) {
    var client = Clients.findOne({
        username: { $regex : new RegExp(username, "i") }
    });

    if (client != null) {
        alert('The username is already in use.');
        return false;
    }

    return true;
}
