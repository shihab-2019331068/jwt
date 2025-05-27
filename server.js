require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
    {
        username: 'Shihab',
        title: 'Post 1'
    },
    {
        username: 'Shibu',
        title: 'Post 2'
    },
    {
        username: 'Shibu3',
        title: 'Post 3'
    },
    {
        username: 'Shibu4',
        title: 'Post 4'
    }
]

app.get('/post', (req, res) => {
    res.json(posts);
})

app.post('/login', (req, res) => {
    // Authenticate User
    
    const username = req.body.username
    const user = { name: username }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })

})



app.listen(3000)
