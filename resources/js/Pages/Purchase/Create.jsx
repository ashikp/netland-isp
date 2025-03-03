import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function Create({ suppliers, products, nextPurchaseNumber }) {
    const { toast } = useToast();
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        invoice_number: nextPurchaseNumber,
        purchase_date: format(new Date(), 'yyyy-MM-dd'),
        due_date: format(new Date(), 'yyyy-MM-dd'),
        items: [],
        tax: 0,
        discount: 0,
        notes: '',
        status: 'pending',
        payment_status: 'unpaid'
    });

    const addItem = (product) => {
        setData('items', [
            ...data.items,
            {
                product_id: product.id,
                name: product.name,
                quantity: 1,
                unit_price: parseFloat(product.purchase_price),
                subtotal: parseFloat(product.purchase_price)
            }
        ]);
    };

    const removeItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...data.items];
        updatedItems[index][field] = value;
        
        // Recalculate subtotal
        if (field === 'quantity' || field === 'unit_price') {
            updatedItems[index].subtotal = 
                parseFloat(updatedItems[index].quantity) * 
                parseFloat(updatedItems[index].unit_price);
        }
        
        setData('items', updatedItems);
    };

    const calculateSubtotal = () => {
        return data.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const taxAmount = (subtotal * data.tax) / 100;
        return subtotal + taxAmount - parseFloat(data.discount);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.purchases.store'), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Purchase created successfully",
                });
            }
        });
    };

    const ProductSelector = ({ products, onSelect }) => {
        return (
            <div className="mb-6">
                <Label htmlFor="product">Products</Label>
                <Select onValueChange={(value) => {
                    const product = products.find(p => p.id === parseInt(value));
                    if (product) onSelect(product);
                }}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                        {products.map(product => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name} - ${product.purchase_price}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Create Purchase</h1>
                        <Link href={route('admin.purchases.index')}>
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </div>

                <div className="px-4">
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="supplier_id">Supplier</Label>
                                    <Select value={data.supplier_id} onValueChange={(value) => setData('supplier_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {suppliers.map(supplier => (
                                                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                                                    {supplier.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.supplier_id && <p className="text-sm text-red-600">{errors.supplier_id}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="invoice_number">Purchase Number</Label>
                                    <Input
                                        id="invoice_number"
                                        value={data.invoice_number}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="purchase_date">Purchase Date</Label>
                                    <Input
                                        type="date"
                                        id="purchase_date"
                                        value={data.purchase_date}
                                        onChange={e => setData('purchase_date', e.target.value)}
                                    />
                                    {errors.purchase_date && <p className="text-sm text-red-600">{errors.purchase_date}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        type="date"
                                        id="due_date"
                                        value={data.due_date}
                                        onChange={e => setData('due_date', e.target.value)}
                                    />
                                    {errors.due_date && <p className="text-sm text-red-600">{errors.due_date}</p>}
                                </div>
                            </div>

                            {/* Products Section */}
                            <div className="space-y-4">
                                <ProductSelector products={products} onSelect={addItem} />

                                {/* Items Table */}
                                <div className="border rounded-lg">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="px-4 py-2 text-left">Product</th>
                                                <th className="px-4 py-2 text-right">Quantity</th>
                                                <th className="px-4 py-2 text-right">Unit Price</th>
                                                <th className="px-4 py-2 text-right">Subtotal</th>
                                                <th className="px-4 py-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.items.map((item, index) => (
                                                <tr key={index} className="border-b">
                                                    <td className="px-4 py-2">{item.name}</td>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                            className="w-24"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.unit_price}
                                                            onChange={e => updateItem(index, 'unit_price', e.target.value)}
                                                            className="w-24"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        {item.subtotal?.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeItem(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Totals Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={e => setData('notes', e.target.value)}
                                    />
                                    {errors.notes && <p className="text-sm text-red-600">{errors.notes}</p>}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="tax">Tax (%)</Label>
                                        <Input
                                            type="number"
                                            id="tax"
                                            min="0"
                                            step="0.01"
                                            value={data.tax}
                                            onChange={e => setData('tax', e.target.value)}
                                        />
                                        {errors.tax && <p className="text-sm text-red-600">{errors.tax}</p>}
                                    </div>

                                    <div>
                                        <Label htmlFor="discount">Discount</Label>
                                        <Input
                                            type="number"
                                            id="discount"
                                            min="0"
                                            step="0.01"
                                            value={data.discount}
                                            onChange={e => setData('discount', e.target.value)}
                                        />
                                        {errors.discount && <p className="text-sm text-red-600">{errors.discount}</p>}
                                    </div>

                                    <div className="text-right space-y-2">
                                        <p>Subtotal: ${calculateSubtotal().toFixed(2)}</p>
                                        <p>Total: ${calculateTotal().toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing || data.items.length === 0}>
                                    Create Purchase
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