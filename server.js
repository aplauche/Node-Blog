const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/Article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')

const app = express()

mongoose.connect('mongodb://localhost/nodeblog', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
// all the object parameters are responses to deprecation warnings

// set the view engine to using ejs
app.set('view engine', 'ejs') 


// Allow article form to be accessed from body of request
// same as body-parser?
app.use(express.urlencoded({extended:false}))

// allow methods to be overridden with custom parameter attached with query string to form action
app.use(methodOverride('_method'))




// Handle Routes
app.use('/articles', articleRouter)


// Index Entry Point Route
app.get('/', async (req, res)=> {
    const articles = await Article.find().sort({
        createdAt: 'desc'
    })
    res.render('articles/index', {articles: articles})
})


// Start the server
 app.listen(5000)