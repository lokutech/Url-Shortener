const express = require("express");
const app = express();
const dns = require("dns");
const validUrl = require("valid-url");
const connectDB = require("./db/connection");
const Url = require("./models/url");




// Connect to Database
connectDB();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Get route
app.get("/:id", async (req, res) => {
  try {
    let entries = await Url.findOne({ short_url: req.params.id });

    if (entries) {
      res.redirect(entries.original_url);
    } else {
      res.status(401).json({ error: "This ID does not return any results" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server error");
  }
});

// Post Route
app.post("/api/shorturl/new", (req, res) => {
  try {
    if (!validUrl.isUri(req.body.url)) {
      res.status(401).json({ error: "Bad address" });
    }
    const myURL = new URL(req.body.url);

    dns.lookup(myURL.hostname, async (err, address, family) => {
      if (address) {
        let newEntry = await Url.find({ original_url: req.body.url + "/" });

        if (newEntry[0] && newEntry[0].original_url == req.body.url + "/") {
          res.json(newEntry);
        } else {
          const newUrl = new Url({
            original_url: myURL.href,
            short_url: (await Url.countDocuments()) + 1,
          });
          newUrl.save();
          res.send(newUrl);
        }
      } else {
        res.status(401).json({ error: "Bad address" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
