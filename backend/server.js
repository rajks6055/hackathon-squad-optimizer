const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.text());

app.post('/api/optimize', (req, res) => {
    const inputData = req.body;
    
    // Dynamically select the correct binary based on the OS (Windows vs Linux Docker)
    const isWindows = process.platform === 'win32';
    const engineName = isWindows ? 'optimizer.exe' : 'optimizer';
    
    // Path assumes the 'engine' folder is now inside the 'backend' folder
    const exePath = path.join(__dirname, 'engine', engineName);

    const child = spawn(exePath);
    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => output += data.toString());
    child.stderr.on('data', (data) => errorOutput += data.toString());

    child.on('close', (code) => {
        if (code !== 0) {
            console.error("Engine Error:", errorOutput);
            return res.status(500).json({ error: 'C++ Engine failed.' });
        }
        try {
            res.json(JSON.parse(output));
        } catch (e) {
            console.error("Parse Error. Raw output:", output);
            res.status(500).json({ error: 'Failed to parse engine output.' });
        }
    });

    child.stdin.write(inputData);
    child.stdin.end();
});

// CRITICAL: Cloud providers like Render dynamically assign ports via environment variables
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Bridge Server running on port ${PORT}`);
});