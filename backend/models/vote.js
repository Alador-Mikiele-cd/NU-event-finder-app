const mongoose = require('mongoose')

const voteSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  event: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event', 
    required: true 
  },
  type: {
    type: String,
    enum: [
      'interested', 
      'veryInterested', 
      'wouldAttend', 
      'wouldPay', 
      'worthIt', 
      'notWorthIt'
    ],
    required: true
  },
}, { timestamps: true })

voteSchema.index({ user: 1, event: 1, type: 1 }, { unique: true })

module.exports = mongoose.model('Vote', voteSchema)