const router = require('express').Router();
import create from './create';
import search from './search';
import find from './find';
import update from './update';
import remove from './remove';
import getBulk from './get-bulk';
import searchByCat from './searchByCat';
import authenticate from '../../utils/authenticate';


router.use(authenticate);
router.use('/remove', remove);
router.use('/find', find);
router.use('/update', update);
router.use('/search/category', searchByCat);
router.use('/search', search);
router.use('/create', create);
router.use('/get/bulk', getBulk);

export default router;