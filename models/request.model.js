import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    emp_id: {
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

    current_client: {
      type: String,
      required: true,
      trim: true,
    },

    current_project: {
      type: String,
      required: true,
      trim: true,
    },

    proposed_client: {
      type: String,
      required: true,
      trim: true,
    },

    proposed_project: {
      type: String,
      required: true,
      trim: true,
    },

    project_type: {
      type: String,
      required: true,
      trim: true,
    },
    resource_type: {
      type: String,
      required: true,
      trim: true,
    },

    start_date: {
      type: Date,
      required: true,
    },

    end_date: {
      type: Date,
      required: true,
    },

    no_of_days: {
      type: Number,
    },

    remarks: {
      type: String,
      default: "",
    },

    tmg_status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    tmg_reason: {
      type: String,
      default: "",
    },

    finance_status: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
    },
    finance_reason: {
      type: String,
      default: "",
    },
    attachment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Request", requestSchema);
