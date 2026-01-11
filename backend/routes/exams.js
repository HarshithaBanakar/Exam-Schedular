const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');

// Helper function to transform MongoDB _id to id
const transformExam = (exam) => {
    const obj = exam.toObject();
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj;
};

// GET all exams
router.get('/', async (req, res) => {
    try {
        const exams = await Exam.find().sort({ date: 1 });
        const transformed = exams.map(transformExam);
        res.json(transformed);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE exam
router.post('/', async (req, res) => {
    const exam = new Exam(req.body);
    try {
        const newExam = await exam.save();
        res.status(201).json(transformExam(newExam));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE exam
router.put('/:id', async (req, res) => {
    try {
        const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedExam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json(transformExam(updatedExam));
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE exam
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Exam.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.json({ message: 'Exam deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
