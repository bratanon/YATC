Meteor.startup(function() {
    if (Session.get("username") == undefined)  {
        vex.defaultOptions.className = 'vex-theme-os';
        vex.dialog.prompt({
            message: 'To start chat we need to know who you are',
            placeholder: 'What is your name?',
            callback: function(name) {
                Session.set("username", name);
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

Template.messages.helpers({
    messages: function(){
        return Messages.find({}, {sort: {time: 1}});
    }
});

Template.message.rendered = function () {
    var $scroll_container = $("#chat-container");
    $scroll_container.scrollTop($scroll_container.prop("scrollHeight"));
};

Template.message_form.events = {
    'submit form': function(event) {
        event.preventDefault();
        var message = document.getElementById('message');
        if (message.value) {
            Meteor.call("addMessage", message.value, Session.get("username"));
            message.value = '';
        }
    }
};

Template.registerHelper("formatTimestamp", function (timestamp) {
    return moment(new Date(timestamp)).format("HH:mm:ss");
});

function init() {
    Meteor.subscribe("messages", TimeSync.serverTime());
}
