import { Router } from 'express';
import UserController from './app/controllers/UserController';
import UsageController from './app/controllers/UsageController';
import SessionController from './app/controllers/SessionController';
import MailController from './app/controllers/MailController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/usersadm', UserController.storeAdm);
routes.post('/usage', UsageController.store);
routes.post('/mail', MailController.lostpass);
routes.post('/temptag', UsageController.tempstore);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.put('/userssenha', UserController.updatesenha);
routes.put('/userstag', UserController.updateTag);
routes.get('/users', UserController.index);
routes.delete('/users/:userId', UserController.delete);

routes.get('/usage', UsageController.index);
routes.get('/temptag', UsageController.indexTemp);
export default routes;
