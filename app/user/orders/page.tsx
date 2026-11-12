import { Metadata } from "next";
import { getMyOrders } from "@/lib/actions/order.action";
import { formatCurrency, formatId } from "@/lib/utils";
import Link from "next/link";
import { Table, TableHeader, TableRow, TableBody, TableCell, TableHead } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";

const metadata: Metadata = {
    title: "My Orders",
};

const Orders = async (props: { searchParams: Promise<{ page: string }> }) => {
    const {page} = await props.searchParams;

    const orders = await getMyOrders({ page: Number(page) || 1 });

    return (<>
        <div className="space-y-2">
            <h1 className="text-2xl font-bold">My Orders</h1>

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
                        {orders?.orders?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{formatId(order.id)}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                <TableCell>{order.isPaid ? new Date(order.paid_at as any).toLocaleDateString() : "Not paid"}</TableCell>
                                <TableCell>{order.isDelivered ? new Date(order.delivered_at as any).toLocaleDateString() : "Not delivered"}</TableCell>
                                <TableCell>
                                    <Link href={`/order/${order.id}`} className="text-blue-500 hover:underline">
                                        View Details
                                    </Link>
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

    </>);
}

export default Orders;