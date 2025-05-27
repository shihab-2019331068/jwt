require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = []

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401) // Unauthorized
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403) // Forbidden

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403) // Forbidden
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})

app.delete('/logout', (req, res) => {
    const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter(token => token !== refreshToken) // Remove the token
    res.sendStatus(204) // No Content
})


app.post('/login', (req, res) => {
    // Authenticate User
    
    const username = req.body.username
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

    refreshTokens.push(refreshToken) // Store the refresh token

    res.json({ accessToken: accessToken, refreshToken: refreshToken })

})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20s' })
}

app.listen(4000)
