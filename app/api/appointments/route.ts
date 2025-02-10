import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../lib/db"; // Corrected import path

export async function POST(request: Request) {
  try {
    const { doctorId, userId, date, time } = await request.json();
    const client = await clientPromise;
    const db = client.db("test");

    if (!ObjectId.isValid(doctorId) || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid Doctor or User ID" }, { status: 400 });
    }

    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(doctorId) });
    if (!doctor) {
      return NextResponse.json({ message: "Doctor not found" }, { status: 404 });
    }

    const result = await db.collection("appointments").insertOne({
      doctorId: new ObjectId(doctorId),
      userId: new ObjectId(userId),
      date,
      time,
      status: "upcoming",
      doctor: {
        name: doctor.name,
        speciality: doctor.speciality,
        fees: doctor.fees,
        image: doctor.image
      }
    });

    return NextResponse.json({ message: "Appointment booked successfully", appointmentId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error booking appointment:", error);
    return NextResponse.json({ message: "Failed to book appointment" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid User ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("test");

    const appointments = await db.collection("appointments")
      .find({ userId: new ObjectId(userId) })
      .toArray();

    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ message: "Failed to fetch appointments" }, { status: 500 });
  }
}
