import { Metadata } from "next";
import { notFound } from "next/navigation";
import {getUserById} from '@/lib/actions/user.actions';
import UserForm from "@/components/admin/user-form";

export const metadata: Metadata = {
    title: "Admin User Update",
};

const AdminUserUpdate = async (props: { params: Promise<{ id: string }> }) => {
    const { params } = props;
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
        notFound();
    }
    console.log(user)
    return ( 
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">Update User</h1>
            <UserForm user={user as any}/>
        </div>
     );
}
 
export default AdminUserUpdate;