require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const validURL = require('valid-url');

let shortURLs = {};

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  try {
    if (validURL.isWebUri(req.body.url)) {
       let shortURLNo = Object.keys(shortURLs).length + 1;

        shortURLs[shortURLNo] = req.body.url;
    
        res.status(200).json({
          "original_url": req.body.url,
          "short_url": shortURLNo
        }); 
      
    } else {
      throw new Error('invalid url');
    }
    
  } catch(error) {
    res.status(200).json({
      error: 'invalid url'
    });
  }
});

app.get('/api/shorturl/:shortURLNo', function(req, res) {
  if (shortURLs[req.params.shortURLNo]) {
    res.redirect(shortURLs[req.params.shortURLNo]);
               
  } else {
    res.status(404).json({
      error: "No short URL found for the given input"
    });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
