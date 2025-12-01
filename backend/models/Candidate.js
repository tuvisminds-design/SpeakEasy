const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String
  },
  position: {
    type: String,
    default: ''
  },
  resume: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  parsedData: {
    skills: [String],
    experience: [{
      company: String,
      position: String,
      duration: String,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      year: String
    }],
    summary: String
  },
  status: {
    type: String,
    enum: ['new', 'reviewing', 'interview-scheduled', 'interviewed', 'accepted', 'rejected'],
    default: 'new'
  },
  interviewScheduled: {
    type: Boolean,
    default: false
  },
  interviewDate: Date,
  interviewTime: String,
  interviewLink: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

candidateSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Candidate', candidateSchema);

