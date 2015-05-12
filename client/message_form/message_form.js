/**
 *  YATC - Yet another tjatter client
 *
 *  by Emil Stjerneman (BratAnon).
 */

Template.message_form.events = {
    'submit form': function(event) {
        event.preventDefault();

        if (!isAuthenticated()) {
            return;
        }

        var $element = $("#message");
        var content = $element.val().trim();

        if (!content) {
            return;
        }

        if (content.indexOf('/') === 0) {
            parseCommand(content);
            $element.val('');
            return;
        }

        Streamy.broadcast("__message__", {
            time: TimeSync.serverTime(),
            content: content,
            type: "default"
        });

        $element.val('');
    }
};
