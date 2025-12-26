"use server";
import dbconnect from "@/db/dbconnect";
import UserModels from "@/model/UserModel";

// Server function to get all users
export async function getUsers() {
  try {
    await dbconnect(); // Connect to the database
    const users = await UserModels.find(); // Get all users

    // Manually convert Mongoose documents to plain objects
    const serializedUsers = users.map(user => {
      const plainUser = user.toObject();  // Convert Mongoose document to plain object
      plainUser._id = plainUser._id.toString();  // Convert ObjectId to string
      return plainUser;
    });

    return serializedUsers; // Return plain JavaScript objects
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
