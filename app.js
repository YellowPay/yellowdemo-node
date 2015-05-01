var express = require('express')
var yellow = require('yellow-sdk-node');
var bodyParser = require('body-parser');

var app = express()

app.use(bodyParser.json());

var api_key = process.env.API_KEY,
    api_secret = process.env.API_SECRET,
    demo_host = process.env.DEMO_HOST;



app.get('/', function (req, res) {

  res.send('Welcome to Yellow node demo!<br><a href="/create-invoice">click here</a> to create a demo invoice.')

})

app.get('/create-invoice', function (req, res) {
  var payload = {
      base_ccy   : "USD",
      base_price : "0.05",
      callback   : demo_host + "/callback-url"
  };

  yellow.createInvoice(api_key, api_secret, payload, function(error, response, body){
    if (!error && response.statusCode == 200) {
      console.log(body);
      res.send('<iframe src="' + body.url + '" style="width:393px; height:255px; overflow:hidden; border:none; margin:auto; display:block;"  scrolling="no" allowtransparency="true" frameborder="0"></iframe>')
    } else if(error) {
      console.log(error)
    }

  });

})

app.post('/callback-url/', function (req, res) {
  var request_signature = req.headers['api-sign'];
  var request_nonce = req.headers['api-nonce'];
  var request_body = JSON.stringify(req.body);
  var host_url = demo_host + "/callback-url"

  var verified = yellow.verifyIPN(api_secret, host_url, request_nonce, request_signature, request_body)

  if (!verified){
    /*
    If signatures are not the same, that means it could be a malicious request:
    reject it!
    */
    console.log("403")
    res.sendStatus(403);
    return
  }

  var invoice = req.body.id || null;
  var status = req.body.status || null;

  if(invoice === null || status === null){
    /*
    This should never happen (we'll always include an invoice id and
    status), but if it does responding with a 400 will alert us to a
    problem.
    */
    console.log("400")
    res.sendStatus(400);
    return

  }

  console.log("Querying Order Management System for order matching invoice id: " + invoice)

  if(status === "authorizing"){
    console.log("Order is 'pending confirmation', redirecting customer to order complete page.")
  } else if(status === "paid") {
    console.log("Order is 'complete', shipping product to customer.")
  }
  console.log("200")
  res.sendStatus(200);
  return

});





var server = app.listen(3000, function(){

  var host = server.address().address;
  var port = server.address().port;

  console.log('Yellow example app listening at http://%s:%s', host, port);

});
