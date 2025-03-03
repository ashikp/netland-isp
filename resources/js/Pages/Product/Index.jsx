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
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Index({ products }) {
    const { toast } = useToast();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Products</h1>
                        <Link href={route('admin.products.create')}>
                            <Button>
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Product
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="px-4">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead className="text-right">Purchase Price</TableHead>
                                    <TableHead className="text-right">Selling Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products?.data?.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.code}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.unit}</TableCell>
                                        <TableCell className="text-right">
                                            ${product.purchase_price}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ${product.selling_price}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                product.status === 'active' 
                                                    ? 'bg-green-50 text-green-700' 
                                                    : 'bg-red-50 text-red-700'
                                            }`}>
                                                {product.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('admin.products.show', product.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.products.edit', product.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link 
                                                    href={route('admin.products.destroy', product.id)} 
                                                    method="delete" 
                                                    onSuccess={() => {
                                                        toast({
                                                            title: "Success",
                                                            description: "Product deleted successfully",
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
            <Toaster />
        </AdminLayout>
    );
} 