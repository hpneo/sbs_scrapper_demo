var express = require('express'),
    SBS = require('./sbs'),
    port = process.env.PORT || 3000;

var app = express();

app.get('/', function(request, response) {
  var promise = SBS.get(request.query.date);

  promise.then(response.json.bind(response)).catch(response.json.bind(response));
});

app.listen(port, function() {
  console.log('SBS Scrapper running in 0.0.0.0:' + port);
});