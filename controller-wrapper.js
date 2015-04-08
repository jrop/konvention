var path = require('path')

//
// wrap the controller to change the 'render'
// method to be 'context-sensitive' (to the
// controllers sub-directory)
//

module.exports = function(subdir, controller) {
	return function(req, res, next) {
		res._render = res.render;
		res.render = function(view, locals, callback) {
			res._render(path.join(subdir, view), locals, callback)
		};
		controller(req, res, next)
	}
}
