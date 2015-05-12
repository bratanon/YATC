/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

Meteor.subscribe('clients');

Template.clients.helpers({
    clients: function() {
        return Clients.find({}, {sort: {username: 1}});
    },
    count: function () {
        return Clients.find({}).count();
    },
    isAuthenticated: function() {
        return isAuthenticated();
    }
});

/**
 * Checks if the user is authenticated by checking the user session.
 *
 * @returns {boolean} True if the user us authenticated, otherwise false.
 */
isAuthenticated = function () {
    return Session.get("username") !== undefined;
};
