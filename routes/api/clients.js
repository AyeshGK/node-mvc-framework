const express = require('express');
const res = require('express/lib/response');
const router = express.Router()
const clientController = require('../../controllers/clientController');

router.route('/client')
    .get(clientController.getAllClients)
    .post(clientController.createNewClient)
    .put(clientController.updateClients)
    .delete(clientController.deleteClient);

router.route('/client/:id')
    .get(clientController.getAClient);

module.exports = router;