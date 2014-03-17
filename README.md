mimicry - browser-like requests
===============================

Mimicry is a node.js library designed to mimic how a browser would request the page. Useful for getting around websites that try to block spiders.

Features:
 * Stores cookies
 * Follows redirects
 * Spoofs useragents
 * Works like any other request library (sort of)

Install:
```
$ npm install mimicry
```

Usage
-----

To use mimicry, you first have to create a mimicry instance:
```javascript
var Mimicry = require('mimicry');

var weather = new Mimicry();
```

You can also pass a useragent to the constructor:
```javascript
var weather = new Mimicry('Googlebot/2.1');
```

Then, to make a get request:
```javascript
weather.get('http://weather.yahooapis.com/forecastrss?w=2459115', function(err, data) {
	console.log(data);
});
```

You can also pass custom headers, like a referer:
```javascript
weather.get('http://weather.yahooapis.com/forecastrss?w=2459115', {'Referer': 'http://google.com/'}, function(err, data) {
	console.log(data);
});
```
To make a post request:
```javascript
weather.post('http://weather.yahooapis.com/forecastrss?w=2459115', {'test': 'data'}, function(err, data) {
	console.log(data);
});
```

You can do the same thing with custom headers:
```javascript
weather.post('http://weather.yahooapis.com/forecastrss?w=2459115', {'test': 'data'}, {'Referer': 'http://google.com/'}, function(err, data) {
	console.log(data);
});
```

Streaming isn't supported, sorry!

License
-------
The MIT License (MIT)

Copyright (c) 2014 Andrew Rogers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.