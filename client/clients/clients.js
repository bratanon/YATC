Meteor.subscribe('clients');

Template.clients.helpers({
    clients: function() {
        return Clients.find({}, {sort: {username: 1}});
    },
    count: function () {
        return Clients.find({}).count();
    },
    isAuthed: function() {
        return isAuthed();
    }
});

isAuthed = function () {
    return Session.get("username") != undefined;
};
