const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({

  title: { 
    type: String, 
    required: true 
  },
  
  description: { 
    type: String, 
    required: true, 
    maxlength: 280 
  },
  
  category: {
    type: String,
    enum: [
      'concert', 'festival', 'art', 'food', 'sport',
      'nightlife', 'film', 'tech', 'fashion', 'community',
      'religious', 'other'
    ],
    required: true
  },
  
  coverImage: { type: String },

  date: { 
    type: Date, 
    required: true 
  },
  
  location: {
    description: { type: String, required: true }
  },

  status: {
    type: String,
    enum: ['upcoming', 'live', 'past', 'postponed'],
    default: 'upcoming'
  },
  
  postponedTo: { type: Date },

  votes: {
    interested: { type: Number, default: 0 },
    veryInterested: { type: Number, default: 0 },
    wouldAttend: { type: Number, default: 0 },
    wouldPay: { type: Number, default: 0 },
  },

  isTrending: { 
    type: Boolean, 
    default: false 
  },

  rating: {
    worthIt: { type: Number, default: 0 },
    notWorthIt: { type: Number, default: 0 },
  },

  comments: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      text: { 
        type: String, 
        required: true, 
        maxlength: 280 
      },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true  
  },
  
  isOrganizer: { type: Boolean, default: false },

  source: {
    platform: { type: String },
    url: { type: String },
    credit: { type: String }
  },

}, { timestamps: true })

module.exports = mongoose.model('Event', eventSchema)