import joi from 'joi';

export const signUpSchema = {
    body: joi.object({
        email: joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }).required(),
        password: joi.string().required(),
        firstName:joi.string().required() ,
        lastName:joi.string().required(),
        username:  joi.string(),
        recoveryEmail: joi.string(),
        DOB:  joi.date() ,
        mobileNumber: joi.number().required(),
        role: joi.string().required(),
        status:joi.string().required(),
    })
}
export const signInSchema = {
    body: joi.object({
        email: joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }).required(),
        password: joi.string().required(),
        recoveryEmail: joi.string(),
        mobileNumber: joi.number(),
    })
}

export const getUserProfile_another_userSchema={
    params : joi.object({
        userId: joi.string().hex().length(24)
        }),
}

export const updateSchema = {
    body: joi.object({
        email: joi.string().email({ tlds: { allow: ['com', 'org', 'yahoo'] }, minDomainSegments: 1 }).required(),
       firstName : joi.string(),
       lastName : joi.string(),
       DOB:  joi.date() ,
        recoveryEmail: joi.string(),
        mobileNumber: joi.number(),
    })

}
export const deleteSchema = {
    body: joi.object({
        _id: joi.string().hex().length(24)
    })
}
export const update_password_schema={
    body:joi.object({
        old_password : joi.string().required(),
        new_password : joi.string().required(),
        email:joi.string().email().required()
    })
} 

export const forget_passSchema={
    body:joi.object({
        email:joi.string().email().required()
        })
}

export const resetPasswordSchema= {
    body:joi.object({
        email:joi.string().email().required(),
        newPassword:joi.string().required(),
        otp:joi.string()
    })
}
export const getAllAccounts_recoveryEmail_Schema={
    recoveryEmail:joi.string()
}