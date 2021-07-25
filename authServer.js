const express = require('express')
const jwt = require('jsonwebtoken')
require('dotenv').config( )
const app = express()

app.use(express.json())

const posts = [
    {
        username: 'Kyal',
        title: 'Post 1'
    },
    {
        username: 'John',
        title: 'Post 2'
    },
    {
        username: 'James',
        title: 'Post 3'
    }
]

let refreshTokens = []

app.listen(4000)

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    //authenticate user
    const username = req.body.username
    const user = {
        name: username
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken)

    res.json({accessToken: accessToken, refreshToken, refreshToken})
})

app.post('/token', (req, res) => { // use refresh token to generate new access token after expiration
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)

    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)

        const accessToken = generateAccessToken({ name: user.name })
        return res.json({accessToken: accessToken})
    })
})

app.delete('/logout', (req, res) => { // delete refresh token
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    return res.sendStatus(204)
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'})
}