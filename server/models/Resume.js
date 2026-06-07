const mongoose = require('mongoose');
const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileName: String,
  rawText: String,
  parsedData: Object,    // skills, education, experience
  scoreResult: Object,   // score, gaps, recommendations
  jobDescription: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Resume', ResumeSchema);