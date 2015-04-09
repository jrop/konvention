var path = require('path')

module.exports = function(app) {
	app.cwd = function() {
		return process.cwd()
	}

	app.resolve = function(f) {
		return path.resolve(app.cwd(), f)
	}

	app.start = function() {
		app.listen(app.get('port'))
		app.info('Listening on port ' + app.get('port'))
	}

	//
	// BEGIN logging
	//
	app.log = function() {
		if (app.get('konvention quiet') === true) return;
		console.log.apply(console, arguments)
	}

	app.info = function() {
		if (app.get('konvention quiet') === true) return;
		console.info.apply(console, arguments)
	}

	app.error = function() {
		if (app.get('konvention quiet') === true) return;
		console.error.apply(console, arguments)
	}

	app.warn = function() {
		if (app.get('konvention quiet') === true) return;
		console.warn.apply(console, arguments)
	}

	app.dir = function() {
		if (app.get('konvention quiet') === true) return;
		console.dir.apply(console, arguments)
	}

	app.trace = function() {
		if (app.get('konvention quiet') === true) return;
		console.trace.apply(console, arguments)
	}
	//
	// END logging
	//

	app.environment = app.env = process.env.NODE_ENV || 'production';
}
