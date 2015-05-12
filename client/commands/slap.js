/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

commands.slap = {
    name: "Slap",
    description: "Slap someone.",
    usage: "/slap [username]",
    callback: function (arg) {
        var time = TimeSync.serverTime();

        if (arg.length < 1) {
            insertMessage(time, "Malformed slap command.", "error");
            insertMessage(time, "`" + this.usage + "`", "error");
            return;
        }

        var recipient = arg.split(" ")[0];
        var client = Clients.findOne({
            username: { $regex : new RegExp(recipient, "i") }
        });

        if (client == null) {
            insertMessage(time, "User \"" + recipient + "\" doesn't exists.", "error");
            return;
        }

        Streamy.broadcast("__message__", {
            time: time,
            content: "slaps " + client.username + " around a bit with a large trout",
            type: "slap"
        }, client.sid);

        Streamy.sessions(client.sid).emit("__message__", {
            time: time,
            content: "slaps you around a bit with a large trout",
            type: "slap"
        });
    }
};
