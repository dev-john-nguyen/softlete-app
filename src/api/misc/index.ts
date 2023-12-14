const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import getMuscles from './muscles/get';
import getEquipments from './equipments/get';
import get from './get';

router.use(authenticate);
router.use('/get/muscles', getMuscles);
router.use('/get/equipments', getEquipments);
router.use('/get', get);

export default router;