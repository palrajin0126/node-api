const express = require('express');
const PropertyController = require('../controller/propertyController');

const router = express.Router();

router.post('/properties', PropertyController.postProperty);
router.get('/properties/:id', PropertyController.viewProperty);
router.put('/properties/:id', PropertyController.updateProperty);
router.delete('/properties/:id', PropertyController.deleteProperty);

module.exports = router;
