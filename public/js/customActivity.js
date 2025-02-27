const connection = new Postmonger.Session();
let payload = {};

connection.trigger('ready'); // Tell SFMC UI is ready

// Handle SFMC events
connection.on('initActivity', function(data) {
  payload = data;
});

// Save configuration
connection.on('clickedNext', function() {
  payload['metaData'].isConfigured = true;
  connection.trigger('updateActivity', payload);
});