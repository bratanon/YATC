/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

commands.me = {
    name: "Me",
    description: "Talk in third person.",
    usage: "/me [message]",
    callback: function (arg) {
        var time = TimeSync.serverTime();

        if (arg.length < 1) {
            insertMessage(time, "Malformed me command.", "error");
            insertMessage(time, "`" + this.usage + "`", "error");
            return;
        }

        Streamy.broadcast("__message__", {
            time: time,
            content: arg,
            type: "me"
        });
    }
};
