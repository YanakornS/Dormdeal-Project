const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postType: {
      type: String,
      enum: ["WTB", "WTS"],
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },
    subcategory: { type: mongoose.Schema.Types.ObjectId },

    images: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ["มือสองสภาพดี", "มือสองสภาพพอใช้"],
      required: true,
    },
    postPaymentType: {
      type: String,
      enum: ["Free", "Paid"],
      default: "Free",
    },
    status: {
      type: String,
      enum: [
        "pending_review",
        "approved",
        "needs_revision",
        "rejected",
        "sold",
      ],
      default: "pending_review",
    },
    modNote: {
      type: String,
      default: null,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
<<<<<<< HEAD
  {
    timestamps: true,
  }
);
=======
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ["มือสองสภาพดี", "มือสองสภาพพอใช้"],
    required: true,
  },
  postPaymentType: {
    type: String,
    enum: ["Free", "Paid"],
    default: "Free",
  },
  status: {
    type: String,
    enum: ["pending_review", "approved", "needs_revision", "rejected","sold"],
    default: "pending_review",
  },
  modNote: {
    type: String,
    default: null,
  
  },
  isSold: {
    type: Boolean,
    default: false,
  },
  buyer: {
  type: Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
},{
  timestamps: true,
});
>>>>>>> AdminAndSold

const PostModel = model("Post", PostSchema);
module.exports = PostModel;
