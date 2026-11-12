import {Metadata} from 'next'
import {getAllUsers} from '@/lib/actions/user.actions'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { formatId } from '@/lib/utils';
import Link from 'next/link';
import Pagination from "@/components/shared/pagination";
import { Button } from '@/components/ui/button';
import { Badge } from 'lucide-react';
import DeleteDialog from "@/components/delete-dialog";
import { deleteUser } from '@/lib/actions/user.actions';

export const metadata: Metadata = {
    title: 'Admin Users',
}

const AdminUsersPage = async (props: { searchParams?: Promise<{page: string, query?: string}> }) => {
    const page = Number((await props.searchParams)?.page ?? 1);
    const queryText = (await props.searchParams)?.query ?? "";
    const users = await getAllUsers({ page, query: queryText });
    console.log(users)
    return (
         <div className="overflow-x-auto">
                <h1 className="text-2xl font-bold mb-4">Users</h1>
                {queryText && (
                    <p>Showing results for query: <strong>{queryText}</strong></p>
                )}
                <Table className="table w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>USER ID</TableHead>
                            <TableHead>NAME</TableHead>
                            <TableHead>EMAIL</TableHead>
                            <TableHead>ROLE</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.data?.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{formatId(user.id)}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.role === 'user' ? (<Badge>User</Badge>) : (<Badge>Admin</Badge>)}
                                </TableCell>
                                <TableCell>
                                    <Button className="mr-2" size="sm" variant="outline">
                                    <Link href={`/admin/users/${user.id}`} className="text-blue-500 hover:underline">
                                        Edit
                                    </Link>
                                    </Button>
                                     <DeleteDialog id={user.id} onDelete={deleteUser} />
                                </TableCell>
                            </TableRow  >
                        ))}
                    </TableBody>
                </Table>
                {users.totalPages && users.totalPages > 1 && (
                    <div className="mt-4">
                        <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
                    </div>
                )}
            </div>
    )
}

export default AdminUsersPage;