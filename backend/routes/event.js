const express = require('express')
const mongoose = require('mongoose')
const Event = require('../models/event')
const User = require('../models/user')
const router = express.Router()
const Valied = require('../middleware/user')
const { upload } = require('../config/cloudinary')

router.post('/event', Valied, upload.single('coverImage'), async (req, res) => {
   console.log(req.body) // move to here
  console.log(req.file) 
  const { title, description, category, date, source, isOrganizer } = req.body
 const location = req.body.location
  try {
    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      source,
      isOrganizer,
      postedBy: req.user.id,
      coverImage: req.file ? req.file.path : ''
    })
    res.status(200).json(event)
    console.log(req.body)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/events', async (req, res) => {
  try {
    const event = await Event.find()
      .sort({ date: 1 })
      .populate('postedBy', 'name')  
    
    res.status(200).json(event)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})
router.get('/event/:id', async (req, res) => {
  const { id } = req.params
  try {
    const event = await Event.findById(id)
      .populate('postedBy', 'name')  // add this line
    if (!event) return res.status(400).json({ message: 'No event found' })
    res.status(200).json(event)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})
router.post('/event/:id/comment',Valied, async (req,res)=>{
    const{id} = req.params
    const{text} = req.body
    try{
        const event = await Event.findById(id)
        if (!event) return res.status(404).json({ message: 'Event not found' })
        event.comments.push({ user: req.user.id, text })
        await event.save()
    res.status(200).json(event)
}catch(err){
    res.status(500).json({message : err.message})
}
})


router.get('/events/user',Valied,async (req,res)=>{
  try{
     const event = await Event.find({postedBy : req.user.id})
     if(!event.length) return res.status(404).json({ message: 'not found' })
      res.status(200).json(event)
    }catch(err){
    res.status(500).json({message : err.message})
}

    })

module.exports = router