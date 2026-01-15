// Test script to verify API proxy is working
const http = require('http');

console.log('🧪 Testing DramaBox API Proxy...\n');

// Test the random drama endpoint
const testEndpoint = (endpoint) => {
    return new Promise((resolve, reject) => {
        const req = http.get(`http://localhost:3000/api/${endpoint}`, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`✅ ${endpoint}: OK (${jsonData.length || 'N/A'} items)`);
                    resolve(true);
                } catch (e) {
                    console.log(`❌ ${endpoint}: Invalid JSON response`);
                    resolve(false);
                }
            });
        });

        req.on('error', (err) => {
            console.log(`❌ ${endpoint}: ${err.message}`);
            resolve(false);
        });

        req.setTimeout(10000, () => {
            console.log(`⏰ ${endpoint}: Timeout`);
            req.destroy();
            resolve(false);
        });
    });
};

async function runTests() {
    const endpoints = [
        'dramabox/randomdrama',
        'dramabox/foryou',
        'dramabox/latest',
        'dramabox/trending',
        'dramabox/populersearch'
    ];

    console.log('Testing API endpoints...\n');

    for (const endpoint of endpoints) {
        await testEndpoint(endpoint);
    }

    // Test search endpoint
    console.log('\nTesting search endpoint...');
    await testEndpoint('dramabox/search?query=cinta');

    console.log('\n🎉 API Proxy test completed!');
    console.log('💡 If all tests passed, CORS issues are resolved.');
    console.log('🌐 Open http://localhost:3000 in your browser to use the app.');
}

runTests().catch(console.error);
