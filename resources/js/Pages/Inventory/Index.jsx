import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Index({ inventory }) {
    const { toast } = useToast();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Inventory</h1>
                    </div>
                </div>

                <div className="px-4">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product Code</TableHead>
                                    <TableHead>Product Name</TableHead>
                                    <TableHead className="text-right">Total Quantity</TableHead>
                                    <TableHead className="text-right">Available</TableHead>
                                    <TableHead className="text-right">Reserved</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inventory?.data?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.product.code}</TableCell>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell className="text-right">{item.quantity} {item.product.unit}</TableCell>
                                        <TableCell className="text-right">{item.available_quantity} {item.product.unit}</TableCell>
                                        <TableCell className="text-right">{item.reserved_quantity} {item.product.unit}</TableCell>
                                        <TableCell>{item.location || '-'}</TableCell>
                                        <TableCell>
                                            {item.quantity <= item.product.min_stock_alert && (
                                                <div className="flex items-center text-amber-600">
                                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                                    Low Stock
                                                </div>
                                            )}
                                            {item.quantity > item.product.min_stock_alert && (
                                                <span className="text-green-600">
                                                    In Stock
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>
            <Toaster />
        </AdminLayout>
    );
} 