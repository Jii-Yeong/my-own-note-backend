import express from 'express';
import loginRouter from './login';
import pageRouter from './page';
import registerRouter from './register';
const router = express.Router();

router.use('/api/page', pageRouter);
router.use('/api/register', registerRouter);
router.use('/api/login', loginRouter);

export default router;