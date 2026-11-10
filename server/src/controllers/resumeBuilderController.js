import mongoose from 'mongoose';
import Resume from '../models/resumeSchema.js';
import { getPlanEntitlements } from '../services/subscriptionService.js';

const templates = new Set(['classic', 'modern', 'compact']);
class ResumeInputError extends Error {}

const stringLimits = {
    name: 100,
    email: 254,
    headline: 120,
    title: 100,
    phone: 40,
    address: 200,
    summary: 3000,
    linkedin: 300,
    github: 300,
    portfolio: 300,
};
const itemStringLimits = {
    education: { degree: 120, institution: 160, startYear: 20, endYear: 20, grade: 60 },
    experience: { company: 160, position: 120, startDate: 40, endDate: 40, location: 100, description: 2000 },
    projects: { title: 120, description: 1500, link: 300 },
};

const cleanString = (value, maxLength, field) => {
    if (value === undefined) return undefined;
    if (typeof value !== 'string') throw new ResumeInputError(`${field} must be text.`);
    const cleaned = value.trim();
    if (cleaned.length > maxLength) throw new ResumeInputError(`${field} is too long.`);
    return cleaned;
};

const cleanStringList = (value, field, maxLength = 80) => {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length > 30) {
        throw new ResumeInputError(`${field} must contain no more than 30 items.`);
    }
    return value.map((item) => {
        if (typeof item !== 'string') throw new ResumeInputError(`${field} entries must be text.`);
        const cleaned = item.trim();
        if (cleaned.length > maxLength) throw new ResumeInputError(`${field} entry is too long.`);
        return cleaned;
    }).filter(Boolean);
};

const cleanSections = (value, section) => {
    if (value === undefined) return undefined;
    if (!Array.isArray(value) || value.length > 20) {
        throw new ResumeInputError(`${section} must contain no more than 20 entries.`);
    }
    return value.map((entry) => {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
            throw new ResumeInputError(`${section} entries must be objects.`);
        }
        const cleaned = {};
        for (const [field, maxLength] of Object.entries(itemStringLimits[section])) {
            const result = cleanString(entry[field], maxLength, `${section}.${field}`);
            if (result !== undefined) cleaned[field] = result;
        }
        if (section === 'projects') {
            const technologies = cleanStringList(entry.technologies, 'projects.technologies');
            if (technologies !== undefined) cleaned.technologies = technologies;
        }
        return cleaned;
    });
};

const cleanResumeInput = (body = {}) => {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        throw new ResumeInputError('Resume details must be an object.');
    }
    const cleaned = {};
    for (const [field, maxLength] of Object.entries(stringLimits)) {
        const result = cleanString(body[field], maxLength, field);
        if (result !== undefined) cleaned[field] = result;
    }
    if (cleaned.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
        throw new ResumeInputError('Enter a valid email address.');
    }
    if (body.template !== undefined) {
        if (!templates.has(body.template)) throw new ResumeInputError('Choose a valid resume template.');
        cleaned.template = body.template;
    }
    for (const section of ['education', 'experience', 'projects']) {
        const result = cleanSections(body[section], section);
        if (result !== undefined) cleaned[section] = result;
    }
    const skills = cleanStringList(body.skills, 'skills');
    if (skills !== undefined) cleaned.skills = skills;
    return cleaned;
};

const getOwnedResume = async (id, userId) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return Resume.findOne({ _id: id, userId });
};

const handleInputError = (error, res) => {
    if (error instanceof ResumeInputError || error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: error.message });
    }
    console.error('Resume request failed:', error.message);
    return res.status(500).json({ message: 'Unable to process resume request.' });
};

export const listResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.userId }).sort({ updatedAt: -1 }).lean();
        return res.json({
            resumes: resumes.map((resume) => ({ ...resume, canDownload: true })),
        });
    } catch (error) {
        return handleInputError(error, res);
    }
};

export const createResume = async (req, res) => {
    try {
        const entitlements = await getPlanEntitlements(req.userId);
        const resumeCount = await Resume.countDocuments({ userId: req.userId });
        if (entitlements.plan.resumeLimit !== null && resumeCount >= entitlements.plan.resumeLimit) {
            return res.status(403).json({
                code: 'FREE_RESUME_LIMIT',
                message: 'Your Free plan includes up to 2 saved resumes. Upgrade to Premium for unlimited resumes.',
            });
        }
        const details = cleanResumeInput(req.body);
        if (!entitlements.plan.templates.includes(details.template || 'classic')) {
            return res.status(403).json({
                code: 'PREMIUM_FEATURE_REQUIRED',
                message: 'This template is available with Premium. Choose the Classic template or upgrade your plan.',
            });
        }
        const resume = await Resume.create({
            ...details,
            userId: req.userId,
            name: details.name || req.user.name,
            email: details.email || req.user.email,
        });
        return res.status(201).json({ resume: { ...resume.toObject(), canDownload: false } });
    } catch (error) {
        return handleInputError(error, res);
    }
};

export const getResume = async (req, res) => {
    try {
        const resume = await getOwnedResume(req.params.id, req.userId);
        if (!resume) return res.status(404).json({ message: 'Resume not found.' });
        return res.json({ resume: { ...resume.toObject(), canDownload: true } });
    } catch (error) {
        return handleInputError(error, res);
    }
};

export const updateResume = async (req, res) => {
    try {
        const resume = await getOwnedResume(req.params.id, req.userId);
        if (!resume) return res.status(404).json({ message: 'Resume not found.' });
        const entitlements = await getPlanEntitlements(req.userId);
        const details = cleanResumeInput(req.body);
        if (details.template && !entitlements.plan.templates.includes(details.template)) {
            return res.status(403).json({
                code: 'PREMIUM_FEATURE_REQUIRED',
                message: 'This template is available with Premium. Choose the Classic template or upgrade your plan.',
            });
        }
        Object.assign(resume, details);
        await resume.save();
        return res.json({ resume: { ...resume.toObject(), canDownload: true } });
    } catch (error) {
        return handleInputError(error, res);
    }
};

export const deleteResume = async (req, res) => {
    try {
        const resume = await getOwnedResume(req.params.id, req.userId);
        if (!resume) return res.status(404).json({ message: 'Resume not found.' });
        await resume.deleteOne();
        return res.status(200).json({ message: 'Resume deleted.' });
    } catch (error) {
        return handleInputError(error, res);
    }
};
