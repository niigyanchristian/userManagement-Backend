import express from 'express';
import { authorizeRole } from '../middleware/auth';
import { validateRequestBody } from '../middleware/validate';
import { createUserValidator, userByIdValidator, updateUserValidator } from '../types/constants';
import { getUsers, getUserById, updateUser, deleteUser, createUser } from '../controllers/UserController';

const router = express.Router();
router.post('/', createUserValidator, validateRequestBody, createUser);

router.get('/', getUsers);

router.get('/:id', userByIdValidator, validateRequestBody, getUserById);

router.put('/:id', authorizeRole(['Admin']), updateUserValidator, validateRequestBody, updateUser);

router.delete('/:id', authorizeRole(['Admin']), userByIdValidator, validateRequestBody, deleteUser);

export default router;
