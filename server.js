const express = require('express')
require('dotenv').config()
const app = express()
const connection = require('./src/helpers/db')
const userRoute = require('./src/routes/userRoute')
const postRoute = require('./src/routes/postRoute')


app.use(express.json())
app.use('/user', userRoute)
app.use('/update/profile', userRoute);
app.use('/post',postRoute)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Running on server ${PORT}`);
})