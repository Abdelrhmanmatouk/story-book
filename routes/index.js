const express = require('express')
const router = express.Router()
const {ensureAuth,ensureGuest} = require('../middleware/auth')
const User = require('../models/User')
// login 

router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login'
    })
})

// Dashboard

router.get('/dashboard',ensureAuth,async(req,res)=>{
    const user = await User.findById(req.user)
    res.render('dashboard',{     
        name:user.firstName
    })
})

module.exports = router