import { Router } from "express";
import * as userController from './user.controller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { deleteSchema, forget_passSchema, getAllAccounts_recoveryEmail_Schema, getUserProfile_another_userSchema, resetPasswordSchema, signInSchema, signUpSchema, updateSchema, update_password_schema } from "./user.validationSchemas.js";
import { systemRoles } from "../../utils/systemRoles.js";

const router = Router()

router.post('/signUp', validationMiddleware(signUpSchema), expressAsyncHandler(userController.SignUpHandeler))
router.post('/login', validationMiddleware(signInSchema),expressAsyncHandler(userController.SignInHandeler))
router.put('/update',validationMiddleware(updateSchema) ,auth([systemRoles.USER,systemRoles.Company_HR]), expressAsyncHandler(userController.updateAccount))
router.delete('/deleteAccount',validationMiddleware(deleteSchema) ,auth([systemRoles.USER,systemRoles.Company_HR]), expressAsyncHandler(userController.deleteAccount))
router.get('/getUserProfile', auth([systemRoles.USER,systemRoles.Company_HR]), expressAsyncHandler(userController.getUserProfile))
router.get('/get_another_user/',validationMiddleware(getUserProfile_another_userSchema)  ,expressAsyncHandler(userController.getUserProfile_another_user))
router.put('/updatePassword',validationMiddleware(update_password_schema) ,auth([systemRoles.USER,systemRoles.Company_HR]), expressAsyncHandler(userController.update_password))
router.post('/forgetPass',validationMiddleware(forget_passSchema)  ,expressAsyncHandler(userController.forget_pass))
router.post('/resatPass',validationMiddleware(resetPasswordSchema)  ,expressAsyncHandler(userController.reset_password))
router.get('/getAllAccounts_recoveryEmail',validationMiddleware(getAllAccounts_recoveryEmail_Schema)  ,expressAsyncHandler(userController.getAllAccounts_recoveryEmail))

export default router