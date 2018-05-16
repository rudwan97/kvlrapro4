const express = require('express');
const router = express.Router();
const path = require('path');


router.get('*', function (req, res) {
    res.status(200);
    res.json({
        "description": "Project X API version 3. Please use API version 4"
    });
});


module.exports = router;