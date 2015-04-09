var express = require('express')
var glob = require('glob')
var path = require('path')

var appExtender = require('./app-extender.js')
var configLoader = require('./config-loader.js')
var controllerLoader = require('./controller-loader.js')

// create application object
var app = express();

appExtender(app)
configLoader(app)
controllerLoader(app)

if (app.get('auto start') === true)
	// start the app
	app.start()

module.exports = app
