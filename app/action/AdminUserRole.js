"use server";

import dbconnect from "@/db/dbconnect";
import UserModels from "@/model/UserModel";

export async function updateUserRole(userId, newRole) {
  try {
    // Connect to the database
    await dbconnect();

    // Find the user by ID and update their role
    const updatedUser = await UserModels.findByIdAndUpdate(
      userId,
      { role: newRole }, // Set the new role
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    // Convert Mongoose document to plain object using .toObject()
    const plainUser = updatedUser.toString(); // This removes Mongoose methods and returns a plain object

    return plainUser; // Now it's a plain object
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Error updating user role");
  }
}
