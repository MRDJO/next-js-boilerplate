import "server-only";

import { getAppContainer } from "@/core/di/container";
import { TOKENS } from "@/core/di/tokens";
import type { AuthService } from "./auth.types";

export const getAuthService = (): AuthService =>
  getAppContainer().get<AuthService>(TOKENS.AuthService);
