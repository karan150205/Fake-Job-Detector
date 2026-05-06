import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company_profile: { type: String },
    description: { type: String, required: true },
    requirements: { type: String },
    location: { type: String },
    salary: { type: String },
    email: { type: String },
    is_fake: { type: Boolean, required: true },
    confidence: { type: Number, required: true },
    reasons: { type: [String] },
    analytics: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', JobSchema);

export default Job;
