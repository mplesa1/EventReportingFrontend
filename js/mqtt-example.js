var send; var draw;
send = draw = function () { };
var wsbroker = location.hostname;  // mqtt websocket enabled broker
var wsport = 15675; // port for above
var client = new Paho.MQTT.Client("localhost", 15675, "/ws", "client-1");
client.onConnectionLost = function (responseObject) {
    console.debug("CONNECTION LOST - " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {
    console.debug("RECEIVE ON " + message.destinationName + " PAYLOAD " + message.payloadString);
    print_first(message.payloadString);
};

var options = {
    timeout: 3,
    keepAliveInterval: 30,
    onSuccess: function () {
        console.debug("CONNECTION SUCCESS");
        client.subscribe('/topic/test', { qos: 1 });
    },
    onFailure: function (message) {
        console.debug("CONNECTION FAILURE - " + message.errorMessage);
    }
};
if (location.protocol == "https:") {
    options.useSSL = true;
}
console.debug("CONNECT TO " + wsbroker + ":" + wsport);
client.connect(options);
send = function (data) {
    message = new Paho.MQTT.Message(data);
    message.destinationName = "bunny";
    console.debug("SEND ON " + message.destinationName + " PAYLOAD " + data);
    client.send(message);
};
$(function () {
    $("#event-form").submit(function (event) {
        event.preventDefault()
        var _description = $('#event-description').val();
        var _address = $('#event-address').val();
        var _settlementId = $('#settlements-select').val();
        var createEventJson = JSON.stringify({
            "description": _description,
            "address": _address,
            "settlementId": _settlementId
        })
        send(createEventJson)
    })
});