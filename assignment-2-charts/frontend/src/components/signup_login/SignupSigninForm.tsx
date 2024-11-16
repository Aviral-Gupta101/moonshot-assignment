import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import axios from "axios"
import { SERVER_ADDRESS } from "@/global/global-variables"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { LoaderCircle } from "lucide-react"
// import { isAxiosError } from "node_modules/axios/index.d.cts"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3, { message: "Password should contain atleast 3 character" }),
})


type Props = {

  isSignup: boolean
}

export function SignupSigninForm({ isSignup }: Props) {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const cardTitle = isSignup ? "Create New Account" : "Account Login";

  async function handleSingup(email: String, password: String) {

    try {

      setIsLoading(true);
      await axios.post(SERVER_ADDRESS + "auth/signup", {
        email, password
      });
      navigate("/login");

    } catch (error) {

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        }

        else if (error.status === 409)
          setError("Email Already exists")
      }
      else 
        setError("Unable to signup")
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(email: String, password: String) {

    try {

      setIsLoading(true);
      const res = await axios.post(SERVER_ADDRESS + "auth/signin", {
        email, password
      });

      localStorage.setItem("token", res.data.token);
      
      navigate("/");

    } catch (error) {

      if (axios.isAxiosError(error)) {

        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        }

        else if (error.status === 401)
          setError("Email or password incorrect")
      }
      else
        setError("Unable to login")

    } finally {
      setIsLoading(false);
    }
  }


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })


  function onSubmit(values: z.infer<typeof formSchema>) {
   

    if(isSignup)
      handleSingup(values.email, values.password)
    else 
      handleLogin(values.email, values.password)

    console.log(values)
  }

  return (
    <Card className="w-[350px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-center">{cardTitle}</CardTitle>
        <CardDescription className="text-center">Enter your email and password below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your_email@gmail.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your email address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" placeholder="Passowrd" {...field} type="password" />
                  </FormControl>
                  <FormDescription>
                    This is your password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormMessage className="text-center text-sm">{error}</FormMessage>
            <div className="text-center ">
              {
                isSignup ? <div className="text-sm mt-4">Already have an account?
                  <Link className="hover:underline hover:cursor-pointer" to={"/login"}> Login</Link>
                </div> : <div className="text-sm mt-4">Dont't have an account?
                  <Link className="hover:underline hover:cursor-pointer" to={"/signup"}> Signup</Link>
                </div>
              }
            </div>


            {
              isSignup ? <Button disabled={isLoading} className="mt-2 w-full" type="submit">
                {
                  isLoading ? <LoaderCircle className="animate-spin" /> : "Create Account"
                }
              </Button> :
                <Button disabled={isLoading} className="mt-2 w-full" type="submit">
                  {
                    isLoading ? <LoaderCircle className="animate-spin" /> : "Login"
                  }
                </Button>
            }
          </form>
        </Form >

      </CardContent>
    </Card>
  )
}