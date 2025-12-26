import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

// GET /api/user/profile?userId=xxx - Get user profile
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const userData = userDoc.data();
        return NextResponse.json({
            id: userDoc.id,
            name: userData.name || 'User',
            email: userData.email || '',
            profilePicture: userData.profilePicture || '/default-avatar.png',
            phone: userData.phone || '',
            address: userData.address || '',
            role: userData.role || 'user',
            createdAt: userData.createdAt || null
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request) {
    try {
        const body = await request.json();
        const { userId, name, phone, address, profilePicture } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            await setDoc(userRef, {
                name: name || 'User',
                phone: phone || '',
                address: address || '',
                profilePicture: profilePicture || '/default-avatar.png',
                updatedAt: new Date().toISOString()
            });
        } else {
            // Update existing user
            const updateData = {
                updatedAt: new Date().toISOString()
            };

            if (name !== undefined) updateData.name = name;
            if (phone !== undefined) updateData.phone = phone;
            if (address !== undefined) updateData.address = address;
            if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

            await updateDoc(userRef, updateData);
        }

        return NextResponse.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}
