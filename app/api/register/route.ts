
import { NextRequest, NextResponse } from "next/server";
import { authUtils } from "@/lib/auth-utils";
import { createUser as dbCreateUser } from "@/lib/database";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = body || {};
    let {
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
    } = raw as Record<string, any>;

    // Normalize inputs
    email = typeof email === 'string' ? email.trim().toLowerCase() : '';
    password = typeof password === 'string' ? password : '';
    fullName = typeof fullName === 'string' ? fullName.trim() : '';
    firstName = typeof firstName === 'string' ? firstName.trim() : '';
    lastName = typeof lastName === 'string' ? lastName.trim() : '';
    phone = typeof phone === 'string' ? phone.trim() : '';
    role = typeof role === 'string' ? role.trim() : '';

    const actualFirstName = firstName || (fullName ? fullName.split(' ')[0] : '');
    const actualLastName = lastName || (fullName ? fullName.split(' ').slice(1).join(' ') : '');
    const actualRole = (role || userType || '').toLowerCase();
    const actualFullName = fullName || `${actualFirstName} ${actualLastName}`.trim();

    if (!email || !password || !actualFullName || !phone || !actualRole) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await authUtils.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash password
    const password_hash = await authUtils.hashPassword(password);

    // Create user in DB
    const dbResult = await dbCreateUser({
      email,
      name: actualFullName,
      password_hash,
      role: actualRole as 'student' | 'artisan',
      phone,
      location: location || undefined,
      bio: undefined
    });

    // dbResult.data may be an array, an object, or undefined depending on implementation
    let user: any = null;
    if (dbResult && dbResult.success) {
      const d = dbResult.data;
      if (Array.isArray(d) && d.length > 0) user = d[0];
      else if (d && typeof d === 'object') user = d;
    }

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    const responsePayload = {
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email || email,
        fullName: user.name || actualFullName,
        role: user.role || actualRole
      }
    };

    const response = NextResponse.json(responsePayload, { status: 201 });

    // Try to generate JWT token and set cookie; don't fail registration if token generation fails
    try {
      const token = await authUtils.generateToken({
        id: user.id,
        email: user.email || email,
        fullName: user.name || actualFullName,
        userType: user.role || actualRole,
        role: user.role || actualRole
      } as any);
      response.headers.set('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`);
    } catch (err) {
      console.warn('Token generation failed (non-fatal):', err);
    }

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
