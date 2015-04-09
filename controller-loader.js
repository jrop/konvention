var express = require('express')
var path = require('path')
var glob = require('glob')

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

module.exports = function(app) {
	// create 'root' mount-point
	var base = express.Router()
	app.use(app.get('root'), base)

	// mount controllers to 'base'
	//var controllersDir = path.relative(__dirname, process.cwd() + '/controllers/')
	var controllersDir = path.resolve(app.cwd(), 'controllers')
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
			app.info('Mounted "' + file + '" at ' + mountPoint)
		} catch (e) {
			app.trace(e.stack)
		}
	})
}
