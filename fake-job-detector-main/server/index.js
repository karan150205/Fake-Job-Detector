import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import Job from './models/Job.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000/predict';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
// POST /analyze-job
app.post('/analyze-job', async (req, res) => {
    try {
        const jobData = req.body;
        
        // Basic validation
        if (!jobData.title || !jobData.description) {
            return res.status(400).json({ error: 'Title and description are required.' });
        }
        
        // Call ML API
        let mlResponse;
        try {
            mlResponse = await axios.post(ML_API_URL, jobData);
        } catch (mlErr) {
            console.error('Error connecting to ML API:', mlErr.message);
            return res.status(500).json({ error: 'Error connecting to ML service.' });
        }
        
        const { is_fake, confidence, reasons, analytics } = mlResponse.data;
        
        // Save to DB
        const newJob = new Job({
            title: jobData.title,
            company_profile: jobData.company_profile || '',
            description: jobData.description,
            requirements: jobData.requirements || '',
            location: jobData.location || '',
            salary: jobData.salary || '',
            email: jobData.email || '',
            is_fake: is_fake,
            confidence: confidence,
            reasons: reasons,
            analytics: analytics
        });
        
        await newJob.save();
        
        res.status(200).json({
            job: newJob,
            is_fake,
            confidence,
            reasons,
            analytics
        });
        
    } catch (err) {
        console.error('Error in /analyze-job:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// GET /history
app.get('/history', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 }).limit(50);
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching history.' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
