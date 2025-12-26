"use server"
import dbconnect from "@/db/dbconnect";
import UserModels from "@/model/UserModel";
import bcrypt from 'bcrypt';
export async function resetPassword({ password, token }) {
    try {
        // Connect to the database
        await dbconnect();

        // Find user by reset token and check expiration
        const user = await UserModels.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }, // Ensure token is not expired
        });

        // If no user found or token is expired
        if (!user) {
            return { success: false, message: 'Invalid or expired token' };
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and clear the token
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        // Save updated user information to MongoDB
        await user.save();

        return { success: true, message: 'Password has been reset successfully.' };
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, message: 'An error occurred while resetting the password.' };
    }
}