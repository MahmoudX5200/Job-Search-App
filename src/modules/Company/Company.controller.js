import Company from "../../../DB/models/Company.model.js"
import User from "../../../DB/models/user.model.js"
import Job from "../../../DB/models/Job.model.js"
import Application from "../../../DB/models/Application.model.js"
import jop from "../../../DB/models/Job.model.js"

//=========1=======Add company=================
export const addCompany=async(req,res,next)=>{
//destruct data
const {companyName,description,industry,address,numberOfEmployees,companyEmail}=req.body
const { _id:companyHR } = req.authUser
//check user
const userExist=await User.findById({_id:companyHR})
if(!userExist)return res.status(404).json({message:"user not found"}) //condition check user
//add company 
const addCompany=await Company.create({companyName,description,industry,address,numberOfEmployees,companyEmail,companyHR}) 
return res.status(200).json({ message: 'company created successfully', addCompany })
}

//===========2========updateCompany=============================
export const updateCompany=async(req,res,next)=>{
//destruct data
    const {companyName,description,industry,address,numberOfEmployees,companyEmail}=req.body 
    const { _id } = req.authUser
    const {_idCompany}=req.query 
//update company         
    const updatedTask = await Company.findByIdAndUpdate(_idCompany,{companyName,description,industry,address,numberOfEmployees,companyEmail}, 
    {new: true}
    )
// hr company only access see jobs 
if (!_id.equals(updatedTask.companyHR)) {
    return res.status(400).json({ message: 'You Not Have access'});
}

    if (!updatedTask) return next(new Error('update fail'))
    res.status(200).json({ message: 'done', updatedTask })
}
//=========3==========delete company=======================
export const deleteCompany=async(req,res,next)=>{
    //destruct data
    const { _id } = req.authUser
    const {_idCompany}=req.query 
    //delete company
    const deleteCompany = await Company.findOneAndDelete(_idCompany)
        if (!deleteCompany) return next(new Error('delete Company fail'))
        // hr company only access see jobs 
if (!_id.equals(deleteCompany.companyHR)) {
    return res.status(400).json({ message: 'You Not Have access'});
}

    res.status(200).json({ message: 'done delete Company success' })
}
//=============4================Get company data =====================
export const getOneCompany=async(req,res,next)=> {
    const{_id}=req.params;
  const IdExists=await Company.findById({_id})
  if(!IdExists)return res.status(404).json({message:"Id not found"})  //condition check id
  
  res.status(200).json({ message: 'done get Company success',IdExists })

}
//==============5=========Search for a company with a name==================
export const searchForACompany=async(req,res,next)=>{
    const {companyName}=req.body
    const SearchCompany=await Company.findOne({companyName})
    if(!SearchCompany)return res.status(404).json({message:"not found ",SearchCompany})
res.status(201).json({message:'successfully done ',SearchCompany});
}
//==============6=========Get all applications for specific Jobs============
export const ApplicationsForJob=async(req,res,next)=>{
const {jobId} = req.query;
const { _id} = req.authUser
//find jobs 
const jobFind = await Job.findById(jobId)
if (!jobFind)  return res.status(404).json({ message: 'Job not found ' });

// hr company only access see jobs 
if (!_id.equals(jobFind.addedBy)) {
    return res.status(400).json({ message: 'You Not Have access'});
}
//find Application
const applications = await Application.find({ jobId }).select(" _id jobId userTechSkills userSoftSkills userResume createdAt")
    res.status(200).json({ message: 'Applications retrieved successfully',jobFind ,applications });
};

//----the end(#_#)