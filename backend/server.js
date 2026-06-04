const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()

require('dotenv').config()
app.use(express.json())
app.use(cors())




app.use('/api/user' ,require('./routes/auth'))
app.use('/api', require('./routes/event'))
app.use('/api', require('./routes/vote'))
app.use('/api', require('./routes/idea'))
mongoose
        .connect(process.env.MONGO_URI)
        .then(()=>{
            console.log('Mangodb connected succsesfuly')
            app.listen(process.env.PORT , console.log('server is runing on 5000'))
        })
