import User from "../../../DB/models/user.model.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import generateUniqueString from "../../utils/generateUniqueString.js"

//=====1============================ SignUp API =====================//

export const SignUpHandeler = async (req, res, next) => {
    const { firstName,lastName, email, password,recoveryEmail,DOB,mobileNumber,role,status} = req.body
    // email check
    const isEmailExists = await User.findOne({ email })
    if (isEmailExists) return next(new Error('Email is already exists', { cause: 409 }))

    // hash password
    const hashPass = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)

    const newUser = await User.create({ firstName,lastName,username:firstName+lastName, email, password:hashPass,recoveryEmail,DOB,mobileNumber,role,status} )
    return res.status(201).json({ message: 'User created successfully', newUser })
}

//=======2========================== SignIn API =====================//

export const SignInHandeler = async (req, res, next) => {
    const { email,mobileNumber, password } = req.body

    // email check
    const isEmailExists = await User.findOneAndUpdate({$or:[ { email},{mobileNumber} ]},{status:"online"})
    if (!isEmailExists) return next(new Error('invalid login credentials', { cause: 404 }))

    // hash password
    const isPasswordMatched = bcrypt.compareSync(password, isEmailExists.password)
    if (!isPasswordMatched) return next(new Error('invalid login credentials', { cause: 404 }))
    const token = jwt.sign(
        { id: isEmailExists._id, userEmail: isEmailExists.email,role:isEmailExists.role },
        process.env.LOGIN_SIGNATURE,
        {
            expiresIn: '1d',
        }
    )
    return res.status(200).json({ message: 'User LoggedIn successfully', token })
}

//===========3====================== Update Account API =====================//

export const updateAccount = async (req, res, next) => {
    const {  firstName,lastName, email,recoveryEmail,DOB,mobileNumber} = req.body
    const { _id } = req.authUser

    if (email) {
        // email check
        const isEmailExists = await User.findOne({ email })
        if (isEmailExists) return next(new Error('Email is already exists', { cause: 409 }))
    }
    //update user
    const updatedUser = await User.findByIdAndUpdate(_id, {
        firstName,lastName, email,recoveryEmail,DOB,mobileNumber,username:firstName+lastName
    }, {
        new: true
    })
    if (!updatedUser) return next(new Error('update fail'))
    res.status(200).json({ message: 'done', updatedUser })
}

//==========4======================= Delete Account API =====================//

export const deleteAccount = async (req, res, next) => {
    const { _id } = req.authUser
    const deletedUser = await User.findByIdAndDelete(_id)
    if (!deletedUser) return next(new Error('delete fail'))
    res.status(200).json({ message: 'done' })
}

//============5===================== Get User Profile API =====================//

export const getUserProfile = async (req, res, next) => {
    res.status(200).json({ message: "User data:", data: req.authUser })
}
//===========6====================== Get User Profile API another user =====================//

export const getUserProfile_another_user = async (req, res, next) => {
    const { _id } = req.query;
    const isIdExists = await User.findById({ _id }).select("_id firstName lastName username email mobileNumber role status ")
    res.status(200).json({ message: "User data:", data: isIdExists})
}
//============7===================== Update password API =====================//
export const update_password = async (req, res, next) => {
   //destruct data
    const { email,new_password, old_password} = req.body
    const { _id } = req.authUser
    //check email
    const isEmailExists = await User.findOne({ email })
    if (!isEmailExists) return next(new Error('invalid login credentials', { cause: 404 }))
    //check old password
   const isOldPasswordCorrect = bcrypt.compareSync(old_password,isEmailExists.password )
   if (!isOldPasswordCorrect) {
    return res.json({message:"old password rang"})
   } 
   //create new password
    const hashPass = bcrypt.hashSync(new_password, +process.env.SALT_ROUNDS)
    const updatedUser = await User.findByIdAndUpdate(_id ,{password:hashPass}, {new: true})

    if (!updatedUser) return next(new Error('update fail'))
    res.status(200).json({ message: 'done change password success' })
    
}
//=============8===============forget password==================================

const otps = {}; 

export const forget_pass = async (req,res,next)=>{
    const {email} = req.body;

    // generateUniqueString use nanoid unique OTP
    const otp = generateUniqueString(6)
    
    // Store the OTP with the associated email
    otps[email] = otp;
    
    res.status(200).json({message:'OTP generated successfully.',otp});
}

//=============9===============reset password==================================

export const reset_password= async (req, res,next) => {
  const {otp ,email,newPassword}= req.body;

  const isEmailExists = await User.findOne({ email })
  if (!isEmailExists) return next(new Error('invalid login credentials', { cause: 404 }))

  // Validate the OTP
  if (otps[email] && otps[email] === otp) {

const hashPass = bcrypt.hashSync(newPassword, +process.env.SALT_ROUNDS)

isEmailExists.password=hashPass
    // Remove the used OTP
    delete otps[email];
    isEmailExists.save()
    res.send('Password reset successfully place dont forget agin ');
  } else {
    res.status(400).send('Invalid or expired OTP.');
  }
};

//========10==== Get all accounts associated to specific recovery Email  ==================//
export const getAllAccounts_recoveryEmail = async (req, res, next) => {
    const { recoveryEmail } = req.body;
    const isRecoveryEmailExists = await User.find({ recoveryEmail })
    res.status(200).json({ message: "User data:", data: isRecoveryEmailExists})
}
//----the end(#_#)