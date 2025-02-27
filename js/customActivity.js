define([
  'postmonger'
], function(Postmonger) {
  var connection = new Postmonger.Session();
  
  connection.on('initActivity', function(payload) {
      console.log("Activity Initialized", payload);
      fetch('/config.json')
          .then(response => response.json())
          .then(config => {
              console.log("Loaded Config:", config);
          })
          .catch(error => console.error("Error loading config.json", error));
  });

  connection.on('clickedNext', function() {
      connection.trigger('updateActivity', { settings: {} });
  });

  connection.trigger('ready');
});
