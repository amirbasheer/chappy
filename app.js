'use strict';
let express = require('express'),
    bodyParser = require('body-parser'),
    http = require('http'),
    app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var server = app.listen(3002);
// app.listen(3002, () => console.log('Example app listening on port 3002!'));

app.get('/', (req, res) => res.send('Hello World!'));


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "123456";

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
});


// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

    let body = req.body;
    console.log(body.object,"onject")
    console.log(body,"body")
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            console.log(entry,"entry time");
            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            // let webhook_event = entry.messaging[0];
            // console.log(webhook_event);

            // Get the sender PSID
            // let sender_psid = webhook_event.sender.id;
            // console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            // if (webhook_event.message) {
            //     console.log(webhook_event.message)
            // } else if (webhook_event.postback) {
            //     console.log(webhook_event.postback)
            // }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    }else if (body.object === 'user') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            console.log(entry, "entry time");
        });
    }else if (body.object === 'permissions') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.changes[0];
            console.log(webhook_event,"webhook_event");

            // Get the sender PSID
            let sender_psid = entry.id;
            console.log('Sender PSID: ' + sender_psid);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.value) {
                console.log(webhook_event.value,"value")
            } else if (webhook_event.postback) {
                console.log(webhook_event.postback)
            }

            console.log(entry, "entry time");
            // console.log(entry.changes[0].field, "field");
            // console.log(entry.value, "value");
            // console.log(entry, "entry time");
        });
    }else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }

});