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
        if (arg.length < 1) {
            return;
        }

        Streamy.broadcast("__message__", {
            time: TimeSync.serverTime(),
            content: arg,
            type: "me"
        });
    }
};
