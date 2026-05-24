import { env } from "./env";

export const featureFlags = {
  otpEnabled: env.otpEnabled,
  useMockData: env.dataProvider === "mock",
  useMockAuth: env.authProvider === "mock",
};
