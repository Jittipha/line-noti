const mongoose = require('mongoose')


 async function db() {
    
    mongoose.connect(`mongodb+srv://Nanine:II4fQOigYIr6ub25@cluster0.qf5hft4.mongodb.net/?retryWrites=true&w=majority`).then(()=>console.log('connected')).catch(err => console.log('Error :'+err))
}

module.exports = db
