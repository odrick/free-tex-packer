var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});

router.get('/', function (req, res) {
    res.send('Texture packer server');
});

router.post('/upload', function (req, res) {
    if(req.files.image) {
        var data = req.files.image.data.toString('base64');
        data = "data:" + req.files.image.mimetype + ";base64," + data;
        
        res.send(data);
    }
    else {
        res.send('error');
    }
});

router.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

router.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;