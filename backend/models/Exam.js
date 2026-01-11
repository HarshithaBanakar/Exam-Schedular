const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    course: { type: String, required: true },
    semester: { type: Number, required: true },
    type: { type: String, enum: ['ESA', 'ISA'], required: true },
    date: { type: String, required: true }, // Storing as YYYY-MM-DD
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, required: true },
    status: { type: String, default: 'Scheduled' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);
