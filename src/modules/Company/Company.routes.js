import { Router } from "express";
import * as CompanyController from './Company.controller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addCompanySchemas, deleteCompanySchemas, getOneCompaniesSchema, searchForACompanySchema, updateCompanySchemas } from "./Company.validationSchemas.js";
import { systemRoles } from "../../utils/systemRoles.js";

const router = Router()

router.post('/addCompany',validationMiddleware(addCompanySchemas),auth([systemRoles.Company_HR]), expressAsyncHandler(CompanyController.addCompany))
router.put('/updateCompany',validationMiddleware(updateCompanySchemas),auth([systemRoles.Company_HR]), expressAsyncHandler(CompanyController.updateCompany))
router.delete('/deleteCompany',validationMiddleware(deleteCompanySchemas),auth([systemRoles.Company_HR]), expressAsyncHandler(CompanyController.deleteCompany))
router.get('/searchForCompany',validationMiddleware(searchForACompanySchema), expressAsyncHandler(CompanyController.searchForACompany))
router.get('/getOneCompany/:_id',validationMiddleware(getOneCompaniesSchema),auth([systemRoles.Company_HR]), expressAsyncHandler(CompanyController.getOneCompany))
router.post('/ApplicationsForJob',auth([systemRoles.Company_HR]), expressAsyncHandler(CompanyController.ApplicationsForJob))


export default router
