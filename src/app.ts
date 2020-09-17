
import express from 'express';

import { BadgerBankTransaction } from './model/badger-bank-transaction';
import { BadgerBankTransactionRequest } from './model/requests/badger-bank-transaction-request';

const fs = require('fs');
const errorHandler = require('errorhandler');
const morgan = require("morgan");
const app = express();
const rateLimit = require("express-rate-limit");
const bodyParser = require('body-parser');
const port = 3000;

const class_data = JSON.parse(fs.readFileSync('./includes/classes.json'));
const completed_data = JSON.parse(fs.readFileSync('./includes/completed.json'));

app.use(morgan(':date ":method :url" :status :res[content-length] - :response-time ms'));

morgan.token('date', function() {
    var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
    return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
});

process.on('uncaughtException', function (exception) {
    console.log(exception);
});

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

app.use(errorHandler({ dumpExceptions: true, showStack: true })); 

// JSON Body Parser Configuration
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Request Throttler
app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2000 // limit each IP to 2000 requests per windowMs (minute)
});
app.use(limiter);

// Allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/api/react/classes', (req, res) => {
    res.send(class_data);
});
  
app.get('/api/react/students/5022025924/classes/completed', (req, res) => {
    res.send(completed_data);
});


app.get('/api/badgerbank/transaction', (req, res) => {
  res.send(BadgerBankTransaction.constructRandom());
});

app.get('/api/badgerbank/transactions', (req, res) => {
    var transactionRequest = new BadgerBankTransactionRequest(req.query.amount);
    res.send(transactionRequest.getBadgerBankTransactions());
});

// Error Handling
app.use((err: any, req: any, res: any, next: any) => {
    let datetime: Date = new Date();
    let datetimeStr: string = `${datetime.toLocaleDateString()} ${datetime.toLocaleTimeString()}`;
    console.log(`${datetimeStr}: Encountered an error processing ${JSON.stringify(req.body)}`);
    res.status(400).send({
        "error-msg": "Oops! Something went wrong. Check to make sure that you are sending a valid request. Your recieved request is provided below. If it is empty, then it was most likely not provided or malformed. If you have verified that your request is valid, please contact a CS639 administrator.",
        "error-req": JSON.stringify(req.body),
        "date-time": datetimeStr
    })
});

// Open Server for Business
app.listen(port, () => {
    console.log(`CS639 Global Webserver listening on :${port}`)
});