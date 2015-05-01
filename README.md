Yellow Node.js Demo
=========================

Demo code for creating and monitoring Yellow invoices using our Ruby SDK.

This is a simple express server with two pages:

1. A page to create an invoice in USD
2. A page to display the embedded invoice widget


This demo server just prints to the terminal when the invoice status changes - a real shopping cart integration would likely update an order management system and redirect customers to an order confirmation page.

Code comments contain additional documentation. For any other questions please email info@yellowpay.co

Thanks for using Yellow!

Setup Instructions
==================

* `git clone https://github.com/YellowPay/yellowdemo-node.git`
* Install [ngrok](https://ngrok.com) and run it, point it at local port 3000 (`ngrok 3000`). Make note of the URL ngrok gives you.
* Within the root directory of demo-node, type:
```
npm install
```
* open the `env.sh` file and add your `API_KEY`, `API_SECRET` and `DEMO_HOST`. Then source the file with the following command:
```
source env.sh
```
* Run the server!
```
node app.js
```