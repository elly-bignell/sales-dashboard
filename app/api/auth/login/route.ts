import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
          const body = await request.json();
          const { password } = body;

      // Get the expected password from environment variable
      const correctPassword = process.env.DASHBOARD_AUTH_TOKEN;

      // Validate that the password matches
      if (!password || password !== correctPassword) {
              return NextResponse.json(
                { error: 'Invalid password' },
                { status: 401 }
                      );
      }

      // Create response with auth token cookie
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
            );

      // Set the auth-token cookie
      // httpOnly prevents JavaScript access, secure requires HTTPS in production
      response.cookies.set('auth-token', correctPassword!, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 60 * 60 * 24 * 7, // 7 days
              path: '/',
      });

      return response;
    } catch (error) {
          return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
                );
    }
}
