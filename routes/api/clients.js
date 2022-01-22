const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const clientController = require("../../controllers/clientController");
const ROLES_LIST = require("../../config/rolesList");
const verifyRoles = require("../../middleware/verifyRoles");

/* only admin can delete */
router
    .route("/client")
    .get(clientController.getAllClients)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), clientController.createNewClient)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), clientController.updateClients)
    .delete(verifyRoles(ROLES_LIST.Admin), clientController.deleteClient);


router.route("/client/:id").get(clientController.getAClient);

module.exports = router;
