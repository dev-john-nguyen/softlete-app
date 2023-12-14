const router = require('express').Router();
import getPubKey from './get-pub-key';
import create from './create';
import webhook from './webhook';
import authenticate from '../../utils/authenticate';
import updatePayMethod from './update-payment-method';
import setupIntent from './setup-intent';
import cancel from './cancel';
import defaultCard from './default-card';
import iosHook from './ios-webhook';
import iapRoutes from './iap';

// router.use('/hooks', webhook);
// router.use('/ios-hooks', iosHook);

router.use(authenticate);
// router.use('/pub-key', getPubKey);
// router.use('/create', create);
// router.use('/update-payment-method', updatePayMethod);
// router.use('/setup-intent', setupIntent);
// router.use('/cancel', cancel);
// router.use('/default-card', defaultCard);
router.use('/iap', iapRoutes)

export default router;