import { NextRequest, NextResponse } from 'next/server';
import { getAuthContainer, TYPES } from '../../../../config/auth.container';
import { LogoutCommand } from '../../../../features/auth/application/commands/LogoutCommand';
import { LogoutUseCase } from '../../../../features/auth/application/use-cases/LogoutUseCase';
import { NextSessionService } from '../../../../features/auth/infrastructure/services/NextSessionService';

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await NextSessionService.getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: true, message: 'Already logged out' }
      );
    }

    // Parse request body for logout reason
    const body = await request.json();
    const reason = body.reason || 'user_initiated';

    // Get use case from container
    const container = getAuthContainer();
    const logoutUseCase = container.get<LogoutUseCase>(TYPES.LogoutUseCase);

    // Create command
    const command = LogoutCommand.create({
      userId: session.userId,
      sessionId: session.sessionId,
      reason: reason,
    });

    // Execute use case
    await logoutUseCase.execute(command);

    // Clear Next.js session
    NextSessionService.clearSession();

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout API error:', error);

    // Clear session even if there's an error
    NextSessionService.clearSession();

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LOGOUT_ERROR',
          message: 'Error during logout, but session cleared',
        }
      },
      { status: 500 }
    );
  }
}