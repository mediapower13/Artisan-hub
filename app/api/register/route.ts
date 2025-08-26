import { NextRequest, NextResponse } from "next/server";

// Simple in-memory user storage for demo
const users = new Map();

export async function POST(req: NextRequest) {
  try {
    console.log("Registration endpoint hit");
    
    const body = await req.json();
    console.log("Registration data received:", body);
    
    const { 
      email, 
      password, 
      fullName, 
      firstName, 
      lastName, 
      phone, 
      role, 
      userType,
      studentId,
      department,
      level,
      businessName,
      location,
      experienceYears,
      skills
    } = body;

    // Handle both formats - fullName+userType or firstName+lastName+role
    const actualFirstName = firstName || (fullName ? fullName.split(' ')[0] : '');
    const actualLastName = lastName || (fullName ? fullName.split(' ').slice(1).join(' ') : '');
    const actualRole = role || userType;
    const actualFullName = fullName || `${firstName} ${lastName}`.trim();

    // Basic validation
    if (!email || !password || !actualFullName || !phone || !actualRole) {
      console.log("Missing required fields");
      console.log("Received:", { email: !!email, password: !!password, fullName: !!actualFullName, phone: !!phone, role: !!actualRole });
      return Response.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    if (users.has(email)) {
      console.log("User already exists:", email);
      return Response.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // Create user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      firstName: actualFirstName,
      lastName: actualLastName,
      fullName: actualFullName,
      phone,
      role: actualRole,
      // Student specific fields
      studentId: actualRole === "student" ? studentId : undefined,
      department: actualRole === "student" ? department : undefined,
      level: actualRole === "student" ? level : undefined,
      // Artisan specific fields  
      businessName: actualRole === "artisan" ? businessName : undefined,
      location: actualRole === "artisan" ? location : undefined,
      experienceYears: actualRole === "artisan" ? experienceYears : undefined,
      skills: actualRole === "artisan" ? skills : undefined,
      createdAt: new Date().toISOString()
    };

    users.set(email, newUser);
    
    console.log("User created successfully:", email);

    // Create response
    const response = Response.json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role
      }
    }, { status: 201 });

    // Set session cookie
    const sessionToken = `session_${newUser.id}_${Date.now()}`;
    response.headers.set(
      'Set-Cookie',
      `auth-token=${sessionToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    );

    return response;

  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
