/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

// Client connects.
Streamy.onConnect(function(socket) {
    Clients.insert({
        sid: socket.id
    });
});

// Client disconnects.
Streamy.onDisconnect(function(socket) {
    var client = Clients.findOne({
        sid: socket.id
    });

    Streamy.broadcast("__leave__", {
        sid: client.sid,
        time: Date.now(),
        username: client.username
    });

    Clients.remove({
        sid: client.sid
    });
});

// Client sets/changed username.
Streamy.on("__username_set__", function(data, socket) {
    if (!data.username) {
        throw new Meteor.Error("Empty username");
    }

    Clients.update({
        sid: socket.id
    }, {
        $set: { username: data.username }
    });

    Streamy.broadcast("__join__", {
        sid: socket.id,
        time: Date.now(),
        username: data.username
    }, socket.id);
});

Meteor.publish("clients", function() {
    return Clients.find({
        username: { $ne: null }
    });
});
