import express from 'express';
import multer from 'multer';
import { analyzeUploadedResume } from '../controllers/resumeController.js';
import {
    createResume,
    deleteResume,
    getResume,
    listResumes,
    updateResume,
} from '../controllers/resumeBuilderController.js';
import {
    downloadResume,
} from '../controllers/resumeDownloadController.js';
import { userAuth } from '../middlewares/userMiddleware.js';

export const resumeRouter = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
            return callback(new Error('Only PDF resumes are supported.'));
        }
        callback(null, true);
    },
});

const uploadResume = (req, res, next) => {
    upload.single('resume')(req, res, (error) => {
        if (error) {
            const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
            return res.status(status).json({ message: error.message });
        }
        next();
    });
};

resumeRouter.post('/analyze', userAuth, uploadResume, analyzeUploadedResume);
resumeRouter.use(userAuth);
resumeRouter.get('/', listResumes);
resumeRouter.post('/', createResume);
resumeRouter.get('/:id', getResume);
resumeRouter.put('/:id', updateResume);
resumeRouter.delete('/:id', deleteResume);
resumeRouter.get('/:id/download', downloadResume);
