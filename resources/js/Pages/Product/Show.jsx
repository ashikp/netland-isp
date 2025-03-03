import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from 'lucide-react';

export default function Show({ product }) {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Product Details</h1>
                        <div className="flex gap-2">
                            <Link href={route('admin.products.edit', product.id)}>
                                <Button variant="outline">
                                    Edit Product
                                </Button>
                            </Link>
                            <Link href={route('admin.products.index')}>
                                <Button variant="outline">
                                    Back to List
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Code</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{product.code}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{product.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{product.description || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Unit</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{product.unit}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            product.status === 'active' 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'bg-red-50 text-red-700'
                                        }`}>
                                            {product.status}
                                        </span>
                                    </dd>
                                </div>
                            </dl>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-lg font-semibold mb-4">Pricing & Stock Information</h2>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Purchase Price</dt>
                                    <dd className="mt-1 text-sm text-gray-900">${product.purchase_price}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Selling Price</dt>
                                    <dd className="mt-1 text-sm text-gray-900">${product.selling_price}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Minimum Stock Alert</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{product.min_stock_alert} {product.unit}</dd>
                                </div>
                                {product.inventory && (
                                    <>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Current Stock</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                <div className="flex items-center">
                                                    {product.inventory.quantity} {product.unit}
                                                    {product.inventory.quantity <= product.min_stock_alert && (
                                                        <div className="flex items-center text-amber-600 ml-2">
                                                            <AlertTriangle className="w-4 h-4 mr-1" />
                                                            Low Stock
                                                        </div>
                                                    )}
                                                </div>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Available Stock</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.inventory.available_quantity} {product.unit}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Reserved Stock</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.inventory.reserved_quantity} {product.unit}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Location</dt>
                                            <dd className="mt-1 text-sm text-gray-900">{product.inventory.location || '-'}</dd>
                                        </div>
                                    </>
                                )}
                            </dl>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 