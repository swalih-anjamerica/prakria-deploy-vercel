import mongoose from 'mongoose'
import './accounts';
import './users';
import "./brands";


const Schema = mongoose.Schema


const fileSchema = new Schema({
  filekey: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  filename: {
    type: String,

  },
  size: {
    type: Number
  },
  date: {
    type: Date,
    default: new Date()
  }
}, {
  timestamps: true
})


const projectsSchema = new Schema({
  project_index: {
    type: Number,
    required: true
  },
  priority: {
    type: Number,
    required: true
  },
  account_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'accounts'
  },
  title: {
    type: String,
    required: true
  },
  create_date: {
    type: Date,
    default: new Date()
  },
  update_date: {
    type: Date,
    default: new Date()
  },
  estimate_date: {
    type: Date,
  },
  project_type: {
    type: String,
    required: true,
    // enum: ["PRINT", "DIGITAL", "3D/CG", "PACKAGING", "IMMERSIVE", "FILMS", "OTHER"]
  },
  resource: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  category: {
    type: String,
    required: true
  },
  size: {
    type: Array,
    required: true
  },
  project_manager: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: 'users'
  },
  project_status: {
    type: String,
    default: "to_be_confirmed",
    enum: ["in_progress", "u_review", "u_approval", "completed", "cancelled", "to_be_confirmed", "on_hold", "pause"]
  },
  project_prev_status: {
    type: String
  },
  brand_id: {
    type: Schema.Types.ObjectId,
    ref: "brands"
  },
  message: {
    type: String
  },
  input: [fileSchema],
  download: [fileSchema]

})


export default mongoose.models?.projects ? mongoose.models.projects : mongoose.model('projects', projectsSchema)