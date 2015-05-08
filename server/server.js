Meteor.publish("messages", function(date) {
    return Messages.find({time: {$gt: date}}, {sort: {time: 1}});
});
