const express = require('express');
const router = express.Router();

//import the controllers.stuff that now has all function router
const stuffCtrl = require('../controllers/stuff'); 

router.get('/', stuffCtrl.getAllStuff);
router.post('/', stuffCtrl.createThing);
router.get('/:id', stuffCtrl.getOneThing);
router.put('/:id', stuffCtrl.modifyThing);
router.delete('/:id', stuffCtrl.deleteThing);

module.exports = router;

//now in this file is more cleaner because all the logic of the function imigrate to controllers folder