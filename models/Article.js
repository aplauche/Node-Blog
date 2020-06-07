const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')

// allow creation and purification of html (from dompurify docs)
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify( new JSDOM().window )



const articleSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    markdown: {
        required: true,
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true, // force lowercase all
            strict: true // gets rid of characters not in url
        })
    }

    if (this.markdown) {
        const convertedMarkdown =  marked(this.markdown)
        this.sanitizedHtml = dompurify.sanitize(convertedMarkdown)
    }

    next();
})

//Create the table based on the model provided to mongoose
module.exports = mongoose.model('Article', articleSchema)