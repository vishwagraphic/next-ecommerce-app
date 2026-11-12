import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from 'next/image'
import SignInForm from "./sign-in-form";
import { redirect } from "next/navigation"
import {auth} from "@/auth"

export const metadata: Metadata = {
  title: 'Sign In'
};

const SignIn = async (props: {
    searchParams: Promise<{
        callbackUrl?: string;
    }>
}) => {
  const session = await auth();
  const {callbackUrl} = await props.searchParams;

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
        <Card>
            <CardHeader className="space-y-4"> 
                <Link href="/sign-up" className="flex-center">
                    <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
                </Link>
                <CardTitle className="flex-center">Sign In</CardTitle>
                <CardDescription className="flex-center">
                    Sign in to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignInForm />
            </CardContent>
        </Card>
    </div>
  );
};

export default SignIn;