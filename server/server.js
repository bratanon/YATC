Meteor.publish("messages", function() {
    return Messages.find({}, {sort: {time: 1}});
});
