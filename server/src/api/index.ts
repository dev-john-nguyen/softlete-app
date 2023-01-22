const router = require('express').Router();
import signinRoutes from './signin';
import userRoutes from './user';
import exercisesRoutes from './exercises';
import workoutRoutes from './workouts';
import programRoutes from './programs';
import athletesRoutes from './athletes';
import chatRoutes from './chat';
import adminRoutes from './admin';
import payRoutes from './subscription';
import reportRoutes from './report';
import feedbackRoutes from './feedback';
import miscRoutes from './misc';
import notificationsRoutes from './notifications';
import videosRoutes from './videos';
import imagesRoutes from './images';
import globalRoutes from './global';
import bugRoutes from './bug';

router.use('/signin', signinRoutes);
router.use('/user', userRoutes);
router.use('/subscription', payRoutes);
router.use('/exercises', exercisesRoutes);
router.use('/workouts', workoutRoutes);
router.use('/programs', programRoutes);
router.use('/athletes', athletesRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);
router.use('/report', reportRoutes);
router.use('/bug', bugRoutes);
router.use('/misc', miscRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/videos', videosRoutes);
router.use('/images', imagesRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/global', globalRoutes);

router.use('/', (req: any, res: any) => {
    res.status(404).send('Route not found.')
})

export default router;