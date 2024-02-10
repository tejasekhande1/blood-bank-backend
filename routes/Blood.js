const express = require("express");
const router = express.Router();

const { auth } = require('../middlewares/Auth');
const { addBloodRequest, getBloodRequests, getAllBloodRequests, deleteBloodRequest, getBloodRequestsOnSearch } = require("../controllers/Blood");

router.post("/need", auth, addBloodRequest)
router.get("/need", auth, getBloodRequests);
router.get("/donate/all", auth, getAllBloodRequests);
router.delete("/request/:requestId", auth, deleteBloodRequest);
router.get('/donate', auth, getBloodRequestsOnSearch);

module.exports = router;