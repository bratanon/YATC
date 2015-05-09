Streamy.onConnect(function(socket) {
    Clients.insert({
        sid: socket.id
    });
});

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

Streamy.on('username_set', function(data, socket) {
    if (!data.username) {
        throw new Meteor.Error('Empty username');
    }

    Clients.update({
        'sid': socket.id
    }, {
        $set: { username: data.username }
    });

    Streamy.broadcast('__join__', {
        sid: socket.id,
        time: Date.now(),
        username: data.username
    });
});

Meteor.publish('clients', function() {
    return Clients.find({
        'username': { $ne: null }
    });
});