import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/db";

export async function POST(request: Request) {
  try {
    const { doctorId, userId, date, time } = await request.json();
    const client = await clientPromise;
    const db = client.db("test");

    const result = await db.collection("Appointment").insertOne({
      doctorId: new ObjectId(doctorId),
      userId: new ObjectId(userId),
      date,
      time,
      status: "pending",
    });

    return NextResponse.json({ message: "Appointment booked successfully", appointmentId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json({ message: "Failed to book appointment" }, { status: 500 });
  }
}
