require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const Attendance = require('./models/Attendance'); // ✅ import Attendance model
const Lab = require('./models/Lab');               // ✅ import Lab model
const Blog = require('./models/Blog');             // ✅ import Blog model
const Subject = require('./models/Subject');       // ✅ import Subject model
const User = require('./models/User');             // ✅ import User model

const app = express();

// Middleware
app.use(express.json({ limit: '10MB' }));
app.use(express.urlencoded({ extended: true, limit: '10MB' }));
app.use(cors({ origin: '*' }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Default route
app.get('/', (req, res) => {
  res.status(200).json("You are in base route");
});


// ✅ Attendance API: Save attendance
app.post('/user/attendance', async (req, res) => {
  const { userId, date, present } = req.body;

  if (!userId || !date || typeof present !== 'boolean') {
    return res.status(400).json({ message: 'All fields (userId, date, present) are required.' });
  }

  try {
    const existing = await Attendance.findOne({ userId, date });

    if (existing) {
      existing.present = present;
      await existing.save();
      return res.status(200).json({ message: '✅ Attendance updated successfully.' });
    }

    const newAttendance = new Attendance({ userId, date, present });
    await newAttendance.save();

    res.status(201).json({ message: '✅ Attendance recorded successfully.' });
  } catch (err) {
    console.error('❌ Attendance save error:', err);
    res.status(500).json({ message: 'Failed to save attendance.' });
  }
});

// ✅ Attendance API: Get attendance stats
app.get('/user/attendance/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const records = await Attendance.find({ userId });

    const totalDays = records.length;
    const presentDays = records.filter(r => r.present === true).length;
    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    res.status(200).json({
      totalDays,
      presentDays,
      percentage: `${percentage}%`
    });
  } catch (err) {
    console.error('❌ Attendance stats error:', err);
    res.status(500).json({ message: 'Failed to fetch attendance stats.' });
  }
});

// ✅ Attendance API: Delete all attendance records for a user
app.delete('/user/attendance/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Attendance.deleteMany({ userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No attendance records found for this user.' });
    }

    res.status(200).json({ message: '✅ All attendance records deleted successfully.' });
  } catch (err) {
    console.error('❌ Delete all attendance error:', err);
    res.status(500).json({ message: 'Failed to delete attendance records.' });
  }
});


// ✅ Lab API: Add a new lab
app.post('/labs', async (req, res) => {
  const { year, semester, labName } = req.body;

  if (!year || !semester || !labName) {
    return res.status(400).json({ message: 'Year, semester, and labName are required.' });
  }

  try {
    const newLab = new Lab({ year, semester, labName, links: [] });
    await newLab.save();
    res.status(201).json({ message: '✅ Lab added successfully.', data: newLab });
  } catch (err) {
    console.error('❌ Add lab error:', err);
    res.status(500).json({ message: 'Failed to add lab.' });
  }
});

// ✅ Lab API: Get all labs
app.get('/labs', async (req, res) => {
  try {
    const labs = await Lab.find();
    res.status(200).json(labs);
  } catch (err) {
    console.error('❌ Fetch labs error:', err);
    res.status(500).json({ message: 'Failed to fetch labs.' });
  }
});

// ✅ Lab API: Delete a lab
app.delete('/labs/:id', async (req, res) => {
  try {
    await Lab.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: '✅ Lab deleted successfully.' });
  } catch (err) {
    console.error('❌ Delete lab error:', err);
    res.status(500).json({ message: 'Failed to delete lab.' });
  }
});

// ✅ Link API: Add link to a lab
app.post('/labs/:labId/links', async (req, res) => {
  const { url, description } = req.body;

  if (!url || !description) {
    return res.status(400).json({ message: 'URL and description are required.' });
  }

  try {
    const lab = await Lab.findById(req.params.labId);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found.' });
    }

    lab.links.push({ url, description });
    await lab.save();

    res.status(200).json({ message: '✅ Link added successfully.', data: lab });
  } catch (err) {
    console.error('❌ Add link error:', err);
    res.status(500).json({ message: 'Failed to add link.' });
  }
});

// ✅ Link API: Delete link from a lab
app.delete('/labs/:labId/links/:linkIndex', async (req, res) => {
  const { labId, linkIndex } = req.params;

  try {
    const lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found.' });
    }

    if (linkIndex < 0 || linkIndex >= lab.links.length) {
      return res.status(400).json({ message: 'Invalid link index.' });
    }

    lab.links.splice(linkIndex, 1);
    await lab.save();

    res.status(200).json({ message: '✅ Link deleted successfully.', data: lab });
  } catch (err) {
    console.error('❌ Delete link error:', err);
    res.status(500).json({ message: 'Failed to delete link.' });
  }
});


// ✅ Subject API: Add a new subject
app.post('/theory', async (req, res) => {
  const { year, semester, subjectName } = req.body;

  if (!year || !semester || !subjectName) {
    return res.status(400).json({ message: 'Year, semester, and subjectName are required.' });
  }

  try {
    const newSubject = new Subject({ year, semester, subjectName, links: [] });
    await newSubject.save();
    res.status(201).json({ message: '✅ Subject added successfully.', data: newSubject });
  } catch (err) {
    console.error('❌ Add subject error:', err);
    res.status(500).json({ message: 'Failed to add subject.' });
  }
});

// ✅ Subject API: Get all subjects
app.get('/theory', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (err) {
    console.error('❌ Fetch subjects error:', err);
    res.status(500).json({ message: 'Failed to fetch subjects.' });
  }
});

// ✅ Subject API: Delete a subject
app.delete('/theory/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: '✅ Subject deleted successfully.' });
  } catch (err) {
    console.error('❌ Delete subject error:', err);
    res.status(500).json({ message: 'Failed to delete subject.' });
  }
});

// ✅ Link API: Add link to a subject
app.post('/theory/:subjectId/links', async (req, res) => {
  const { url, description } = req.body;

  if (!url || !description) {
    return res.status(400).json({ message: 'URL and description are required.' });
  }

  try {
    const subject = await Subject.findById(req.params.subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    subject.links.push({ url, description });
    await subject.save();

    res.status(200).json({ message: '✅ Link added successfully.', data: subject });
  } catch (err) {
    console.error('❌ Add link error (subject):', err);
    res.status(500).json({ message: 'Failed to add link.' });
  }
});

// ✅ Link API: Delete link from a subject
app.delete('/theory/:subjectId/links/:linkIndex', async (req, res) => {
  const { subjectId, linkIndex } = req.params;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found.' });
    }

    if (linkIndex < 0 || linkIndex >= subject.links.length) {
      return res.status(400).json({ message: 'Invalid link index.' });
    }

    subject.links.splice(linkIndex, 1);
    await subject.save();

    res.status(200).json({ message: '✅ Link deleted successfully.', data: subject });
  } catch (err) {
    console.error('❌ Delete link error (subject):', err);
    res.status(500).json({ message: 'Failed to delete link.' });
  }
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server started on port 3000");
});
