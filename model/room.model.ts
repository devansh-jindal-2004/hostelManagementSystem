import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomNumber: string;
  block: mongoose.Types.ObjectId;  
  capacity: number;               
  students: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new Schema<IRoom>(
  {
    roomNumber: { 
      type: String, 
      required: [true, "Room number/name is required"], 
      trim: true 
    },
    block: { 
      type: Schema.Types.ObjectId, 
      ref: 'Block', 
      required: [true, "Room must belong to a block"] 
    },
    capacity: { 
      type: Number, 
      required: [true, "Bed capacity is required"],
      min: [1, "Room must have at least 1 bed"],
      default: 2
    },
    students: [
      { 
        type: Schema.Types.ObjectId, 
        ref: 'User'
      }
    ]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

roomSchema.virtual('occupiedCount').get(function() {
  return this.students ? this.students.length : 0;
});

roomSchema.index({ roomNumber: 1, block: 1 }, { unique: true });

export default mongoose.models.Room || mongoose.model<IRoom>('Room', roomSchema);