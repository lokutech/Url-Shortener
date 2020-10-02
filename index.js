const express = require('express')
const app = express()
const dns = require('dns')
const validUrl = require('valid-url')
const connectDB = require('./db/connection')
const Url = require('./models/url')

// Connect to Database
connectDB()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

// Get route
app.get('/:id', async (req, res) => {
  try {
    let entries = await Url.findOne({ short_url: req.params.id })

    if (entries) {
      res.redirect(entries.original_url)
    } else {
      res.status(401).json({ error: 'This ID does not return any results' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json('Server error')
  }
})

// Post Route
app.post('/api/shorturl/new', (req, res) => {
  try {
    let addressHttp = !req.body.url.match(/^https?:\/\//)
      ? 'http://' + req.body.url
      : req.body.url
    if (!validUrl.isUri(addressHttp)) {
      res.status(401).json({ error: 'Bad address' })
    }
    const myURL = new URL(addressHttp)

    dns.lookup(myURL.hostname, async (err, address, family) => {
      if (address) {
        console.log(addressHttp)
        let newEntry = await Url.findOne({ original_url: addressHttp })

        // console.log(new URL(newEntry.original_url).hostname + ' new entry')
        // console.log(myURL.hostname+' myurl')

        if (newEntry && new URL(newEntry.original_url).hostname == myURL.hostname) {
          res.json(newEntry)
        } else {
          const newUrl = new Url({
            original_url: myURL.href,
            short_url: (await Url.countDocuments()) + 1,
          })
          newUrl.save()
          res.send(newUrl)
        }
      } else {
        res.status(401).json({ error: 'Bad address' })
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json('Server error')
  }
})
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
