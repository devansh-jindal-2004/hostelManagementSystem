import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  title: string;
  content: string;
  type: 'info' | 'alert' | 'success';
  targetAudience: 'all' | 'students' | 'staff';
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    title: {
      type: String,
      required: [true, "Alert title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    content: {
      type: String,
      required: [true, "Alert content is required"],
      trim: true
    },
    type: {
      type: String,
      enum: ['info', 'alert', 'success'],
      default: 'info'
    },
    targetAudience: {
      type: String,
      enum: ['all', 'students', 'staff'],
      default: 'all'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

alertSchema.index({ createdAt: -1 });
alertSchema.index({ targetAudience: 1 });

export default mongoose.models.Alert || mongoose.model<IAlert>('Alert', alertSchema);