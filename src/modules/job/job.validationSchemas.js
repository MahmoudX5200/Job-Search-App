import joi from 'joi';

export const addJobSchema = {
    body: joi.object({
        jobTitle:joi.string().required(),
        jobLocation:joi.string().required(),
        workingTime:joi.string().required(),
        seniorityLevel:joi.string().required(),
        jobDescription:joi.string(),
        technicalSkills:joi.string(),
        softSkills:joi.string(),
        companyAndJob:joi.string().hex().length(24)
        }),
    headers:joi.object({
            _id:joi.string().hex().length(24)
        }).options({allowUnknown:true}) , 
}
export const updateJobSchema = {
    body: joi.object({
        jobTitle:joi.string().required(),
        jobLocation:joi.string().required(),
        workingTime:joi.string().required(),
        seniorityLevel:joi.string().required(),
        jobDescription:joi.string(),
        technicalSkills:joi.string(),
        softSkills:joi.string(),
       
        }),
        headers:joi.object({
            _id:joi.string().hex().length(24)
        }).options({allowUnknown:true}) ,
        query:joi.object({
            _id:joi.string().hex().length(24)
        }).options({allowUnknown:true}) ,
}
export const deleteJobSchema = {
        headers:joi.object({
            _id:joi.string().hex().length(24)
        }).options({allowUnknown:true}) ,
        query:joi.object({
            _id:joi.string().hex().length(24)
        }).options({allowUnknown:true}) ,
}
export const getAllJobsSpecificCompanySchema = {
        query:joi.object({
            companyName:joi.string().required()
        }),
}
export const ApplyToJobSchema = {
    body: joi.object({
        userTechSkills:joi.string(),
        userSoftSkills:joi.string(),
       
        }),
        headers:joi.object({
            _id:joi.string().hex().length(24)
        }).options({allowUnknown:true}) ,
        query:joi.object({
            jobId:joi.string().hex().length(24)
        }).options({allowUnknown:true}) ,
}
