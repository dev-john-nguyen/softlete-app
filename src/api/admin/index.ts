const router = require('express').Router();
import authenticate from '../../utils/authenticate';
import validateAdmin from './validate-admin';
import privilegesRoutes from './privileges';

router.use(authenticate);
router.use(validateAdmin);
router.use('/privileges', privilegesRoutes);

export default router;
