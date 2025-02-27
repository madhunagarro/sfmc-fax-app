define(["postmonger"], function(Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};

  $(window).ready(function() {
    connection.trigger("ready");
    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");
  });

  connection.on("initActivity", function(data) {
    if (data) {
      payload = data;
    }

    console.log("Custom Activity Initialized:", payload);
  });

  connection.on("clickedNext", function() {
    payload["arguments"].execute.inArguments = [
      {
        "faxNumber": $("#faxNumber").val(),
        "documentUrl": $("#documentUrl").val()
      }
    ];
    payload["metaData"].isConfigured = true;
    connection.trigger("updateActivity", payload);
  });
});
