var fs = require('fs')
var path = require('path')

module.exports = function(app, initialConfig) {
	var initialConfig = initialConfig || {}

	// default config values:
	var defaultConfig = {
		'root': '/',
		'port': 80,
		'auto start': true
	};
	for (var confName in defaultConfig) {
		var confValue = defaultConfig[confName]
		if (confName in initialConfig)
			confValue = initialConfig[confName]

		app.set(confName, confValue)
	}

	var confFiles = [ app.resolve('./conf.js'), app.resolve('./conf.' + app.environment + '.js') ]
	confFiles.forEach(function(conf) {
		try {
			if (fs.existsSync(conf))
				require(conf)(app)
			else
				app.warn('Configuration file not found: "' + conf + '"')
		} catch (e) {
			app.trace('Error loading configuration file: "' + conf + '"')
		}
	})

	app.info('Running in ' + app.environment + ' mode')
}
