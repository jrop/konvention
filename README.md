# Konvention

Konvention is middleware for Express.js that automatically mounts controllers to appropriate sub-url paths.

Controllers are defined as express-routers that reside in a predefined `controllers/` directory.  For example, given the following directory structure:

```
app.js
controllers/
    admin/
        index.js (1)
    api.js (2)
    index.js (3)
```

Konvention will mount (1) at the path `/admin`, (2) at `/api`, and (3) at `/`.

Your `app.js` file could look something like:

```
var express = require('express')
var konvention = require('konvention')
// ...
var app = express()
app.use(konvention())
// ...
app.listen(80)

```

It also provides one convenience: it overrides the `Response.render` method for each controller to automatically prefix your view-names with the appropriate sub-directory.  For example, using the above directory structure as an example, we could have the following parallel directory structure for our views (assume for example's sake that we are using the vash view-engine):

```
views/
    admin/
        dashboard.vash
    index.vash
```

In the admin controller (file [1] above), we could add the following line to one of our route-handlers:

```
response.render('dashboard')
```
Konvention will automatically prepend the sub-path `admin/` to the view-name so that `views/admin/dashboard.vash` will render.

## Options

You may pass options to the `konvention()` call to configure its behavior:

* `logger`: a log4js logger, or null to turn logging off
* `controllersDirectory`: the directory name to scan for controllers

## Installation

Use npm: `npm install konvention`

## Changes from v1.0

In this version, Konvention was significantly scaled-down from version 1.0, adhering to the philosophy of doing one thing, and doing that thing well.  This philosophy will be the future motivation for developing Konvention further.
* Konvention is now middleware, instead of a replacement for your `app.js` file (breaking change)
* Konvention no longer provides configuration management -- there are other modules that do it better

## Contribute

If you have added a feature, or cleaned up the code a bit, submit a pull-request!

## License

### MIT License

Copyright (c) 2015 Jonathan Apodaca

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.