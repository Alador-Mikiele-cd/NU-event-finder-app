const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const router = express.Router()
const Valied = require('../middleware/user')
function getToken(id){
  return  jwt.sign({id},process.env.JWT_SECRET,{expiresIn : '7d'})
}

router.post('/register',async (req,res)=>{
    const{name,email,password} = req.body

    try{
     const exiseting = await User.findOne({email})
    
     if(exiseting) return res.status(400).json({message : 'This eamil is already used'})
      const hashed = await bcrypt.hash( password , 10)
    const user = await User.create({name,email,password:hashed})

    res.status(200).json({
        token:getToken(user._id),
        user:{id:user._id,name:user.name,email:user.email} 
    })

    }catch(err){
        res.status(500).json({message : err.message})
    }
})

router.post('/login',async (req,res)=>{
    const{email,password} = req.body

    try{
     const exiseting = await User.findOne({email})
    
     if(!exiseting) return res.status(400).json({message : 'invaled data'})
      const match = await bcrypt.compare( password , exiseting.password)
    if(!match) return res.status(400).json({message : 'invaled data'})

    res.status(200).json({
        token:getToken(exiseting._id),
        user:{id:user._id,name:user.name,email:user.email} 
    })

    }catch(err){
        res.status(500).json({message : err.message})
    }
})
router.get('/',async (req,res)=>{
    const user = await User.find()
    res.status(200).json(user)
})

router.get('/me', Valied, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.status(200).json(user)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})
module.exports = router