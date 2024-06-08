const express = require('express')
const router = express.Router()
const {ensureAuth,ensureGuest} = require('../middleware/auth')
const User = require('../models/User')
const Story = require('../models/story')
// login 

router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login'
    })
})

// Dashboard

router.get('/dashboard',ensureAuth,async(req,res)=>{
    try {
        const user = await User.findById(req.user)
        const stories = await Story.find({user:req.user})
        res.render('dashboard',{     
            name:user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('errors/500')
    }
})

module.exports = router