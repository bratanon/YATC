commands.me = {
    name: "Me",
    usage: "/me [message]",
    callback: function (arg) {
        if (arg === undefined) {
            return;
        }

        Streamy.broadcast("__message__", {
            time: TimeSync.serverTime(),
            content: arg,
            type: "me"
        });
    }
};
