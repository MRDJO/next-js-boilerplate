const toBoolean = (value: string | undefined, fallback = false) => {
  if (value === undefined) {
    return fallback;
  }

  return value === "true";
};

export const env = {
  backendBaseUrl: process.env.NEXTBACKEND_URL ?? "",
  dataProvider: process.env.DATA_PROVIDER ?? "real",
  authProvider: process.env.AUTH_PROVIDER ?? "real",
  otpEnabled: toBoolean(process.env.OTP_ENABLED),
};
