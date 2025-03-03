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
import { PlusCircle, Pencil, Trash2, Eye } from 'lucide-react';
import { useToast } from "@/Components/ui/use-toast";
import { Toaster } from "@/Components/ui/toaster";

export default function Index({ suppliers }) {
    const { toast } = useToast();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Suppliers</h1>
                        <Link href={route('admin.suppliers.create')}>
                            <Button>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Supplier
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="px-4">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone Number</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead className="text-right">Credit Balance</TableHead>
                                    <TableHead className="text-right">Debit Balance</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suppliers.data.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="font-medium">{supplier.name}</TableCell>
                                        <TableCell>{supplier.phone_number}</TableCell>
                                        <TableCell>{supplier.address}</TableCell>
                                        <TableCell className="text-right text-emerald-600">
                                            +${supplier.credit_balance}
                                        </TableCell>
                                        <TableCell className="text-right text-red-600">
                                            -${supplier.debit_balance}
                                        </TableCell>
                                        <TableCell className={`text-right ${
                                            supplier.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                            ${supplier.balance}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                supplier.status === 'active' 
                                                    ? 'bg-green-50 text-green-700' 
                                                    : 'bg-red-50 text-red-700'
                                            }`}>
                                                {supplier.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.suppliers.show', supplier.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.suppliers.edit', supplier.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link 
                                                    href={route('admin.suppliers.destroy', supplier.id)} 
                                                    method="delete" 
                                                    onSuccess={() => {
                                                        toast({
                                                            title: "Success",
                                                            description: "Supplier deleted successfully",
                                                        });
                                                    }}
                                                >
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="w-4 h-4" />
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
        </AdminLayout>
    );
} 