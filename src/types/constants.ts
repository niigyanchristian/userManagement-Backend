import { body, param } from "express-validator";

export const createUserValidator = [
    body('email')
        .isEmail()
        .withMessage('Email is required and must be valid'),
    body('phone_number')
        .optional()
        .isMobilePhone('any')
        .withMessage('Phone number must be valid'),]

export const userByIdValidator = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('id must be a positive integer'),
]

export const updateUserValidator = [
    body('phone_number')
        .isMobilePhone('any')
        .withMessage('Phone number is required and must be valid'),
    param('id')
        .isInt({ min: 1 })
        .withMessage('id must be a positive integer'),]

export const createOrganizationValidator = [
    body('name')
        .isString()
        .withMessage('Name is required'),]

export const assignUserToOrgValidator = [
    body('role')
        .isIn(['Manager', 'Viewer'])
        .withMessage('Role must be either Manager or Viewer'),
    param('organizationId')
        .isInt({ min: 1 })
        .withMessage('Organization ID must be a positive integer'),
    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
];

export const sendMagicLinkValidator = [
    body('email')
        .isEmail()
        .withMessage('Email is required and must be valid'),]

export const revokeMagicLinkValidator = [
    param('token')
        .isString()
        .withMessage('Token is required'),]


export const getOrgByIdValidator = [
    param('organizationId')
        .isInt({ min: 1 })
        .withMessage('Organization ID must be a positive integer'),
]

export const deleteOrgdValidator = [
    param('organizationId')
        .isInt({ min: 1 })
        .withMessage('Organization ID must be a positive integer'),
    param('userId')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),
]