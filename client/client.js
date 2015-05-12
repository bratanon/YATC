Meteor._debug = (function (super_meteor_debug) {
    return function (error, info) {
        if (!(info && _.has(info, 'msg')))
            super_meteor_debug(error, info);
    }
})(Meteor._debug);

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

Template.registerHelper("equals", function (a, b) {
    return a === b;
});

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
