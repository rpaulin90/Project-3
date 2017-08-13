var express = require("express");
var path = require("path");
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: "b9572356",
    apiSecret: "c7a1ce1afff6e886"
});
var aws = require("aws-sdk");

var apiRoutes = require("./apiRoutes");

var router = new express.Router();

// Use the apiRoutes module for any routes starting with "/api"
router.use("/api", apiRoutes);

router.post("/sendSMS", (req, res) => {
    // Send SMS
    for(let x = 0; x < req.body.number.length; x++){

        nexmo.message.sendSms(
            "12034089142", req.body.number[x],
            `Next event: ${req.body.nextEvent.title} \n
            Start: ${req.body.nextEvent.start} \n
            Comments: ${req.body.nextEvent.notes} \n
            
            Please confirm your attendance by clicking here: http://about:blank
            `, {type: 'unicode'},
            (err, responseData) => {if (responseData) {

                console.log(responseData);
            }}
        );
    }

    res.send("messages sent");

});

router.get('/sign-s3', function(req, res) {
    var s3 = new aws.S3( {
        signatureVersion: 'v4',
        region:'us-east-2'
    } );
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: "project-2",
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, function(err, data) {
        if(err){
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        };
        res.write(JSON.stringify(returnData));
        res.end();
    });

});

// Otherwise send all other requests the index.html page
// React router will handle routing withing the app
router.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
