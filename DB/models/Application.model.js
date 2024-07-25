import { Schema, model } from "mongoose";

const ApplicationSchema = new Schema({

 jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
 userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
 userTechSkills: { type: [String], required: true },
 userSoftSkills: { type: [String], required: true },
 userResume: [{
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true, unique: true },
    folderId: { type: String, required: true, unique: true }
}]
}, { timestamps: true });

const Application = model('Application', ApplicationSchema)
export default Application