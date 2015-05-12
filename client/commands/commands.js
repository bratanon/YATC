/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

commands = {};

parseCommand = function (string) {
    if (string.indexOf('/') !== 0) {
        throw new Meteor.Error('Not a command');
    }

    var arg_separator = string.indexOf(" ");
    if (arg_separator === -1) {
        arg_separator = string.length;
    }

    var commandName = string.substring(1, arg_separator);
    var arg = string.substring(arg_separator).trim();

    if (commands[commandName] === undefined) {
        insertMessage(TimeSync.serverTime(), "No such command.", "error");
        throw new Meteor.Error("Couldn't find command :" + commandName);
    }

    commands[commandName].callback(arg);
};
