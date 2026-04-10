import mongoose, { Schema, Document } from 'mongoose';

export interface IBlock extends Document {
    name: string;
    type: 'Boys' | 'Girls';
    warden: mongoose.Types.ObjectId;
    totalBeds: number;
    occupiedBeds: number;
    createdAt: Date;
    updatedAt: Date;
}

const blockSchema = new Schema<IBlock>(
    {
        name: {
            type: String,
            required: [true, "Block name is required"],
            unique: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['Boys', 'Girls'],
            required: [true, "Hostel type is required"]
        },
        warden: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "A warden must be assigned to the block"]
        },
        totalBeds: {
            type: Number,
            default: 0,
            min: [0, "Total beds cannot be negative"]
        },
        occupiedBeds: {
            type: Number,
            default: 0,
            min: [0, "Occupied beds cannot be negative"]
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for occupancy percentage
blockSchema.virtual('occupancyPercentage').get(function () {
    if (this.totalBeds === 0) return 0;
    return Math.round((this.occupiedBeds / this.totalBeds) * 100);
});

export default mongoose.models.Block || mongoose.model<IBlock>('Block', blockSchema);