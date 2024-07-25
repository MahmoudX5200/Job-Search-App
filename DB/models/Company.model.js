import { Schema, model } from "mongoose";

const CompanySchema = new Schema({
  companyName: { type: String, required: true, unique: true },

  description: { type: String, required: true },

  industry: { type: String, required: true },

  address: { type: String, required: true },

  numberOfEmployees: { type:Number,min:11,max:20, required: true },

  companyEmail: { type: String, required: true, unique: true },

  companyHR: { type: Schema.Types.ObjectId, ref: 'User',  }
 
}, { timestamps: true });

const Company = model('Company', CompanySchema)
export default Company