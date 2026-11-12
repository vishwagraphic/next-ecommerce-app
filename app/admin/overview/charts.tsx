'use client'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Legend } from "recharts";

const Charts = ({data: Salesdata}: {data: {salesData: {month: string, totalSales: number}[]}}) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Salesdata.salesData} >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis stroke="#8884d8" dataKey="month" fontSize={12} tickLine={false} />
            <YAxis stroke="#8884d8" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSales" fill="currentColor"
             radius={[25, 25, 0, 0]} className="fill-primary" />
        </BarChart>
        </ResponsiveContainer>
    );
}
 
export default Charts;