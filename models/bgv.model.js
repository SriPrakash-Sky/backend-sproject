import mongoose from "mongoose";

const bgvSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    gcid: {
      type: String,
      required: true,
      trim: true,
      maxlength: 8,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    client: {
      type: String,
      required: true,
      trim: true,
    },

    project_name: {
      type: String,
      required: true,
      trim: true,
    },
    bgv_initiated_date: {
      type: Date,
      required: true,
    },

    bgv_completed_date: {
      type: Date,
      required: true,
    },

    justification: {
      type: String,
      default: "",
    },
    email_id: {
      type: String,
      required: true,
      trim: true,
    },

    approval_status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },

    ml_status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    ml_reason: {
      type: String,
      default: "",
    },
    over_all_status: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Bgv", bgvSchema);
