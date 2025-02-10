import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../lib/db";

export async function GET(request: Request, { params }: { params: { doctorId: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    const appointments = await db.collection("Appointment").find({ doctorId: new ObjectId(params.doctorId) }).toArray();

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return NextResponse.json({ message: "Failed to fetch appointments" }, { status: 500 });
  }
}
