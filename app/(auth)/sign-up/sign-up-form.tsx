'use client'
import { signUpDefaultValues } from "@/lib/constants";
import { useState } from "react";
import Link from 'next/link'
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInWithCredentials, signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";


const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: ""
  });

  const [name, setName] = useState(signUpDefaultValues.name);
  const [email, setEmail] = useState(signUpDefaultValues.email);
  const [password, setPassword] = useState(signUpDefaultValues.password);
  const [confirmPassword, setConfirmPassword] = useState(signUpDefaultValues.confirmPassword);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();

    return (
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form action={action} method="POST" >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
    <div>
      <label className="block text-sm font-medium text-gray-700" htmlFor="name">
        Name
      </label>
      <input
        id="name"
        type="text"
        placeholder="Name"
        value={name}
        name="name"
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div>
    <label className="block text-sm font-medium text-gray-700" htmlFor="email">
      Email
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
    <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
      Confirm Password
    </label>
    <input
      id="confirmPassword"
      type="password"
      placeholder="Confirm Password"
      value={confirmPassword}
      name="confirmPassword"
      onChange={(e) => setConfirmPassword(e.target.value)}
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
      Already have an account? <Link href="/sign-in" className="text-blue-500 hover:underline">Sign in</Link>
    </div>
    </form>
  );
};

export default SignUpForm;