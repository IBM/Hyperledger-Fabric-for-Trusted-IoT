// Requires statements and code for non-production mode usage
// if (!process.env.NODE_ENV || !process.env.NODE_ENV === 'production') {
//  require('appmetrics-dash').attach();
//}

var http = require('http');
var https = require('https');
var util = require("util");
var express = require("express");
var crypto = require("crypto");
try { bcrypt = require('bcrypt'); }
catch(e) { bcrypt = require('bcryptjs'); }
var nopt = require("nopt");
var path = require("path");
var fs = require("fs-extra");
var RED = require("node-red");
// var health = require('@cloudnative/health-connect');


// Create an Express app
var server;
var app = express();

process.env.NODE_RED_HOME = __dirname;

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

//var healthcheck = new health.HealthChecker();
//app.use('/live', health.LivenessEndpoint(healthcheck));
//app.use('/ready', health.ReadinessEndpoint(healthcheck));
//app.use('/health', health.HealthEndpoint(healthcheck));

// Create the settings object from file
var settings = require("./settings.js");
var fs = require("fs");

if (process.env.NODE_RED_TLS_CERT && process.env.NODE_RED_TLS_KEY) {
  settings.https = {
    "key" : fs.readFileSync(process.env.NODE_RED_TLS_KEY),
    "cert" : fs.readFileSync(process.env.NODE_RED_TLS_CERT)
  };
  if (process.env.NODE_RED_TLS_CA) {
    settings.https.ca = fs.readFileSync(process.env.NODE_RED_TLS_CA);
  }
  if (process.env.NODE_RED_TLS_PASS_FILE) {
    settings.https.passphrase = fs.readFileSync(process.env.NODE_RED_TLS_PASS_FILE);
  } else if (process.env.NODE_RED_TLS_PASS_ENV) {
    settings.https.passphrase = process.env.NODE_RED_TLS_PASS_ENV;
  }
  settings.requireHttps = true;
}

if (settings.https) {
  server = https.createServer(settings.https,function(req,res) {app(req,res);});
} else {
  server = http.createServer(function(req,res) {app(req,res);});
}
server.setMaxListeners(0);

function formatRoot(root) {
  if (root[0] != "/") {
      root = "/" + root;
  }
  if (root.slice(-1) != "/") {
      root = root + "/";
  }
  return root;
}

if (settings.httpRoot === false) {
  settings.httpAdminRoot = false;
  settings.httpNodeRoot = false;
} else {
  settings.httpRoot = settings.httpRoot||"/";
  settings.disableEditor = settings.disableEditor||false;
}

if (settings.httpAdminRoot !== false) {
  settings.httpAdminRoot = formatRoot(settings.httpAdminRoot || settings.httpRoot || "/");
  settings.httpAdminAuth = settings.httpAdminAuth || settings.httpAuth;
} else {
  settings.disableEditor = true;
}

if (settings.httpNodeRoot !== false) {
  settings.httpNodeRoot = formatRoot(settings.httpNodeRoot || settings.httpRoot || "/");
  settings.httpNodeAuth = settings.httpNodeAuth || settings.httpAuth;
}

if (settings.uiPort === undefined){
    settings.uiPort = 1880;
}


settings.uiHost = settings.uiHost||"0.0.0.0";

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(settings.uiPort);

// Start the runtime
RED.start();
