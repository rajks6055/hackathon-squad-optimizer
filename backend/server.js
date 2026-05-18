const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();

// Allow React (running on a different port) to talk to this server
app.use(cors());

// Tell the server to expect raw text input
app.use(express.text());

app.post('/api/optimize', (req, res) => {
    const inputData = req.body;
    
    // Locate the C++ executable. We go up one folder (..), then into 'engine'
    const exePath = path.join(__dirname, '..', 'engine', 'optimizer.exe');

    // Start the C++ program
    const child = spawn(exePath);

    let output = '';
    let errorOutput = '';

    // Capture the JSON printed by C++
    child.stdout.on('data', (data) => {
        output += data.toString();
    });

    // Capture any errors
    child.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });

    // When the C++ program finishes...
    child.on('close', (code) => {
        if (code !== 0) {
            console.error("Engine Error:", errorOutput);
            return res.status(500).json({ error: 'C++ Engine failed to execute.' });
        }
        try {
            // Convert the C++ string output into a real JSON object and send it to React
            const jsonResult = JSON.parse(output);
            res.json(jsonResult);
        } catch (e) {
            console.error("Failed to parse JSON. Raw output:", output);
            res.status(500).json({ error: 'Failed to parse engine output.' });
        }
    });

    // Feed the raw text from React directly into the C++ program's standard input
    child.stdin.write(inputData);
    child.stdin.end();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Bridge Server running on http://localhost:${PORT}`);
});