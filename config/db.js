const mongoose = require('mongoose')

const connectDB = async()=>{
    try {
        const conn = mongoose.connect(process.env.MONGO_URI)
        console.log(`mongoDB Connected `);
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB