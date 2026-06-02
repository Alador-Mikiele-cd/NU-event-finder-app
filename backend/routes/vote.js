const express = require('express')
const mongoose = require('mongoose')
const Vote = require('../models/vote')
const router = express.Router()
const Valied = require('../middleware/user')



router.post('/vote',Valied,async (req,res)=>{
   const{event , type} = req.body
   try{
   const vote = await Vote.create({user: req.user.id,event , type})
   res.status(200).json(vote)
   }catch(err){
    if(err.code === 11000) return res.status(400).json({ message: 'Already voted' })
    res.status(500).json({message : err.message})
   }
})

router.get('/votes/:eventId', async (req, res) => {
  const { eventId } = req.params
  try {
    const votes = await Vote.find({ event: eventId })
    if (!votes.length) return res.status(404).json({ message: 'No votes found' })
    res.status(200).json(votes)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})
module.exports = router