Meteor.methods({
    addMessage: function (message, username) {
        Messages.insert({
            message: message,
            time: Date.now(),
            username: username
        });
    }
});
