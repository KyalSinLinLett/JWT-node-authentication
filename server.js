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

app.listen(3000)

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

function authenticateToken(req, res, next) {
    console.log(req)
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    console.log(authHeader)

    if(token == null) return res.sendStatus(401)

    // verify token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        
        req.user = user
        next()
    })
}