import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
    degree: {
        type: String,
        default: "",
        trim: true
    },
    institution: {
        type: String,
        default: "",
        trim: true
    },
    startYear: {
        type: String,
        default: ""
    },
    endYear: {
        type: String,
        default: ""
    },
    grade: {
        type: String,
        default: ""
    }
}, { _id: false });
const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        default: "",
        trim: true
    },
    position: {
        type: String,
        default: "",
        trim: true
    },
    startDate: {
        type: String,
        default: "",
        trim: true
    },
    endDate: {
        type: String,
        default: "",
        trim: true
    },
    location: {
        type: String,
        default: "",
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    }
}, { _id: false });
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
        trim: true
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    link: {
        type: String,
        default: "",
        trim: true
    },
    technologies: {
        type: [String],
        default: []
    }
}, { _id: false });
const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        default: "",
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
        maxlength: 254
    },
    headline: {
        type: String,
        default: "",
        trim: true,
        maxlength: 120
    },
    template: {
        type: String,
        enum: ['classic', 'modern', 'compact'],
        default: 'classic'
    },
    title: {
        type: String,
        default: "My resume",
        trim: true,
        maxlength: 100
    },

    phone: {
        type: String,
        default: "",
        trim: true
    },
    address: {
        type: String,
        default: "",
        trim: true
    },
    summary: {
        type: String,
        default: "",
        trim: true
    },
    linkedin: {
        type: String,
        default: "",
        trim: true
    },
    github: {
        type: String,
        default: "",
        trim: true
    },
    portfolio: {
        type: String,
        default: "",
        trim: true
    },
    education: {
        type: [educationSchema],
        default: []
    },
    experience: {
        type: [experienceSchema],
        default: []
    },
    projects: {
        type: [projectSchema],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    aiGenerated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;