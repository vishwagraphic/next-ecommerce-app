import {Button} from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Unauthorized",
};
export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
            <p className="mb-4">You do not have permission to access this page.</p>
            <Link href="/">
                <Button>Go to Home</Button>
            </Link>
        </div>
    );
}