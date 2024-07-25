import joi from 'joi';
export const addCompanySchemas={
    body: joi.object({
        companyName:  joi.string(),
        companyEmail: joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }),
        numberOfEmployees:joi.number(),
        description: joi.string(),
        industry:  joi.string() ,
        address:joi.string(),
    }),    
    headers:joi.object({
        _id:joi.string().hex().length(24)
    }).options({allowUnknown:true})
}
export const updateCompanySchemas={
    body: joi.object({
        companyName:  joi.string(),
        companyEmail: joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }),
        numberOfEmployees:joi.number(),
        description: joi.string(),
        industry:  joi.string() ,
        address:joi.string(),
    }),    
    headers:joi.object({
        _id:joi.string().hex().length(24)
    }).options({allowUnknown:true}),
    query:joi.object({
        _id:joi.string().hex().length(24)
    }).options({allowUnknown:true})
}
export const deleteCompanySchemas={
    headers:joi.object({
        _id:joi.string().hex().length(24)
    }).options({allowUnknown:true}),
    query:joi.object({
        _id:joi.string().hex().length(24)
    }).options({allowUnknown:true}) 
}
export const getOneCompaniesSchema={
    params:joi.object({
        _id:joi.string().hex().length(24)
    }).options({allowUnknown:true}) 
}
export const searchForACompanySchema={
    body:joi.object({
        companyName:joi.string()
    })
}
