/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

commands.help = {
    name: "Help",
    description: "Shows this help.",
    usage: "/help",
    callback: function (arg) {
        var time = TimeSync.serverTime();

        insertMessage(time, "Commands:", "local");

        $.each(commands, function(index, command) {
            insertMessage(time, command.name + " - " + command.description, "local");
            insertMessage(time, "`" + command.usage + "`", "local");
        });
    }
};
