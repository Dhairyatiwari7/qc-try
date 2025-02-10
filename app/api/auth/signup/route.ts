import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

interface RequestBody {
  username: string;
  password: string;
  role: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { username, password, role }: RequestBody = await request.json();

    // Validate input
    if (!username || !password || !role) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    // Use environment variable for MongoDB URI
    const uri = 'mongodb+srv://quickcare:quickcare@cluster0.qpo69.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; 
    if (!uri) {
      throw new Error("MongoDB URI not defined in environment variables");
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("test"); 
    const usersCollection = db.collection("User"); 

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      await client.close();
      return NextResponse.json({ message: "User exists already!" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await usersCollection.insertOne({
      username,
      password: hashedPassword,
      role,
    });

    await client.close();
    
    return NextResponse.json(
      { 
        message: "User created successfully!", 
        user: { username, role } 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Error creating user!" }, { status: 500 });
  }
}
