var express = require("express");

var quotesController = require("../controllers/quotesController");

var router = new express.Router();

router.post("/getUserInfo", quotesController.getUserInfo);
router.post("/newUser", quotesController.createUser);
router.post("/newTeam", quotesController.createTeam);
router.post("/joinTeam", quotesController.joinTeam);


module.exports = router;