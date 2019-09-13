const express = require('express');
const router = express.Router();
const app = express();

const controller = require("../controller/controller");

router.get('/get_my_result', (req, res) => {
    controller.get_my_result(req).then((result) => {
        console.log(result);
        res.send(result);
    })
    .catch( error => {
        res.send(error);
    });
});

module.exports = router;