import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/db";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    const appointments = await db.collection("Appointment").find({ userId: new ObjectId(params.userId) }).toArray();

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    return NextResponse.json({ message: "Failed to fetch appointments" }, { status: 500 });
  }
}
