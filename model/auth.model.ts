import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  relationship: { type: String, required: true },
  phone: { type: String, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  // --- Core Identity ---
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    select: false // Automatically excludes password from queries for security
  },
  role: { 
    type: String, 
    enum: ['admin', 'warden', 'student'], 
    default: 'student' 
  },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'other'], 
    required: true 
  },

  otp: {
    type: String,
    select: false
  },
  otpExpiry: {
    type: Date,
    select: false
  },

  // --- Hostel Logistics ---
  hostelBlock: { type: String, trim: true },
  roomNumber: { type: String, trim: true },
  bedNumber: { type: String, trim: true },

  // --- Contact & Security ---
  phoneNumber: { 
    type: String, 
    required: [true, 'Phone number is required'] 
  },
  emergencyContact: { type: emergencyContactSchema },

  // --- Academic Info (For Students) ---
  registrationNumber: { 
    type: String, 
    unique: true, 
    sparse: true,
    trim: true 
  },
  department: { type: String, trim: true },
  academicYear: { type: String, trim: true },

  // --- System Metadata ---
  isProfileComplete: { 
    type: Boolean, 
    default: false 
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;