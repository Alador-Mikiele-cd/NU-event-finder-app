const mongoose = require('mongoose')

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  category: {
    type: String,
    enum: ['concert', 'festival', 'art', 'food', 'sport', 'nightlife', 'film', 'tech', 'fashion', 'community', 'religious', 'other'],
    required: true
  },
  
  votes: { type: Number, default: 0 },
  interested: { type: Number, default: 0 },
  wouldPay: { type: Number, default: 0 },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isTrending: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Idea', ideaSchema)