// /app/profile/actions.js

'use server';

import UserModels from '@/model/UserModel';
import fs from 'fs';
import path from 'path';

export async function uploadProfilePicture(formData) {
  const uploadDir = path.join(process.cwd(), 'public/uploads');

  // Ensure the uploads directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Get the uploaded file from FormData
  const file = formData.get('profilePicture');

  // Convert the file to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // Generate a unique filename based on the current timestamp
  const filename = Date.now() + path.extname(file.name); // Ensure unique filenames
  const filePath = path.join(uploadDir, filename);

  // Write the buffer to the disk
  fs.writeFileSync(filePath, buffer);

  // Return the relative URL to the uploaded file
  return `/uploads/${filename}`;
}
// Function to get user details by user ID
export async function getUserDetails(userId) {
  // Fetch user details by userId (name, email, and profile picture)
  const user = await UserModels.findById(userId).lean(); // Convert Mongoose document to plain object

  if (!user) {
    throw new Error("User not found");
  }

  // Return plain object with relevant fields
  return {
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture || null, // If no profile picture, return null
  };
}
