'use client'
import { signInDefaultValues } from "@/lib/constants";
import { useState } from "react";
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";


const SignInForm = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: ""
  });

  const [email, setEmail] = useState(signInDefaultValues.email);
  const [password, setPassword] = useState(signInDefaultValues.password);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </Button>
    );
  };

  return (
    <form action={action} method="POST" >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
    <div>
    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
      User Name
    </label>
    <input
      id="email"
      type="email"
      placeholder="Email"
      value={email}
      name="email"
      onChange={(e) => setEmail(e.target.value)}
    />
    </div>
    <div>
    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
      Password
    </label>
    <input
      id="password"
      type="password"
      placeholder="Password"
      value={password}
      name="password"
      onChange={(e) => setPassword(e.target.value)}
    />
    </div>
    <div>
     <SignInButton />
    </div>
    {
        data && !data.success && (
          <div className="text-sm text-destructive">
            {data.message}
          </div>
        )
      }
    <div className="text-sm text-gray-600">
      Don't have an account? <Link href="/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
    </div>
    </form>
  );
};

export default SignInForm;