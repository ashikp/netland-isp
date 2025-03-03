import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function Edit({ product }) {
    const { toast } = useToast();
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        code: product.code,
        description: product.description || '',
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        unit: product.unit,
        min_stock_alert: product.min_stock_alert,
        status: product.status
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.products.update', product.id), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Product updated successfully",
                });
            }
        });
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Edit Product</h1>
                        <Link href={route('admin.products.index')}>
                            <Button variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="px-4">
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        value={data.code}
                                        onChange={e => setData('code', e.target.value)}
                                    />
                                    {errors.code && <p className="text-sm text-red-600">{errors.code}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="purchase_price">Purchase Price</Label>
                                    <Input
                                        id="purchase_price"
                                        type="number"
                                        step="0.01"
                                        value={data.purchase_price}
                                        onChange={e => setData('purchase_price', e.target.value)}
                                    />
                                    {errors.purchase_price && <p className="text-sm text-red-600">{errors.purchase_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="selling_price">Selling Price</Label>
                                    <Input
                                        id="selling_price"
                                        type="number"
                                        step="0.01"
                                        value={data.selling_price}
                                        onChange={e => setData('selling_price', e.target.value)}
                                    />
                                    {errors.selling_price && <p className="text-sm text-red-600">{errors.selling_price}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input
                                        id="unit"
                                        value={data.unit}
                                        onChange={e => setData('unit', e.target.value)}
                                    />
                                    {errors.unit && <p className="text-sm text-red-600">{errors.unit}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="min_stock_alert">Minimum Stock Alert</Label>
                                    <Input
                                        id="min_stock_alert"
                                        type="number"
                                        value={data.min_stock_alert}
                                        onChange={e => setData('min_stock_alert', e.target.value)}
                                    />
                                    {errors.min_stock_alert && <p className="text-sm text-red-600">{errors.min_stock_alert}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                    />
                                    {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Update Product
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
            <Toaster />
        </AdminLayout>
    );
} 