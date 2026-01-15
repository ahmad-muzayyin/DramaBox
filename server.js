const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    // API Proxy for DramaBox API
    if (pathname.startsWith('/api/')) {
        const apiPath = pathname.replace('/api/', '');
        const targetUrl = `https://dramabox.sansekai.my.id/api/${apiPath}`;

        // Parse query parameters
        const queryString = parsedUrl.search || '';

        proxyRequest(targetUrl + queryString, req, res);
        return;
    }

    // Default to index.html for root path
    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    // Security: Prevent directory traversal
    if (pathname.includes('..') || pathname.includes('\\')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    const filePath = path.join(__dirname, pathname);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - File Not Found</title>
                        <style>
                            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #121212; color: #fff; }
                            h1 { color: #ff6b6b; }
                            a { color: #4ecdc4; text-decoration: none; }
                        </style>
                    </head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file <strong>${pathname}</strong> was not found.</p>
                        <p><a href="/">Go back to DramaBox</a></p>
                    </body>
                    </html>
                `);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            return;
        }

        if (stats.isDirectory()) {
            // If it's a directory, serve index.html
            const indexPath = path.join(filePath, 'index.html');
            fs.stat(indexPath, (err, indexStats) => {
                if (!err && indexStats.isFile()) {
                    serveFile(indexPath, res);
                } else {
                    res.writeHead(403, { 'Content-Type': 'text/plain' });
                    res.end('Directory listing not allowed');
                }
            });
        } else {
            serveFile(filePath, res);
        }
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }

        // Add cache-busting for JavaScript files during development
        const cacheControl = mimeType === 'text/javascript'
            ? 'no-cache, no-store, must-revalidate'
            : 'public, max-age=31536000';

        res.writeHead(200, {
            'Content-Type': mimeType,
            'Cache-Control': cacheControl,
            'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
    });
}

function proxyRequest(targetUrl, clientReq, clientRes) {
    const parsedUrl = url.parse(targetUrl);

    const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: clientReq.method,
        headers: {
            'User-Agent': 'DramaBox-Proxy/1.0',
            'Accept': '*/*',
            ...clientReq.headers
        }
    };

    // Remove hop-by-hop headers
    delete options.headers['host'];
    delete options.headers['connection'];
    delete options.headers['keep-alive'];
    delete options.headers['proxy-authenticate'];
    delete options.headers['proxy-authorization'];
    delete options.headers['te'];
    delete options.headers['trailers'];
    delete options.headers['transfer-encoding'];
    delete options.headers['upgrade'];

    const proxyReq = https.request(options, (proxyRes) => {
        // Copy response headers
        const responseHeaders = { ...proxyRes.headers };

        // Add CORS headers
        responseHeaders['Access-Control-Allow-Origin'] = '*';
        responseHeaders['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';

        clientRes.writeHead(proxyRes.statusCode, responseHeaders);

        // Pipe the response
        proxyRes.pipe(clientRes);
    });

    proxyReq.on('error', (err) => {
        console.error('Proxy request error:', err);
        clientRes.writeHead(500, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        clientRes.end(JSON.stringify({
            error: 'Failed to fetch from API',
            message: err.message
        }));
    });

    // Pipe the request body if any
    clientReq.pipe(proxyReq);

    // Handle request timeout
    proxyReq.setTimeout(30000, () => {
        proxyReq.destroy();
        clientRes.writeHead(504, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        clientRes.end(JSON.stringify({
            error: 'Request timeout',
            message: 'API request took too long'
        }));
    });
}

server.listen(PORT, HOST, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                     🎬 DRAMA BOX STREAMING                     ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Server is running at: http://${HOST}:${PORT}                   ║
║                                                              ║
║  ✅ CORS Fixed - API Proxy enabled                           ║
║  📡 API Source: https://dramabox.sansekai.my.id/api         ║
║                                                              ║
║  Features:                                                   ║
║  • Random Drama                                              ║
║  • For You (Personalized)                                    ║
║  • Latest Drama                                              ║
║  • Trending Drama                                            ║
║  • Popular Search                                            ║
║  • Search Functionality                                      ║
║  • Video Player with Episodes                                ║
║                                                              ║
║  Press Ctrl+C to stop the server                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
    console.log('\n\nShutting down DramaBox server...');
    server.close(() => {
        console.log('Server stopped.');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
