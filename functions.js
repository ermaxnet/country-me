const https = require("https");
const http = require("http");
const url = require("url");
const querystring = require("querystring");

const request = (endpoint, query = null, options = {}) => {
    let { hostname, path, protocol } = url.parse(endpoint);
    let headers = options.headers || {};
    const method = options.method || "GET";
    if(query) {
        query = querystring.stringify(query);
        if(method === "POST") {
            headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Content-Length": Buffer.byteLength(query),
                ...headers
            };
        } else {
            path += "?" + query;
        }
    }
    const isHttps = (protocol || options.protocol || "").indexOf("https") !== -1;
    protocol = isHttps ? https : http;
    const port = (options.port 
        ? options.port 
        : isHttps ? 443 : 80);
    delete options.protocol;
    options = {
        ...options,
        hostname, path, port,
        method,
        headers
    };
    const task = new Promise((done, error) => {
        const request = protocol.request(options, response => {
            let data = "";
            response.on("data", chunk => data += chunk);
            response.on("end", () => done(JSON.parse(data)));
        }).on("error", err => error(err));
        if(method === "POST" && query) {
            request.write(query);
        }
        request.end();
    });
    return task;
};

module.exports = {
    request
};