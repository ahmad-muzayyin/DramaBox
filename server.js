import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        config: {
            isFreeApp: false,
            enableAds: true,
            adProvider: 'google',
            adsterraKey: '',
            googleAdsClient: ''
        },
        members: [
            { id: 1, username: 'user', email: 'user@example.com', password: 'user', role: 'member', lastDailyCheck: null, expiryDate: null, joinDate: '2023-10-01', status: 'active' },
            { id: 2, username: 'ahmad', email: 'ahmad@example.com', password: '123', role: 'vip', lastDailyCheck: null, expiryDate: '2025-12-31', joinDate: '2023-11-15', status: 'active' },
            { id: 3, username: 'siti_nurbaya', email: 'siti@example.com', password: '123', role: 'member', lastDailyCheck: null, expiryDate: null, joinDate: '2023-12-05', status: 'suspended' },
            { id: 4, username: 'budi_doremi', email: 'budi@example.com', password: '123', role: 'member', lastDailyCheck: null, expiryDate: null, joinDate: '2024-01-10', status: 'active' },
            { id: 5, username: 'premium_user', email: 'vip@example.com', password: '123', role: 'vip', lastDailyCheck: null, expiryDate: '2024-12-31', joinDate: '2024-01-12', status: 'active' }
        ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

// Helper to read DB
const readDb = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return { config: {}, members: [] };
    }
};

// Helper to write DB
const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- ROUTES ---

// Get Config
app.get('/api/config', (req, res) => {
    const db = readDb();
    res.json(db.config);
});

// Update Config
app.post('/api/config', (req, res) => {
    const db = readDb();
    db.config = { ...db.config, ...req.body };
    writeDb(db);
    res.json(db.config);
});

// Get Members
app.get('/api/members', (req, res) => {
    const db = readDb();
    res.json(db.members);
});

// Add/Update Member
app.post('/api/members', (req, res) => {
    const db = readDb();
    const newMember = req.body;

    if (newMember.id) {
        // Update existing
        db.members = db.members.map(m => m.id === newMember.id ? newMember : m);
    } else {
        // Create new
        newMember.id = Date.now();
        db.members.push(newMember);
    }

    writeDb(db);
    res.json(newMember);
});

// Delete Member
app.delete('/api/members/:id', (req, res) => {
    const db = readDb();
    const id = parseInt(req.params.id);
    db.members = db.members.filter(m => m.id !== id);
    writeDb(db);
    res.json({ success: true });
});

// --- DRAMA API PROXY ---
app.get('/api/dramabox/:path*', async (req, res) => {
    try {
        const fullPath = req.params.path || '';
        const queryString = req.url.split('?')[1] || '';
        const targetUrl = `https://dramabox.sansekai.my.id/api/dramabox/${fullPath}${queryString ? '?' + queryString : ''}`;

        console.log(`Proxying request to: ${targetUrl}`);

        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });
        res.json(response.data);
    } catch (err) {
        console.error('Proxy Error:', err.message);
        res.status(err.response?.status || 500).json({
            error: 'Failed to fetch drama data',
            details: err.message
        });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
