import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { PlusCircle, Pencil, Trash2, Eye, FileText } from 'lucide-react';
import { useToast } from "@/Components/ui/use-toast";
import { Toaster } from "@/Components/ui/toaster";

export default function Index({ purchases }) {
    const { toast } = useToast();

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700';
            case 'received':
                return 'bg-green-50 text-green-700';
            case 'cancelled':
                return 'bg-red-50 text-red-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-50 text-green-700';
            case 'partial':
                return 'bg-yellow-50 text-yellow-700';
            case 'unpaid':
                return 'bg-red-50 text-red-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Purchases</h1>
                        <Link href={route('admin.purchases.create')}>
                            <Button>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                New Purchase
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="px-4">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Purchase Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Due Amount</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {purchases?.data?.map((purchase) => (
                                    <TableRow key={purchase.id}>
                                        <TableCell className="font-medium">{purchase.invoice_number}</TableCell>
                                        <TableCell>{purchase.supplier.name}</TableCell>
                                        <TableCell>{purchase.purchase_date}</TableCell>
                                        <TableCell>{purchase.due_date}</TableCell>
                                        <TableCell className="text-right">${purchase.total}</TableCell>
                                        <TableCell className="text-right">${purchase.due_amount}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(purchase.payment_status)}`}>
                                                {purchase.payment_status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(purchase.status)}`}>
                                                {purchase.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.purchases.show', purchase.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                {purchase.status === 'pending' && (
                                                    <>
                                                        <Link href={route('admin.purchases.edit', purchase.id)}>
                                                            <Button variant="ghost" size="icon">
                                                                <Pencil className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link 
                                                            href={route('admin.purchases.destroy', purchase.id)} 
                                                            method="delete" 
                                                            onSuccess={() => {
                                                                toast({
                                                                    title: "Success",
                                                                    description: "Purchase deleted successfully",
                                                                });
                                                            }}
                                                        >
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </>
                                                )}
                                                <Link href={route('admin.purchases.invoice', purchase.id)} target="_blank">
                                                    <Button variant="ghost" size="icon">
                                                        <FileText className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            </div>
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