import { NextResponse } from 'next/server';
import AWS from "aws-sdk";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
    region: "eu-north-1",
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = "ecommerece-aadhanaa";

export async function POST(req) {
    try {
        const formData = await req.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const price = parseFloat(formData.get("price"));
        const category = formData.get("category");
        const stock = parseInt(formData.get("stock")) || 0;
        const discountPercentage = parseFloat(formData.get("discountPercentage")) || 0;
        const material = formData.get("material");

        // Multiple Images
        const images = formData.getAll("image");

        async function uploadToS3(file) {
            if (!file || typeof file === 'string') return file;
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

        const imageUrls = [];
        for (let img of images) {
            if (img && typeof img !== 'string' && img.size > 0) {
                const uploadedUrl = await uploadToS3(img);
                imageUrls.push(uploadedUrl);
            }
        }

        // Sizes
        const sizes = {
            XS: {
                stock: parseInt(formData.get("XS_stock")) || 0,
                price: parseFloat(formData.get("XS_price")) || price,
            },
            S: {
                stock: parseInt(formData.get("S_stock")) || 0,
                price: parseFloat(formData.get("S_price")) || price,
            },
            M: {
                stock: parseInt(formData.get("M_stock")) || 0,
                price: parseFloat(formData.get("M_price")) || price,
            },
            L: {
                stock: parseInt(formData.get("L_stock")) || 0,
                price: parseFloat(formData.get("L_price")) || price,
            },
            XL: {
                stock: parseInt(formData.get("XL_stock")) || 0,
                price: parseFloat(formData.get("XL_price")) || price,
            },
            XXL: {
                stock: parseInt(formData.get("XXL_stock")) || 0,
                price: parseFloat(formData.get("XXL_price")) || price,
            },
        };

        const productData = {
            name,
            description,
            price,
            category,
            stock,
            image: imageUrls,
            discountPercentage,
            sizes,
            details: { material },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const productsRef = collection(db, "products");
        const docRef = await addDoc(productsRef, productData);

        return NextResponse.json({
            success: true,
            message: "Product added to Firebase successfully!",
            id: docRef.id
        });
    } catch (err) {
        console.error("ERROR ADDING PRODUCT TO FIREBASE API:", err);
        return NextResponse.json({
            success: false,
            message: "Failed to add product to Firebase"
        }, { status: 500 });
    }
}
