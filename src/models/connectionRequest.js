const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Requester ID is required"],
    },
    toUserId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "Requested to ID is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} Status is invalid`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  if (this.toUserId.equals(this.fromUserId)) {
    return next(new Error("Self requesting is not allowed"));
  }
  next();
});

const connectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequestModel;
