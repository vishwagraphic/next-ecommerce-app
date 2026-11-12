import {Metadata} from "next";
import { auth } from "@/auth";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { getOrderSummary } from "@/lib/actions/order.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import Link from "next/link";
import Charts from "./charts";
import { requireAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
    title: "Admin Overview Dashboard",
};
const AdminOverViewPage = async () => {
    await requireAdmin();
    const session = await auth()

    if (session?.user?.role !== "admin") {
        throw new Error("User is not Unauthorized");
    }

    const summary = await getOrderSummary();

    return ( 
    <div className="space-y-2">
        <h1 className="text-2xl font-bold">Admin Overview Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <BadgeDollarSign />
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {summary?.totalSales ? formatCurrency(summary.totalSales.toString()) : formatCurrency(0)}
                </CardContent>
            </Card>
            <Card >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sales</CardTitle>
                    <CreditCard />
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {formatNumber(summary?.totalOrders || 0)}
                </CardContent>
            </Card>
             <Card >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Customers</CardTitle>
                    <Users />
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {formatNumber(summary?.totalUsers || 0)}
                </CardContent>
            </Card>
             <Card >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Products</CardTitle>
                    <Barcode />
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    {formatNumber(summary?.totalProducts || 0)}
                </CardContent>
            </Card>    
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overview</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    <Charts data={{salesData: summary?.salesData || []}} />
                </CardContent>
            </Card>
            <Card className="col-span-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Recent Sales</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>BUYER</TableHead>
                                <TableHead>DATE</TableHead>
                                <TableHead>TOATL</TableHead>
                                <TableHead>ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summary?.latestSale?.map((order:any) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order?.user?.name ? order?.user?.name : 'Deleted User'}</TableCell>
                                    <TableCell>{order.created_at}</TableCell>
                                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                                    <TableCell>
                                        <Link href={`/order/${order.id}`} className="text-blue-500 hover:underline">
                                            View
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                </CardContent>
            </Card>
        </div>
    </div> 
    );
}
 
export default AdminOverViewPage;