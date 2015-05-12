Messages = new Mongo.Collection(null);

Template.messages.helpers({
    messages: function() {
        return Messages.find({}, {sort: {time: 1}});
    }
});

