import mongoose, { Schema, Types } from "mongoose";

export interface IComment {
  blog: Types.ObjectId;
  name: string;
  content: string;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Comment = mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
