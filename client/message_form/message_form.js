/**
 * Created by Emil on 2015-05-12.
 */
Template.message_form.events = {
    'submit form': function(event) {
        event.preventDefault();

        if (!isAuthed()) {
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