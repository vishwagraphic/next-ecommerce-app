import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Metadata } from "next";
import Link from "next/link";
import Image from 'next/image'
import { redirect } from "next/navigation"
import {auth} from "@/auth"
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: 'Sign Up'
};

const SignUp = async (props: {
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
                <CardTitle className="flex-center">Sign Up</CardTitle>
                <CardDescription className="flex-center">
                    Create a new account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignUpForm />
            </CardContent>
        </Card>
    </div>
  );
};

export default SignUp;