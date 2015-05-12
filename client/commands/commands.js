commands = {};

parseCommand = function (string) {
    if (string.indexOf('/') !== 0) {
        throw new Meteor.Error('Not a command');
    }

    var arg_separator = string.indexOf(" ");
    var commandName = string.substring(1, arg_separator);
    var arg = string.substring(arg_separator).trim();

    if (arg.length < 1) {
        return;
    }

    if (commands[commandName] === undefined) {
        throw new Meteor.Error("Couldn't find command :" + commandName);
    }

    commands[commandName](arg);
};
