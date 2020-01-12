const express = require('express');
const router = express.Router();
const FabricService = require('./fabricService')

const fabricService = new FabricService();


router.post("/enrollAdmin", (req,res) => {
    fabricService.enrollAdmin(req.body.adminName, req.body.password).then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/registerUser", (req,res) => {
    fabricService.registerUser(req.body.adminName, req.body.username).then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/registerSensor", (req,res) => {
    console.log(req.body.args)
    fabricService.registerSensor(req.body.username, req.body.channel, req.body.smartcontract, req.body.args).then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/addTemp", (req,res) => {
    fabricService.addTemp(req.body.username, req.body.channel, req.body.smartcontract, req.body.args).then((results) => {
        res.send(results);
        return results;
    });
});

router.post("/getHistory", (req,res) => {
    fabricService.getHistory(req.body.username, req.body.channel, req.body.smartcontract, req.body.args).then((results) => {
        res.send(results);
        return results;
    });
});


module.exports = router;