import { Schema, model } from "mongoose";

export const ALERT_CONDITIONS = ["above", "below", "percentUp", "percentDown"] as const;
export type AlertCondition = (typeof ALERT_CONDITIONS)[number];

const alertSchema = new Schema(
  {
    uid: { type: String, required: true, index: true },
    ticker: { type: String, required: true, uppercase: true, trim: true },
    // above/below compare the price to `value` in dollars;
    // percentUp/percentDown compare today's % change to `value` percent.
    condition: { type: String, enum: ALERT_CONDITIONS, required: true },
    value: { type: Number, required: true, min: 0 },
    delivery: { type: String, enum: ["email", "app"], default: "app" },
    email: String,
    status: { type: String, enum: ["active", "triggered"], default: "active", index: true },
    triggeredAt: Date,
    triggeredPrice: Number,
  },
  { timestamps: true },
);

export const Alert = model("Alert", alertSchema);

export function describeCondition(condition: AlertCondition, value: number): string {
  switch (condition) {
    case "above":
      return `Price above $${value}`;
    case "below":
      return `Price below $${value}`;
    case "percentUp":
      return `Price +${value}%`;
    case "percentDown":
      return `Price -${value}%`;
  }
}
