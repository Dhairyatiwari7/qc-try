import { NextResponse } from "next/server";
import clientPromise from "../../lib/db";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test"); 
    const doctors = await db.collection("doctors").find({}).toArray();

    return NextResponse.json(doctors, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ message: "Failed to fetch doctors" }, { status: 500 });
  }
}
