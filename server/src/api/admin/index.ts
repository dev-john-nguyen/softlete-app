const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import validateAdmin from './validate-admin';
import exerciseRoutes from './exercises';


router.use(authenticate);
router.use(validateAdmin);
router.use('/exercises', exerciseRoutes);



export default router;