import { NextResponse } from 'next/server';
import dbconnect from "@/db/dbconnect";

export async function POST(req) {
  try {
    await dbconnect()
    const { transactionId } = await req.json();

    // Integrate with your UPI payment gateway here to verify the transaction

    return NextResponse.json({ verified: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Payment verification failed' }, { status: 500 });
  }
}
