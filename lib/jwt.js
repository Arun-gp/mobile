// lib/jwt.js

import { jwtVerify } from 'jose';

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
const encodedSecretKey = new TextEncoder().encode(SECRET_KEY);


// Verify a JWT

export const verifyToken = async (token) => {
  try {
    console.log("JWT Secret Key:", SECRET_KEY);
    console.log(encodedSecretKey);
    
    console.log("JWT Token:", token);    
    const { payload } = await jwtVerify(token, encodedSecretKey);
    console.log('Decoded JWT:', payload);  // Log the decoded JWT to see the user data
    return payload;  // Return the decoded payload (user information)
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;  // Return null if verification fails
  }
};