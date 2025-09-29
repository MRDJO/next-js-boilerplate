import { NextRequest, NextResponse } from 'next/server';
import { getAuthContainer, TYPES } from '../../../../config/auth.container';
import { LoginCommand } from '../../../../features/auth/application/commands/LoginCommand';
import { LoginUseCase } from '../../../../features/auth/application/use-cases/LoginUseCase';
import { NextSessionService } from '../../../../features/auth/infrastructure/services/NextSessionService';
import { AuthenticationError } from '../../../../features/auth/domain/errors/AuthenticationError';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Get client info
    const userAgent = request.headers.get('user-agent') || undefined;
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.ip || undefined;
    
    // Add metadata to request
    const requestWithMetadata = {
      ...body,
      userAgent,
      ipAddress: ip,
    };

    // Get use case from container
    const container = getAuthContainer();
    const loginUseCase = container.get<LoginUseCase>(TYPES.LoginUseCase);

    // Create command with validation
    const command = LoginCommand.create(requestWithMetadata);

    // Execute use case
    const result = await loginUseCase.execute(command);
    
    // Create session in Next.js
    const sessionData = {
      userId: result.user.getId().getValue(),
      sessionId: result.session!.getId().getValue(),
      email: result.user.getEmail().getValue(),
      name: result.user.getName(),
      accessToken: result.session!.getAccessToken().getValue(),
      refreshToken: result.session!.getRefreshToken().getValue(),
      accessTokenExpiresAt: result.session!.getAccessToken().getExpiresAt().toISOString(),
      refreshTokenExpiresAt: result.session!.getRefreshToken().getExpiresAt().toISOString(),
      createdAt: result.session!.getCreatedAt().toISOString(),
      lastActivityAt: result.session!.getLastActivityAt().toISOString(),
    };

    await NextSessionService.createSession(sessionData, body.rememberMe || false);

    // Return safe user data (no tokens)
    const response = {
      success: true,
      data: {
        user: {
          id: result.user.getId().getValue(),
          email: result.user.getEmail().getValue(),
          name: result.user.getName(),
          createdAt: result.user.getCreatedAt().toISOString(),
          lastLoginAt: result.user.getLastLoginAt()?.toISOString(),
        },
        session: {
          id: result.session!.getId().getValue(),
          createdAt: result.session!.getCreatedAt().toISOString(),
          expiresAt: result.session!.getAccessToken().getExpiresAt().toISOString(),
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Login API error:', error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          }
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        }
      },
      { status: 500 }
    );
  }
}