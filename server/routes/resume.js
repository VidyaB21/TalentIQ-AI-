const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const Resume = require('../models/Resume');
const auth = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

// Upload resume + job description
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const filePath = req.file.path;

    // Call Python AI service
    const FormData = require('form-data');
    const fs = require('fs');
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('job_description', jobDescription);

    const aiResponse = await axios.post('http://localhost:8000/analyze', form, {
      headers: form.getHeaders()
    });

    const resume = await Resume.create({
      userId: req.user.id,
      fileName: req.file.originalname,
      rawText: aiResponse.data.raw_text,
      parsedData: aiResponse.data.parsed,
      scoreResult: aiResponse.data.score,
      jobDescription
    });

    res.json({ success: true, data: resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', auth, async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(resumes);
});

module.exports = router;