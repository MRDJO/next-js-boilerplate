import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle";
import { featureFlags } from "@/core/config/feature-flags";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <LoginForm otpEnabled={featureFlags.otpEnabled} />
    </div>
  );
}
