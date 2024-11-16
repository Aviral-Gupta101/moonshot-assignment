import { SignupSigninForm } from "@/components/signup_login/SignupSigninForm"

export function LoginPage() {
  return (
    <main className="min-h-screen flex justify-center items-center">
      <SignupSigninForm isSignup={false} />
    </main>

  )
}
