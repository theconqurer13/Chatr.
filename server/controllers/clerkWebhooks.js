import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET in environment variables");
    }

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString("utf8");

    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);

    console.log("✅ Clerk Webhook Verified:", evt.type);

    const { data, type } = evt;

    if (type === "user.created") {
      const userData = {
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || ""
      };

      const existingUser = await User.findById(data.id);
      if (!existingUser) {
        await User.create(userData);
        console.log("✅ New user saved:", userData.email);
      } else {
        console.log("ℹ️ User already exists:", userData.email);
      }
    }

    else if (type === "user.updated") {
      const updateFields = {
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || "",
      };

      await User.findByIdAndUpdate(data.id, { $set: updateFields }, { new: true });
      console.log("🔄 User basic info updated (custom fields untouched):", updateFields.email);
    }

    else if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
      console.log("❌ User deleted:", data.id);
    }

    else {
      console.log("⚠️ Unhandled event type:", type);
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
