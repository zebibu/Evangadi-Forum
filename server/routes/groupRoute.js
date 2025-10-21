const express = require("express");
const router = express.Router();
const {
  getAllGroups,
  toggleGroupMembership,
} = require("../controller/groupController");

// Routes
router.get("/", getAllGroups);
router.post("/:groupid/toggle", toggleGroupMembership);

module.exports = router;
