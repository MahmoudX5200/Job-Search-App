import Company from "../../../DB/models/Company.model.js"
import User from "../../../DB/models/user.model.js"
import Job from "../../../DB/models/Job.model.js"
import Application from "../../../DB/models/Application.model.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
import generateUniqueString from "../../utils/generateUniqueString.js"
import moment  from "moment"
import excel  from 'exceljs'
//==========1=============Add Job ==========================
export const addJob=async(req,res,next)=>{
     //destruct data
    const {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,companyAndJob}=req.body
    const { _id:addedBy } = req.authUser
    //check user
    const userExist=await User.findById({_id:addedBy})
    if(!userExist)return res.status(404).json({message:"user not found"}) //condition check user
    const add_Job=await Job.create({jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addedBy,companyAndJob}) 
    return res.status(200).json({ message: 'job created successfully', add_Job })
}
//==========2===========update job=====================
export const updateJob=async(req,res,next)=>{
     //destruct data
    const {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills}=req.body 
   
    const { _id:addedBy } = req.authUser
    const {_id}=req.query 
    //check user
    const userExist=await User.findById({_id:addedBy}) 
    if(!userExist)return res.status(404).json({message:"user not found"})  //condition check user
     //update    
    const updated_Job = await Job.findByIdAndUpdate({_id},{jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills}, 
    {new: true}
    )

    if (!updatedTask) return next(new Error('update fail'))
    res.status(200).json({ message: 'done', updated_Job })
}
//=========3===========delete job===================
export const deleteJob=async(req,res,next)=>{
     //destruct data
    const { _id:addedBy } = req.authUser
    const {_id}=req.query 
    const userExist=await User.findById({_id:addedBy}) 
    if(!userExist)return res.status(404).json({message:"user not found"})  //condition check user

    const deleteCompany = await Job.findByIdAndDelete({_id}, 
        {new: true}
        )
        if (!deleteCompany) return next(new Error('delete job fail'))
    res.status(200).json({ message: 'done delete job success' })
}
//============4===============Get all Jobs and company ========================================

export const getAllJobsCompany = async (req, res, next) => {      
     //destruct data
    const companyAndJob = await Job.find().populate([{path:"companyAndJob"}])
    if(!companyAndJob)return res.status(404).json({message:"not found"})   
    res.json({
        message: "done",
        companyAndJob
    })
}
//============5=============Get all Jobs for a specific company==================================
export const getAllJobsSpecificCompany=async(req,res,next)=>{
     //destruct data
    const {companyName}=req.query
    const searchCompany=await Company.findOne({companyName}).select("companyName description industry address companyEmail") 
    if(!searchCompany)return res.status(404).json({message:" not found"})  //condition check 
    const jobsOfThisCompany=await Job.find({companyAndJob:searchCompany._id }).sort({createdAt:-1}).select("jobTitle jobLocation jobLocation seniorityLevel jobDescription technicalSkills softSkills")                               //get data from db sort by date
    if(!jobsOfThisCompany)return res.status(404).json({message:" not found"})  //condition check 

    res.json({
        message: "done",
        searchCompany,
        jobsOfThisCompany 
    })
}
//===========6===========Get all Jobs that match the filters ====================
export const getAllJobsFilters=async (req,res,next)=>{
      //destruct data بخلي المستخدم هو الي يحدد عايز ايه ...علشان يحط الكل البينات اليعيزها 
    const filterData={...req.body};
    //search job
    const filteredJobs = await Job.find(filterData)
    if(!filteredJobs)return res.status(404).json({message:" not found"})
    res.json({
        status:'success',
        message: 'Done ',
        filteredJobs
    });
    
}
//=========7=======================Apply to Job========================================
export const ApplyToJob=async(req,res,next)=>{
    //destruct data
    const {userTechSkills,userSoftSkills}=req.body
    const{jobId}=req.query
    const { _id:userId } = req.authUser
    
    // pdf
    if (!req.files?.length) return next(new Error('please upload pdf', { cause: 400 }))
     
    let pdf = []
    let publicIdsArr = []
    //nanoid
    const folderId = generateUniqueString(5)
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinaryConnection().uploader.upload(file.path, {
            folder: `CV/${userId}/${folderId}`,
            use_filename: true,
            unique_filename: true
        })
        publicIdsArr.push(public_id)
        pdf.push({ secure_url, public_id, folderId })
    }

    const userExist=await User.findById({_id:userId})
    if(!userExist)return res.status(404).json({message:"user not found"}) //condition check user
    const ApplyJob=await Application.create({userResume:pdf,userTechSkills,userSoftSkills,jobId,userId}) 
    if(!ApplyJob){
        const deletedData = await cloudinaryConnection().api.delete_resources(publicIdsArr)
        return next(new Error('add CV fail'))
    }
    return res.status(200).json({ message: 'job created successfully', ApplyJob })
    
}
//======================== Excel sheet =====================================
export const ExcelSheet=async(req,res,next)=>{
         
        const { companyId, date } = req.query;
    
        // Parse the date using moment
        const targetDate = moment(date, 'YYYY-MM-DD');
    
        if (!targetDate.isValid()) {
          return res.status(400).json({ message: 'Invalid date format' });
        }
    
        // Query applications based on companyId and the date range
        const applications = await Application.find({
          'userId.companyId': companyId,
          createdAt: {
            $gte: targetDate.startOf('day').toDate(),
            $lt: targetDate.endOf('day').toDate(),
          },
        }).populate('userId');
    
        // Create an Excel workbook and worksheet
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Applications');
    
        // Add headers to the worksheet
        worksheet.addRow(['User Name', 'User Email', 'Tech Skills', 'Soft Skills', 'Resume URL']);
    
        // Add application data to the worksheet
        applications.forEach(application => {
          const { name, email } = application.userId;
          const techSkills = application.userTechSkills.join(', ');
          const softSkills = application.userSoftSkills.join(', ');
    
          worksheet.addRow([name, email, techSkills, softSkills, application.userResume.secure_url]);
        });
    
        // Set the content type and headers for the Excel file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=applications_${companyId}_${date}.xlsx`);
    
       

        // await workbook.xlsx.write(res);
        return res.status(200).json({ message: 'successfully', worksheet })
} 

//----the end(#_#)
//الحمد الله