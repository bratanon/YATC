Template.registerHelper("formatTimestamp", function (timestamp) {
    return moment(new Date(timestamp)).format("HH:mm:ss");
});

Template.message.helpers({
    messageType: function() {
        return "message-" + this.type;
    }
});

Template.message.rendered = function() {
    var $scroll_container = $("#chat-container");
    $scroll_container.scrollTop($scroll_container.prop("scrollHeight"));
};