const mongoose = require('mongoose')

const database = async() =>{
    try {
        const conn = await mongoose.connect(process.env.URL)
        console.log(`database connection : ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = database