var express = require('express')
var glob = require('glob')
var path = require('path')

var controllerWrapper = require('./controller-wrapper.js')

// create application object
var app = express();
app.environment = process.env.NODE_ENV || 'production';
console.log('Running in ' + app.environment + ' mode')

// default config values:
app.set('root', '/')
app.set('port', 80)

//
// BEGIN: load configuration files
//
function dir(s) {
	return path.resolve(process.cwd(), s)
}
var confFiles = [ dir('./conf.js'), dir('./conf.' + app.environment + '.js') ]
console.log('Loading configuration files: ' + confFiles.join(', '))
confFiles.forEach(function(conf) {
	try { require(conf)(app) }
	catch (e) { console.warn('Error loading configuration file: "' + conf + '"') }
})
//
// END: load configuration files
//

// create 'root' mount-point
var base = express.Router()
app.use(app.get('root'), base)

// mount controllers to 'base'
//var controllersDir = path.relative(__dirname, process.cwd() + '/controllers/')
var controllersDir = path.resolve(process.cwd(), 'controllers')
glob.sync(controllersDir + '/**/*.js').forEach(function(file) {
	var parts = path.parse(file)
	var filePath = path.resolve(file)
	var ctrlName = parts.name

	var subdir = parts.dir + '/'
	// remove the 'controllers' prefix
	subdir = subdir.substring(controllersDir.length)
	// remove leading '/' if any
	if (subdir.charAt(0) == '/')
		subdir = subdir.substring(1)

	if (ctrlName == 'index')
		ctrlName = ''

	var mountPoint = '/' + subdir + ctrlName

	try {
		var controller = require(filePath)
		base.use(mountPoint, controllerWrapper(subdir, controller))
		console.log('Mounted "' + file + '" at ' + mountPoint)
	} catch (e) {
		console.error(e.stack)
	}
})

// start the app
console.log('Listening on port ' + app.get('port'))
app.listen(app.get('port'))
