import express from 'express';
import { createOrganization, getOrganizations, getOrganizationById, assignUserToOrganization, removeUserFromOrganization, fetchUsersByOrganization } from '../controllers/OrganizationController';
import { authorizeRole } from '../middleware/auth';
import { assignUserToOrgValidator, createOrganizationValidator, deleteOrgdValidator, getOrgByIdValidator } from '../types/constants';
import { validateRequestBody } from '../middleware/validate';


const router = express.Router();

router.post('/', createOrganizationValidator, validateRequestBody, createOrganization);

router.get('/', getOrganizations);

router.get('/:organizationId', getOrgByIdValidator, getOrganizationById);

router.get('/:organizationId/users', fetchUsersByOrganization);

router.post('/:organizationId/:userId', assignUserToOrgValidator, validateRequestBody, assignUserToOrganization);

router.delete('/:organizationId/users/:userId', authorizeRole(['Admin']), deleteOrgdValidator, validateRequestBody, removeUserFromOrganization);

export default router;
