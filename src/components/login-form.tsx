"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "@bprogress/next/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { loginAction, verifyOtpAction } from "@/core/auth/auth.actions";
import {
  loginSchema,
  otpSchema,
  type LoginFormValues,
  type OtpFormValues,
} from "@/core/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import FormInputField from "./form/form-input-field";
import FormInputPasswordField from "./form/form-input-password-field";
import { DASHBOARDSTARTPATH } from "@/lib/config";
import { toast } from "sonner";

export function LoginForm({
  className,
  otpEnabled = false,
  ...props
}: React.ComponentProps<"div"> & { otpEnabled?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otpSessionId, setOtpSessionId] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
  });

  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
    mode: "onSubmit",
  });

  const goBackToCredentials = () => {
    setStep("credentials");
    setOtpSessionId(null);
    otpForm.reset({ code: "" });
  };

  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      const response = await loginAction(values.username, values.password);

      if (response.code !== 200) {
        toast.error(response.message, { position: "top-center" });
        return;
      }

      if (response.requiresOtp && response.otpSessionId) {
        setOtpSessionId(response.otpSessionId);
        otpForm.reset({ code: "" });
        setStep("otp");
        toast.message(response.message, { position: "top-center" });
        return;
      }

      router.push(DASHBOARDSTARTPATH);
    } catch {
      toast.error("Une erreur est survenue.", { position: "top-center" });
    }
  };

  const onOtpSubmit = async (values: OtpFormValues) => {
    if (!otpSessionId) {
      return;
    }

    try {
      const response = await verifyOtpAction(otpSessionId, values.code);

      if (response.code !== 200) {
        toast.error(response.message, { position: "top-center" });
        return;
      }

      router.push(DASHBOARDSTARTPATH);
    } catch {
      toast.error("Une erreur est survenue.", { position: "top-center" });
    }
  };

  return (
    <div className={cn("mx-auto w-full max-w-sm", className)} {...props}>
      <Card className="border shadow-sm">
        {step === "credentials" ? (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Connexion</CardTitle>
              <CardDescription>
                Saisissez vos identifiants pour acceder a votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                >
                  <FormInputField
                    name="username"
                    control={loginForm.control}
                    label="Nom d'utilisateur"
                    inputProps={{
                      autoComplete: "username",
                      placeholder: "admin",
                    }}
                  />
                  <FormInputPasswordField
                    name="password"
                    control={loginForm.control}
                    label="Mot de passe"
                    inputProps={{ autoComplete: "current-password" }}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    loading={loginForm.formState.isSubmitting}
                  >
                    Se connecter
                  </Button>
                  {otpEnabled && (
                    <p className="text-center text-xs text-muted-foreground">
                      Une verification OTP sera demandee apres connexion.
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Verification OTP</CardTitle>
              <CardDescription>
                Saisissez le code a 6 chiffres recu pour finaliser la connexion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...otpForm}>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={otpForm.handleSubmit(onOtpSubmit)}
                >
                  <FormField
                    control={otpForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code OTP</FormLabel>
                        <FormControl>
                          <InputOTP
                            maxLength={6}
                            pattern={REGEXP_ONLY_DIGITS}
                            value={field.value}
                            onChange={field.onChange}
                            disabled={otpForm.formState.isSubmitting}
                          >
                            <InputOTPGroup className="w-full justify-center">
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    loading={otpForm.formState.isSubmitting}
                    disabled={otpForm.watch("code")?.length !== 6}
                  >
                    Verifier
                  </Button>
                </form>
              </Form>
              <Button
                type="button"
                variant="link"
                className="mt-2 w-full"
                onClick={goBackToCredentials}
              >
                Retour
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
