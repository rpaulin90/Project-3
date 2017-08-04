var express = require("express");

var quotesController = require("../controllers/quotesController");

var router = new express.Router();

router.post("/getUserInfo", quotesController.getUserInfo);
router.post("/getCalendarInfo", quotesController.getCalendarInfo);
router.post("/newUser", quotesController.createUser);
router.post("/newTeam", quotesController.createTeam);
router.post("/joinTeam", quotesController.joinTeam);
router.post("/addEvent", quotesController.addEvent);


module.exports = router;