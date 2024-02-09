/*
Copyright (c) 2017, ZOHO CORPORATION
License: MIT
*/
const fs = require('fs');
const path = require('path');
const express = require('express');
const { static: expressStatic } = require('express');

const { json, urlencoded } = require('body-parser');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const serveIndex = require('serve-index');
const { createServer } = require('https');
const { green, bold } = require('chalk');

process.env.PWD = process.env.PWD || process.cwd();


var expressApp = express();
var port = 5000;

expressApp.set('port', port);
expressApp.use(morgan('dev'));
expressApp.use(json());
expressApp.use(urlencoded({ extended: false }));
expressApp.use(errorHandler());


expressApp.use('/', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

expressApp.get('/plugin-manifest.json', function (req, res) {
  res.sendfile('plugin-manifest.json');
});

expressApp.use('/app', expressStatic('app'));
expressApp.use('/app', serveIndex('app'));


expressApp.get('/', function (req, res) {
  res.redirect('/app');
});

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

createServer(options, expressApp).listen(port, function () {
  console.log(green('Zet running at ht' + 'tps://127.0.0.1:' + port));
  console.log(bold.cyan("Note: Please enable the host (https://127.0.0.1:" + port + ") in a new tab and authorize the connection by clicking Advanced->Proceed to 127.0.0.1 (unsafe)."));
}).on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    console.log(bold.red(port + " port is already in use"));
  }
});
