import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import Resume from '../models/resumeSchema.js';
import { getPlanEntitlements } from '../services/subscriptionService.js';

const hasResumeContent = (resume) =>
    Boolean(
        resume.summary?.trim() ||
        resume.experience?.length ||
        resume.education?.length ||
        resume.projects?.length ||
        resume.skills?.length
    );

const drawSection = (doc, title, accent, template) => {
    if (doc.y > 700) doc.addPage();
    doc.moveDown(0.65);
    doc.font('Helvetica-Bold').fontSize(template === 'compact' ? 10 : 11).fillColor(accent).text(title.toUpperCase());
    doc.moveTo(doc.page.margins.left, doc.y + 3)
        .lineTo(doc.page.width - doc.page.margins.right, doc.y + 3)
        .lineWidth(0.7)
        .strokeColor(accent)
        .stroke();
    doc.moveDown(0.55);
    doc.fillColor('#202534');
};

const drawLabel = (doc, title, subtitle, dates, description) => {
    if (doc.y > 690) doc.addPage();
    doc.font('Helvetica-Bold').fontSize(10).text(title || 'Untitled', { continued: Boolean(dates) });
    if (dates) doc.font('Helvetica').fontSize(9).fillColor('#596273').text(`  |  ${dates}`, { align: 'right' });
    if (subtitle) doc.font('Helvetica-Oblique').fontSize(9).fillColor('#596273').text(subtitle);
    if (description) {
        doc.moveDown(0.2);
        doc.font('Helvetica').fontSize(9.5).fillColor('#202534').text(description, { lineGap: 2 });
    }
    doc.moveDown(0.45);
};

export const downloadResume = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ message: 'Resume not found.' });
    }
    try {
        const [resume, entitlements] = await Promise.all([
            Resume.findOne({ _id: req.params.id, userId: req.userId }).lean(),
            getPlanEntitlements(req.userId),
        ]);
        if (!resume) return res.status(404).json({ message: 'Resume not found.' });
        if (!resume.name?.trim()) return res.status(400).json({ message: 'Add your name before downloading.' });
        if (!hasResumeContent(resume)) return res.status(400).json({ message: 'Add at least one resume section before downloading.' });

        const template = resume.template || 'classic';
        if (!entitlements.plan.templates.includes(template)) {
            return res.status(403).json({
                code: 'PREMIUM_FEATURE_REQUIRED',
                message: 'This resume uses a Premium template. Upgrade to Premium or switch to Classic to download.',
            });
        }
        const accent = template === 'modern' ? '#285a80' : template === 'compact' ? '#355b4b' : '#303846';
        const doc = new PDFDocument({
            size: 'A4',
            margins: { top: 46, bottom: 46, left: 52, right: 52 },
            info: { Title: resume.title || 'Resume', Author: resume.name },
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        res.setHeader('Cache-Control', 'private, no-store');
        doc.on('error', (error) => {
            console.error('Resume PDF generation failed:', error.message);
            if (!res.headersSent) res.status(500).end();
            else res.destroy(error);
        });
        doc.pipe(res);

        doc.font('Helvetica-Bold')
            .fontSize(template === 'compact' ? 22 : 26)
            .fillColor(accent)
            .text(resume.name, { align: template === 'modern' ? 'center' : 'left' });
        if (resume.headline) {
            doc.moveDown(0.15).font('Helvetica').fontSize(12).fillColor('#424c5d')
                .text(resume.headline, { align: template === 'modern' ? 'center' : 'left' });
        }
        const contact = [resume.email, resume.phone, resume.address, resume.linkedin, resume.github, resume.portfolio].filter(Boolean);
        if (contact.length) {
            doc.moveDown(0.45).font('Helvetica').fontSize(8.5).fillColor('#596273')
                .text(contact.join('  |  '), { align: template === 'modern' ? 'center' : 'left', lineGap: 2 });
        }
        doc.moveDown(0.4).strokeColor(accent).lineWidth(1.3)
            .moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();

        if (resume.summary) {
            drawSection(doc, 'Professional Summary', accent, template);
            doc.font('Helvetica').fontSize(9.5).fillColor('#202534').text(resume.summary, { lineGap: 2 });
        }
        if (resume.experience?.length) {
            drawSection(doc, 'Experience', accent, template);
            for (const item of resume.experience) {
                const dates = [item.startDate, item.endDate].filter(Boolean).join(' - ');
                drawLabel(doc, item.position, [item.company, item.location].filter(Boolean).join(' · '), dates, item.description);
            }
        }
        if (resume.education?.length) {
            drawSection(doc, 'Education', accent, template);
            for (const item of resume.education) {
                const dates = [item.startYear, item.endYear].filter(Boolean).join(' - ');
                drawLabel(doc, item.degree, [item.institution, item.grade].filter(Boolean).join(' · '), dates);
            }
        }
        if (resume.skills?.length) {
            drawSection(doc, 'Skills', accent, template);
            doc.font('Helvetica').fontSize(9.5).fillColor('#202534').text(resume.skills.join('  ·  '), { lineGap: 2 });
        }
        if (resume.projects?.length) {
            drawSection(doc, 'Projects', accent, template);
            for (const item of resume.projects) {
                drawLabel(
                    doc,
                    item.title,
                    [item.technologies?.join(', '), item.link].filter(Boolean).join(' · '),
                    '',
                    item.description
                );
            }
        }
        doc.end();
    } catch (error) {
        console.error('Resume download failed:', error.message);
        if (!res.headersSent) return res.status(500).json({ message: 'Unable to generate your resume PDF.' });
        return res.end();
    }
};
