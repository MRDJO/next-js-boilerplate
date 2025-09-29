import { NextRequest, NextResponse } from 'next/server';
import { NextSessionService } from '../../../../features/auth/infrastructure/services/NextSessionService';

export async function GET(request: NextRequest) {
  try {
    // Get current session
    const session = await NextSessionService.getSession();
    
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_SESSION',
            message: 'No active session',
          }
        },
        { status: 401 }
      );
    }

    // Check if session is still valid
    const isValid = await NextSessionService.isSessionValid();
    
    if (!isValid) {
      NextSessionService.clearSession();
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SESSION_EXPIRED',
            message: 'Session has expired',
          }
        },
        { status: 401 }
      );
    }

    // Update last activity
    await NextSessionService.updateSession({
      lastActivityAt: new Date().toISOString()
    });

    // Return session info (no sensitive tokens)
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.userId,
          email: session.email,
          name: session.name,
        },
        session: {
          id: session.sessionId,
          createdAt: session.createdAt,
          lastActivityAt: session.lastActivityAt,
          expiresAt: session.accessTokenExpiresAt,
        }
      }
    });

  } catch (error) {
    console.error('Session API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SESSION_ERROR',
          message: 'Error retrieving session',
        }
      },
      { status: 500 }
    );
  }
}