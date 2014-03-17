/*
 Mimicry
 A simple HTTP request library that mimics a browser.
*/

var http  		= require('http'),
	url   		= require('url'),
	zlib   		= require('zlib'),
	tough  		= require('tough-cookie'),
	Cookie 		= tough.Cookie,
	querystring = require('querystring');

function Mimicry(useragent)
{
	// default to Chrome
	if(!useragent)
		useragent = "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36";

	var defaultHeaders = {
		'User-Agent': useragent,
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'Accept-Encoding': 'gzip,deflate,sdch',
		'Accept-Language': 'en-US,en;q=0.8',
		'Cache-Control': 'max-age=0',
		'Connection': 'keep-alive'
	};

	var cookieJar = {};

	this.get = function(urlStr, customHeaders, callback) { makeRequest(urlStr, null, customHeaders, callback); };
	this.post = function(urlStr, data, customHeaders, callback) { makeRequest(urlStr, data, customHeaders, callback); };

	function makeRequest(urlStr, postData, customHeaders, callback) {
		if(customHeaders instanceof Function) 
		{
			callback = customHeaders;
			customHeaders = null;
		}
		var uri = url.parse(urlStr);
		headers = JSON.parse(JSON.stringify(defaultHeaders)); // copy
		var cookies = getCookies(uri.host);
		if(cookies != '')
			headers['Cookie'] = getCookies(uri.host);
		if(customHeaders)
			for(var h in customHeaders)
				headers[h] = customHeaders[h];
		function reqCallback(err, data, headers) {
			if(err)
				callback(err, null);
			else
			{
				if(headers['set-cookie'])
					parseCookies(headers['set-cookie']);
				if(headers['location'])
					makeGet(headers['location'], customHeaders, callback);
				else
					callback(null, data.toString('utf8'));
			}
		}
		if(postData)
		{
			var data = querystring.stringify(postData);
			headers['Content-Type'] = 'application/x-www-form-urlencoded';
			headers['Content-Length'] = data.length;
			makePostRequest(data, {
				host: uri.host,
				port: (uri.protocol == 'https' ? 443 : 80),
				path: uri.path,
				headers: headers,
				method: 'POST'
			}, reqCallback);
		}
		else
			makeGetRequest({
				host: uri.host,
				port: (uri.protocol == 'https' ? 443 : 80),
				path: uri.path,
				headers: headers
			}, reqCallback);
	}

	// Internal function, make an HTTP request and return the response
	function makeGetRequest(options, callback) {
		var response = new Buffer(0);
		http.get(options, function(resp) {
			resp.on('data', function(chunk) {
				response = Buffer.concat([response, chunk], response.length + chunk.length);
			});
			resp.on('end', function() {
				if(resp.headers['content-encoding'] == 'gzip')
					zlib.unzip(response, function(err, buffer) {
						if(err)
							callback(err, null, null);
						else
							callback(null, buffer, resp.headers);
					});
				else
					callback(null, response, resp.headers);
			});
		}).on('error', function(e) {
			callback(e.message, null, null);
		});
	}

	function makePostRequest(data, options, callback) {
		var response = new Buffer(0);
		var post = http.request(options, function(resp) {
			resp.on('data', function(chunk) {
				response = Buffer.concat([response, chunk], response.length + chunk.length);
			});
			resp.on('end', function() {
				if(resp.headers['content-encoding'] == 'gzip')
					zlib.unzip(response, function(err, buffer) {
						if(err)
							callback(err, null, null);
						else
							callback(null, buffer, resp.headers);
					});
				else
					callback(null, response, resp.headers);
			});
		}).on('error', function(e) {
			callback(e.message, null, null);
		});

		post.write(data);
		post.end();
	}

	function parseCookies(setcookie) {
		if (setcookie instanceof Array)
			cookies = setcookie.map(function (c) { return (Cookie.parse(c)); });
		else
			cookies = [Cookie.parse(setcookie)];
		for(var c in cookies)
		{
			var cookie = cookies[c];
			if(cookie.domain)
			{
				cookieJar[cookie.domain] = cookieJar[cookie.domain] || [];
				cookieJar[cookie.domain].push(cookie);
			}
			else
			{
				cookieJar['none'] = cookieJar['none'] || [];
				cookieJar['none'].push(cookie);
			}
		}
	}

	function getCookies(domain) {
		var cookieString = '';
		for(var c in cookieJar[domain])
		{
			var cookie = cookieJar[domain][c];
			cookieString += cookie.key + '=' + cookie.value + '; ';
		}
		for(var c in cookieJar['none'])
		{
			var cookie = cookieJar['none'][c];
			cookieString += cookie.key + '=' + cookie.value + '; ';
		}
		return cookieString.replace(/; $/, '');
	}
}

module.exports = Mimicry;