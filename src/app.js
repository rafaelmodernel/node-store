'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();
mongoose.connect(config.connectionString); 

const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');

app.use(bodyParser.json({
    limit: config.jsonSizeLimit
}));

app.use(bodyParser.urlencoded({ 
    extended: false 
}));

app.use(function(req, res, next){
   res.header('Acces-Control-Allow-Origin','*') ;
   res.header('Acces-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accepted, x-access-token') ;
   res.header('Acces-Control-Allow-Methods','GET, POST, PUT, DELETE, OPTIONS') ;
   next();
});

app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);   
app.use('/orders', orderRoute);

module.exports = app;