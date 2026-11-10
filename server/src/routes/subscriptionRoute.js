import express from 'express';
import {
    completeDemoCheckout,
    createDemoCheckout,
    getMySubscription,
    getSubscriptionPlans,
} from '../controllers/subscriptionController.js';
import { userAuth } from '../middlewares/userMiddleware.js';

export const subscriptionRouter = express.Router();

subscriptionRouter.get('/plans', getSubscriptionPlans);
subscriptionRouter.use(userAuth);
subscriptionRouter.get('/me', getMySubscription);
subscriptionRouter.post('/checkout', createDemoCheckout);
subscriptionRouter.post('/transactions/:transactionId/complete', completeDemoCheckout);
