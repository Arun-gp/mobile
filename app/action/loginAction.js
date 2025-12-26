"use server"

import dbconnect from '@/db/dbconnect';
import UserModels from '@/model/UserModel';
import bcrypt from 'bcrypt';
import { SignJWT } from "jose";
import dotenv from 'dotenv'
import { cookies } from "next/headers";


dotenv.config()

export async function UserLogin(formData) {
    const SECRET_KEY=process.env.NEXT_PUBLIC_JWT_SECRET_KEY
    const encodedsecretkey=new TextEncoder().encode(SECRET_KEY)
   const email = formData.get("email");
   const password = formData.get("password");
   await dbconnect(); // Ensure DB connection is established

      // Find the user by email
   const user = await UserModels.findOne({ email });

      if (!user) {
         return { success: false, message: "User not found." };
      }
      // Compare provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return { success: false, message: "Invalid password." };
      }
      // Create JWT token using secret from .env file
      const token= await new SignJWT({ user: user._id , role: user.role })  // Add user information to the payload
      .setIssuedAt()  // Set the issued at time
      .setExpirationTime('1h')  // Set token expiration (1 hour)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(encodedsecretkey);  // Sign the token with the secret key
     
       
      const cookieStore = await cookies();
      cookieStore.set('token', token, {
         httpOnly: true,  // Makes it inaccessible to JavaScript (better security)
         maxAge: 60 * 60,  // 1 hour
         path: '/' // Available across the entire app
         
      });

      const plainUser = user._id.toString(); 
     const role=user.role;
      // Return token and user data
      return { success: true, message: "Login successful!", token,  user: plainUser,role,email };
   
}   
export async function UserLogout(){
    const cookieStore = await cookies();
    // Delete the 'token' cookie to log the user out
    cookieStore.delete('token');
  
    // Return a success response
    
    return { success: true, message: "Logged out successfully"};
 }