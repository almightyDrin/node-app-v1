/* Primary file for API */

// Dependencies
const http = require('http')
const url = require('url')
const { StringDecoder } = require('string_decoder')

// The server should respont to all request with a string
const server = http.createServer((req, res) => {

    // Get the URL and parse it
    const parsedURL = url.parse(req.url,true)

    // Get the path
    const path = parsedURL.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')

    // Get the query string as an object
    const queryStringObj = parsedURL.query

    // Get the HTTP Method
    const method = req.method.toLowerCase()

    // Get the headers as an object
    const headers = req.headers

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8')
    let buffer = ''
    req.on('data',(data) => buffer += decoder.write(data))
    req.on('end',() => {
        buffer += decoder.end()

        // Choose the handler this request should go to. If one is not found, use the notFound handler instead.
        const chosenHandler = typeof router[trimmedPath] !== 'undefined' ? router[trimmedPath] : handlers.notFound

        // Construct the data object to send to the handler
        const data = {
            trimmedPath,
            queryStringObj,
            method,
            headers,
            payload: buffer
        }

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {

            // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof statusCode == 'number' ? statusCode : 200

            // Use the payload returned from the handler, or set the default payload to an empty object
            payload = typeof payload == 'object' ? payload : {}

            // Convert the payload to a string
            const payloadString = JSON.stringify(payload)

            // Return the response
            res.setHeader("Content-Type", "application/json")
            res.writeHead(statusCode)
            res.end(payloadString)
            console.log('Returning this response: ', statusCode, payloadString)

        })
    })
})

// Start the server and have it listen on port 3000
let port = 3000
server.listen(port, () => console.log(`Listening to port ${port}`))

// Define the handlers
const handlers = {}

// Sample handler
handlers.sample = (data, callback) => {
    // Callback a http status code, and a payload object
    callback(406, {name: 'sample handler'})
}

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404)
}

// Define a request router
const router = {
    sample: handlers.sample
}