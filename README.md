# Konvention

[![Greenkeeper badge](https://badges.greenkeeper.io/jrop/konvention.svg)](https://greenkeeper.io/)

(assumption: the reader knows how Express.js apps work)

Konvention is an MVC framework for Express.js.  It uses just the right amount of convention-over-configuration to make building your app easy, without adding too much "magic" to the mix.

It assumes your app is structured like this:

```
my-app-folder/
    app.js
    config.js *
    config.production.js *
    config.test.js *
    controllers/
        (controller files here)
    views/
        (view files here)
```

(* optional files)

The app.js file is a one-liner:

```
require('konvention')
```

## Configuration

Configuration files take the form:

```
module.exports = function(app) {
    app.set('port', 80)
    app.set('root', '/')

    app.use(require('morgan')())

    // any other configuration here
}
```

First the file `config.js` is loaded, and then the environment-specific config-file (`config.production.js` or `config.whatever.js`) is loaded second!  The environment is inferred from the `NODE_ENV` environment variable.  Easy!

```
my-prompt$ NODE_ENV=debug node app.js
```

This would load the two config files (in this order): `config.js` and `config.debug.js`.

## Controllers

Controllers go into the `controllers/` sub-directory, as `*.js` files, and take the form:

```
module.exports = require('express').Router()
    .get('/', function(req, res) {
        res.end('Hello World!')
    })
```

If the controller's file-name is `index.js`, it is mounted at the path `/`.  For example, say we have two controllers:

```
controllers/
    index.js
    admin.js
```

The router in `index.js` will be mounted at the path `/` (equivalent to `app.use('/', require('controllers/index.js'))` and `admin.js` will be mounted at `/admin`.  Sub-directories are taken into account as well, for instance:

```
controllers/
    index.js
    my-sub-dir/
        my-sub-controller.js
```

In this case, the `Router` exported by `my-sub-controller.js` will be mounted at `/my-sub-dir/my-sub-controller`.

## Views

According to the rules above, views for controllers must be in a directory structure that reflects the controller's directory structure that it resides in.  When using Express.js's `render` function, only the view name is used because this framework intelligently infers the sub-directory by what sub-path the `Router` was mounted to.

For example, say my `Router` was mounted at the path `admin`.  In my handlers, I may just code this:

```
// ...
.get('/dashboard', function(req, res) {
    res.render('dashboard')
})
// ...
```
The framework will delegate this call to Express.js, prepending the view-name with the path `'admin/'` as if you had called:

```
res.render('admin/dashboard')
```

## Make it Better

If you have added a feature, or cleaned up the code a bit, submit a pull-request!

## License

### MIT License

Copyright (c) 2015 Jonathan Apodaca

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.