const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import validateAdmin from './validate-admin';
import exerciseRoutes from './exercises';
import privilegesRoutes from './privileges';

router.use(authenticate);
router.use(validateAdmin);
router.use('/exercises', exerciseRoutes);
router.use('/privileges', privilegesRoutes);

export default router;
