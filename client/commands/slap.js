commands.slap = {
    name: "Slap",
    usage: "/slap [username]",
    callback: function (arg) {
        var recipient = arg.split(" ")[0];
        var client = Clients.findOne({
            username: { $regex : new RegExp(recipient, "i") }
        });

        if (client == null) {
            insertMessage(TimeSync.serverTime(), "User \"" + recipient + "\" doesn't exísts.", "error");
            return;
        }

        Streamy.broadcast("__message__", {
            time: TimeSync.serverTime(),
            content: "slaps " + client.username + " around a bit with a large trout",
            type: "slap"
        }, client.sid);

        Streamy.sessions(client.sid).emit("__message__", {
            time: TimeSync.serverTime(),
            content: "slaps you around a bit with a large trout",
            type: "slap"
        });
    }
};
