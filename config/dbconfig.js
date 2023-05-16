const mongoose = require('mongoose')


 async function db() {
    
    mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.qf5hft4.mongodb.net/?retryWrites=true&w=majority`).then(()=>console.log('connected')).catch(err => console.log('Error :'+err))
}

module.exports = db