import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
    region: "eu-north-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = "ecommerece-aadhanaa";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            product: { id: productSnap.id, ...productSnap.data() }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const formData = await req.formData();
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const currentData = productSnap.data();

        // Extract data from the form
        const name = formData.get("name") || currentData.name;
        const description = formData.get("description") || currentData.description;
        const price = parseFloat(formData.get("price")) || currentData.price;
        const category = formData.get("category") || currentData.category;
        const stock = parseInt(formData.get("stock")) || currentData.stock;
        const discountPercentage = parseFloat(formData.get("discountPercentage")) || currentData.discountPercentage;
        const material = formData.get("material") || currentData.details?.material;

        // Handle size-specific stock and price
        const sizes = {
            XS: {
                stock: parseInt(formData.get("XS_stock")) || currentData.sizes?.XS?.stock || 0,
                price: parseFloat(formData.get("XS_price")) || currentData.sizes?.XS?.price || price,
            },
            S: {
                stock: parseInt(formData.get("S_stock")) || currentData.sizes?.S?.stock || 0,
                price: parseFloat(formData.get("S_price")) || currentData.sizes?.S?.price || price,
            },
            M: {
                stock: parseInt(formData.get("M_stock")) || currentData.sizes?.M?.stock || 0,
                price: parseFloat(formData.get("M_price")) || currentData.sizes?.M?.price || price,
            },
            L: {
                stock: parseInt(formData.get("L_stock")) || currentData.sizes?.L?.stock || 0,
                price: parseFloat(formData.get("L_price")) || currentData.sizes?.L?.price || price,
            },
            XL: {
                stock: parseInt(formData.get("XL_stock")) || currentData.sizes?.XL?.stock || 0,
                price: parseFloat(formData.get("XL_price")) || currentData.sizes?.XL?.price || price,
            },
            XXL: {
                stock: parseInt(formData.get("XXL_stock")) || currentData.sizes?.XXL?.stock || 0,
                price: parseFloat(formData.get("XXL_price")) || currentData.sizes?.XXL?.price || price,
            },
        };

        const imageFiles = formData.getAll("image");
        let imageUrls = currentData.image || [];

        const newImageFiles = imageFiles.filter(item => item instanceof File && item.size > 0);

        if (newImageFiles.length > 0) {
            async function uploadToS3(file) {
                const fileName = `${uuidv4()}-${file.name}`;
                const buffer = await file.arrayBuffer();
                const params = {
                    Bucket: BUCKET_NAME,
                    Key: fileName,
                    Body: Buffer.from(buffer),
                    ContentType: file.type,
                };
                const uploadResult = await s3.upload(params).promise();
                return uploadResult.Location;
            }

            // Cleanup old images
            if (currentData.image && Array.isArray(currentData.image)) {
                for (let oldImageUrl of currentData.image) {
                    try {
                        const fileKey = oldImageUrl.split('/').pop();
                        await s3.deleteObject({ Bucket: BUCKET_NAME, Key: fileKey }).promise();
                    } catch (e) {
                        console.error("Failed to delete old image from S3", e);
                    }
                }
            }

            imageUrls = [];
            for (let imageFile of newImageFiles) {
                const imageUrl = await uploadToS3(imageFile);
                imageUrls.push(imageUrl);
            }
        }

        const updatedData = {
            name,
            description,
            price,
            category,
            stock,
            discountPercentage,
            sizes,
            image: imageUrls,
            details: { material: material || "" },
            updatedAt: serverTimestamp(),
        };

        await updateDoc(productRef, updatedData);

        return NextResponse.json({ success: true, message: "Product updated successfully!" });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);

        if (!productSnap.exists()) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        const productData = productSnap.data();

        // Delete images from S3
        if (productData.image && Array.isArray(productData.image)) {
            for (let imageUrl of productData.image) {
                try {
                    const fileKey = imageUrl.split('/').pop();
                    await s3.deleteObject({ Bucket: BUCKET_NAME, Key: fileKey }).promise();
                } catch (e) {
                    console.error("Failed to delete image from S3", e);
                }
            }
        }

        await deleteDoc(productRef);

        return NextResponse.json({ success: true, message: "Product deleted successfully!" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
