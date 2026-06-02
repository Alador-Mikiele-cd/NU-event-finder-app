const express = require('express')
const mongoose = require('mongoose')
const Event = require('../models/event')
const router = express.Router()
const Valied = require('../middleware/user')


router.post('/event',Valied,async (req,res)=>{
   const { title, description, category, coverImage, date, location, source, isOrganizer } = req.body
    try{
    const event = await Event.create( { title, description, category, coverImage, date, location, source, isOrganizer,postedBy: req.user.id })
res.status(200).json(event)
}catch(err){
    res.status(500).json({message : err.message})
}


})


router.get('/events',async (req,res)=>{
    try{
     const event = await Event.find()
    
     res.status(200).json(event)
    }catch(err){
    res.status(500).json({message : err.message})
}
})

router.get('/event/:id',async (req,res)=>{
    const{id} = req.params
    try{
     const event = await Event.findById(id)
     if(!event) return res.status(400).json({message : 'No event found'})
     res.status(200).json(event)
    }catch(err){
    res.status(500).json({message : err.message})
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
module.exports = router