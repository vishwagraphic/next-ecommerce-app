import { auth } from "@/auth";
import {deleteOrder, getAllOrders} from "@/lib/actions/order.action";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Link from "next/link";
import { formatId, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/delete-dialog";

const AdminOrdersPage = async (props: { searchParams: Promise<{ page?: number, limit?: number, query?: string }> }) => {
    const page = (await props.searchParams)?.page ?? 1;
    const limit = (await props.searchParams)?.limit ?? 10;
    const queryText = (await props.searchParams)?.query ?? "";

    const session = await auth();
    if (session?.user?.role !== "admin") {
        throw new Error("User not authorized");
    }
    const orders = await getAllOrders({ page, limit, query: queryText });
    console.log(orders)
    return (
        <div>
            <h1>Admin Orders</h1>
            {
                queryText && (
                    <p>Showing results for query: <strong>{queryText}</strong></p>
                )
            }
            <div className="overflow-x-auto">
                <Table className="table w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>ORDER ID</TableHead>
                            <TableHead>DATE</TableHead>
                            <TableHead>TOTAL</TableHead>
                            <TableHead>PAID</TableHead>
                            <TableHead>DELIVERED</TableHead>
                            <TableHead>ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders?.data?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{formatId(order.id)}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                <TableCell>{order.isPaid ? new Date(order.paid_at as any).toLocaleDateString() : "Not paid"}</TableCell>
                                <TableCell>{order.isDelivered ? new Date(order.delivered_at as any).toLocaleDateString() : "Not delivered"}</TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" >
                                        <Link href={`/order/${order.id}`} className="text-blue-500 hover:underline">
                                            View Details
                                        </Link>
                                    </Button>
                                    <DeleteDialog id={order.id} onDelete={deleteOrder} />
                                </TableCell>
                            </TableRow  >
                        ))}
                    </TableBody>
                </Table>
                {orders.totalPages && orders.totalPages > 1 && (
                    <div className="mt-4">
                        <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default AdminOrdersPage;