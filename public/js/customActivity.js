define([
  'postmonger'
], function(Postmonger) {
  var connection = new Postmonger.Session();

  connection.on('initActivity', function(payload) {
      console.log("Activity Initialized", payload);
  });

  connection.on('clickedNext', function() {
      connection.trigger('updateActivity', { settings: {} });
  });

  connection.trigger('ready');
});
