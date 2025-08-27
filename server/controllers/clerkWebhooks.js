// controllers/clerkWebhooks.js
import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET in environment variables");
    }

    // Clerk webhook headers (must be exact)
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Convert raw buffer to string (important for signature verification)
    const payload = req.body.toString("utf8");

    // Verify Clerk webhook signature
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, headers);

    console.log("✅ Clerk Webhook Verified:", evt.type);

    const { data, type } = evt;

    // Handle events
    if (type === "user.created") {
      console.log("🔍 Raw Clerk data:", JSON.stringify(data, null, 2));
      
      const userData = {
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Unknown User",
        image: data.profile_image_url || data.image_url || "https://via.placeholder.com/150", // Use profile_image_url first
      };

      console.log("📝 Processed userData:", JSON.stringify(userData, null, 2));

      try {
        console.log("🔍 Checking if user exists with ID:", data.id);
        const existingUser = await User.findById(data.id);
        
        if (!existingUser) {
          console.log("👤 Creating new user...");
          const newUser = await User.create(userData);
          console.log("✅ New user saved successfully:", userData.email, "ID:", newUser._id);
          console.log("📊 User document:", JSON.stringify(newUser.toObject(), null, 2));
        } else {
          console.log("ℹ️ User already exists:", userData.email);
        }
      } catch (dbError) {
        console.error("❌ Database Error during user creation:");
        console.error("   Error name:", dbError.name);
        console.error("   Error message:", dbError.message);
        console.error("   Error code:", dbError.code);
        if (dbError.errors) {
          console.error("   Validation errors:", JSON.stringify(dbError.errors, null, 2));
        }
        console.error("📋 Failed userData:", JSON.stringify(userData, null, 2));
        throw dbError;
      }
    }

    else if (type === "user.updated") {
      const userData = {
        email: data.email_addresses?.[0]?.email_address || "",
        name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
        image: data.image_url || "",
      };
      try {
        console.log("🔄 Updating user with ID:", data.id);
        const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
        console.log("✅ User updated successfully:", userData.email);
        console.log("📊 Updated user document:", JSON.stringify(updatedUser.toObject(), null, 2));
      } catch (dbError) {
        console.error("❌ Database Error during user update:");
        console.error("   Error name:", dbError.name);
        console.error("   Error message:", dbError.message);
        console.error("   Error code:", dbError.code);
        if (dbError.errors) {
          console.error("   Validation errors:", JSON.stringify(dbError.errors, null, 2));
        }
        console.error("📋 Failed userData:", JSON.stringify(userData, null, 2));
        throw dbError;
      }
    }

    else if (type === "user.deleted") {
      try {
        console.log("❌ Deleting user with ID:", data.id);
        await User.findByIdAndDelete(data.id);
        console.log("✅ User deleted successfully:", data.id);
      } catch (dbError) {
        console.error("❌ Database Error during user deletion:");
        console.error("   Error name:", dbError.name);
        console.error("   Error message:", dbError.message);
        console.error("   Error code:", dbError.code);
        if (dbError.errors) {
          console.error("   Validation errors:", JSON.stringify(dbError.errors, null, 2));
        }
        console.error("📋 Failed user ID:", data.id);
        throw dbError;
      }
    }

    else {
      console.log("⚠️ Unhandled event type:", type);
    }

    console.log("🎯 Webhook processed successfully, sending 200 response");
    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("❌ Webhook Error:");
    console.error("   Error name:", error.name);
    console.error("   Error message:", error.message);
    console.error("   Stack trace:", error.stack);
    console.log("🚫 Sending 400 response due to error");
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
