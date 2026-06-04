const express = require('express')
const router = express.Router()
const Idea = require("../models/idea")
const IdeaVote = require("../models/ideavote")
const Valid = require('../middleware/user')

router.post('/idea',Valid,async (req,res)=>{
    try{
      const { title, description, category,  } = req.body
      const idea = await Idea.create({ title, description, category, postedBy: req.user.id})
      res.status(200).json(idea)
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.get('/ideas',async (req,res)=>{
    try{
      
      const idea = await Idea.find().populate('postedBy', 'name')
      res.status(200).json(idea)
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.get('/ideas/stats', async (req, res) => {
  try {
    console.log('stats route hit')
    const total = await Idea.countDocuments()
    console.log('total:', total)
    const trending = await Idea.countDocuments({ isTrending: true })
    res.status(200).json({ total, trending, launched: 0 })
  } catch(err) {
    console.log('stats error:', err.message)
    res.status(500).json({ message: err.message })
  }
})
router.get('/idea/:id',async (req,res)=>{
    try{
      const {id} = req.params
      const idea = await Idea.findById(id).populate('postedBy', 'name')
    if (!idea) return res.status(404).json({ message: 'Idea not found' })
      res.status(200).json(idea)
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.post('/idea/:id/comment',Valid,async (req,res)=>{
    const{id} = req.params
    const{text} = req.body

    try{
      const idea = await Idea.findById(id)
      if(!idea) return res.status(404).json('Not found')
       idea.comments.push({user : req.user.id,text})
      await idea.save()
      res.status(200).json(idea)
    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.post('/idea/:id/vote', Valid, async (req, res) => {
  const { id } = req.params
  try {
    await IdeaVote.create({ user: req.user.id, idea: id })
    const idea = await Idea.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true }
    )
    if (!idea) return res.status(404).json({ message: 'Not found' })
    res.status(200).json(idea)
  } catch(err) {
    console.log('error:', err.message)
    if (err.code === 11000) return res.status(400).json({ message: 'Already voted' })
    res.status(500).json({ message: err.message })
  }
})
router.post('/idea/:id/react', Valid, async (req, res) => {
  const { id } = req.params
  const { type } = req.body
  try {
    if (!['interested', 'wouldPay'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type' })
    }
    const idea = await Idea.findByIdAndUpdate(
      id,
      { $inc: { [type]: 1 } },
      { new: true }
    )
    res.status(200).json(idea)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})


module.exports = router