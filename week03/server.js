const http = require('http')

http.createServer((request, response) => {
    let body = []
    request.on('error', (err) => {
        console.log(err)
    }).on('data', (chunk) => {
        console.log(chunk)
        body.push(chunk)
    }).on('end', () => {
        body = Buffer.concat(body).toString()
        console.log('body:', body)
        response.setHeader('Content-Type', 'text/html')
        response.writeHead(200, {'Content-Type': 'text/plain'})
        response.end(`<html maaa=a>
        <head>
            <style>
                body div #myid{
                    width: 100px;
                    background: #ff5000;
                }
                body div img {
                    width: 30px;
                    background: #fff500;
                }
            </style>
            <body>
                <div>
                    <img id="myid"/>
                    <img />
                </div>
            </body>
        </head>
        </html>`)
    })
}).listen(8088)

console.log('serve started')