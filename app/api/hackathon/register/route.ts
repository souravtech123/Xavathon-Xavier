import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Registration from "@/models/Registration";

const generateTeamId = () => {
  return "TEAM-" + Math.random().toString(36).substring(2, 8).toUpperCase();
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectToDatabase();

    // Basic validation
    const { teamName, leaderEmail, leaderPhone, participants } = body;
    if (!teamName || !leaderEmail || !leaderPhone || !participants || participants.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const teamId = generateTeamId();
    
    const newRegistration = new Registration({
      ...body,
      teamId,
      status: "Pending",
    });

    await newRegistration.save();

    return NextResponse.json(
      { message: "Registration successful", teamId, teamName: body.teamName, leaderName: body.leaderName, leaderEmail: body.leaderEmail },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
