var express = require('express')
var extend = require('extend')
var glob = require('glob')
var log4js = require('log4js')
var path = require('path')

//
// wrap the controller to change the 'render'
// method to be 'context-sensitive' (to the
// controllers sub-directory)
//
function controllerWrapper(subdir, controller) {
	return function(req, res, next) {
		res._render = res.render;
		res.render = function(view, locals, callback) {
			res._render(path.join(subdir, view), locals, callback)
		};
		controller(req, res, next)
	}
}

module.exports = function(settings) {
	settings = settings || {}
	settings = extend({
		logger: log4js.getLogger('konvention'),
		controllersDirectory: 'controllers'
	}, settings)

	function noop() {}
	settings.logger = settings.logger || {
		trace: noop, debug: noop, info: noop,
		warn: noop, error: noop, fatal: noop
	}

	// create 'root' mount-point
	var base = express.Router()

	// mount controllers to 'base'
	var controllersDir = path.resolve(process.cwd(), settings.controllersDirectory)
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
			settings.logger.info('Mounted "' + file + '" at ' + mountPoint)
		} catch (e) {
			settings.logger.trace(e.stack)
		}
	})

	return base
}
