import { Metadata } from "next";
import { auth } from "@/auth";
import {SessionProvider} from "next-auth/react";
import { User } from "lucide-react";
import UserProfileForm from "./user-profile-form";

export const metadata: Metadata = {
    title: "User Profile",
};

const ProfilePage = async () => {
    const session = await auth();
    if (!session) {
        throw new Error("User not found");
    }
    return (
        <SessionProvider session={session}>
            <div className="max-w-md mx-auto space-y-4">
                <h2 className="text-2xl font-bold">Profile</h2>
                <p>Welcome, {session.user?.name}</p>
            </div>
            <UserProfileForm />
        </SessionProvider>
    );
}

export default ProfilePage;