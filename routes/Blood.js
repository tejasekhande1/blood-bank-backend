const express = require("express");
const router = express.Router();

const { auth } = require('../middlewares/Auth');
const { addBloodRequest, getBloodRequests, getAllBloodRequests, deleteBloodRequest } = require("../controllers/Blood");

router.post("/need", auth, addBloodRequest)
router.get("/need", auth, getBloodRequests);
router.get("/need/all", auth, getAllBloodRequests);
router.delete("/request/:requestId", auth, deleteBloodRequest);

module.exports = router;