import { SignupSigninForm } from "@/components/signup_login/SignupSigninForm"

export function SignupPage() {
  return (

    <main className="min-h-screen flex justify-center items-center">
      <SignupSigninForm isSignup={true} />
    </main>

  )
}
