import { Router } from "express";
import * as JobController from './job.controller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addJobSchema, updateJobSchema,deleteJobSchema,getAllJobsSpecificCompanySchema,ApplyToJobSchema } from "./job.validationSchemas.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { multerMiddleHost } from "../../middlewares/multer.js";

const router = Router()

router.post('/addJob',validationMiddleware(addJobSchema),auth([systemRoles.Company_HR]), expressAsyncHandler(JobController.addJob))
router.put('/updateJob',validationMiddleware(updateJobSchema),auth([systemRoles.Company_HR]), expressAsyncHandler(JobController.updateJob))
router.delete('/deleteJob',validationMiddleware(deleteJobSchema),auth([systemRoles.Company_HR]), expressAsyncHandler(JobController.deleteJob))
router.get('/getAllJobsWithCompany', expressAsyncHandler(JobController.getAllJobsCompany))
router.get('/getAllJobsSpecificCompany',validationMiddleware(getAllJobsSpecificCompanySchema), expressAsyncHandler(JobController.getAllJobsSpecificCompany))
router.get('/getAllJobsFilters', expressAsyncHandler(JobController.getAllJobsFilters))
router.post('/ApplyToJob', validationMiddleware(ApplyToJobSchema),auth([systemRoles.USER]), multerMiddleHost({ extensions: allowedExtensions.document }).array("document",2), expressAsyncHandler(JobController.ApplyToJob))
router.get('/ExcelSheet', expressAsyncHandler(JobController.ExcelSheet))

export default router
