mimicry - browser-like requests
===============================

Mimicry is a node.js library designed to mimic how a browser would request the page. Useful for getting around websites that try to block spiders.

Features:
 * Stores cookies
 * Follows redirects
 * Spoofs useragents
 * Works like any other request library (sort of)

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