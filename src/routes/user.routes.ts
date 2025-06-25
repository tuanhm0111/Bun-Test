import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validateBody } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema } from '../utils/validator';

const router = Router();

router.get('/', userController.getUsers);
router.get('/:id', async (req, res, next) => {
  try {
	await userController.getUserById(req, res, next);
  } catch (error) {
	next(error);
  }
});
router.post('/', validateBody(createUserSchema), async (req, res, next) => {
  try {
    await userController.createUser(req, res, next);
    return;
  } catch (error) {
    next(error);
  }
});
router.put('/:id', validateBody(updateUserSchema), async (req, res, next) => {
  try {
    await userController.updateUser(req, res, next);
    return;
  } catch (error) {
    next(error);
  }
});
router.delete('/:id', async (req, res, next) => {
  try {
    await userController.deleteUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;