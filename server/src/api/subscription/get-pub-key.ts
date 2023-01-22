const router = require('express').Router();

router.get('/', (req: any, res: any, next: any) => {
    res.send(process.env.STRIPE_TEST_PUB_KEY)
})


export default router;