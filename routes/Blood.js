const express = require("express");
const router = express.Router();

const { auth } = require('../middlewares/Auth');
const { addBloodRequest, getBloodRequestsForUser, getAllBloodRequests } = require("../controllers/Blood");

router.post("/need", auth, addBloodRequest)
router.get("/need", auth, getBloodRequestsForUser);
router.get("/need/all", auth, getAllBloodRequests);

module.exports = router;