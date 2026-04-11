import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IComplaint extends Document {
    student: mongoose.Types.ObjectId;
    room: mongoose.Types.ObjectId;
    block: mongoose.Types.ObjectId;
    title: string;
    description: string;
    category: "Electrical" | "Plumbing" | "Internet" | "Furniture" | "Cleaning" | "Other";
    severity: "Low" | "Medium" | "High" | "Critical";
    status: "pending" | "in-progress" | "resolved" | "rejected" | "escalated";
    createdAt: Date;
    updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Student reference is required"],
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: "Room",
            required: [true, "Room reference is required"],
        },
        block: {
            type: Schema.Types.ObjectId,
            ref: "Block",
            required: [true, "Block reference is required"],
        },
        title: {
            type: String,
            required: [true, "Please provide a title for the complaint"],
            trim: true,
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Please provide a detailed description"],
            trim: true,
        },
        category: {
            type: String,
            enum: ["Electrical", "Plumbing", "Internet", "Furniture", "Cleaning", "Other"],
            default: "Other",
        },
        severity: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
        },
        status: {
            type: String,
            enum: ["pending", "in-progress", "resolved", "rejected", "escalated"],
            default: "pending",
        },
    },
    { timestamps: true }
);

ComplaintSchema.index({ status: 1, severity: 1 });
ComplaintSchema.index({ student: 1, createdAt: -1 });

const Complaint = models.Complaint || model<IComplaint>("Complaint", ComplaintSchema);

export default Complaint;