import { useState } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { PlusCircle, Trash2 } from 'lucide-react';

export default function Edit({ invoice, customers, products, packages, services }) {
    const { toast } = useToast();
    const { data, setData, put, processing, errors } = useForm({
        customer_id: invoice.customer_id,
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        notes: invoice.notes || '',
        tax: invoice.tax || 0,
        items: invoice.items.map(item => ({
            id: item.id,
            type: item.item_type,
            item_id: item.item_id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            tax: item.tax || 0,
            discount: item.discount || 0
        }))
    });

    const addItem = (type, item) => {
        setData('items', [
            ...data.items,
            {
                type: type,
                item_id: item.id,
                description: type === 'package' ? `${item.name} (${item.subscription_type})` : item.name,
                quantity: 1,
                unit_price: parseFloat(item.selling_price),
                tax: 0,
                discount: 0
            }
        ]);
    };

    const removeItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...data.items];
        updatedItems[index][field] = value;

        // If product is selected, update unit price
        if (field === 'item_id') {
            const product = products.find(p => p.id === parseInt(value));
            if (product) {
                updatedItems[index].unit_price = parseFloat(product.selling_price);
            }
        }

        setData('items', updatedItems);
    };

    const getProductStock = (productId, currentItemId = null) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) return 0;

        // Get the current item's quantity if it exists in the original invoice
        const originalItem = invoice.items.find(item => item.id === currentItemId);
        const originalQuantity = originalItem ? originalItem.quantity : 0;

        // Add back the original quantity to available stock for this item
        return product.available_quantity + originalQuantity;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.invoices.update', invoice.id), {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Invoice updated successfully",
                });
            }
        });
    };

    const calculateSubtotal = (item) => {
        return item.quantity * item.unit_price;
    };

    const calculateTotal = (item) => {
        const subtotal = calculateSubtotal(item);
        return subtotal + parseFloat(item.tax) - parseFloat(item.discount);
    };

    const calculateInvoiceTotal = () => {
        return data.items.reduce((sum, item) => sum + calculateTotal(item), 0);
    };

    return (
        <AdminLayout>
            <Head title="Edit Invoice" />
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">Edit Invoice</h1>
                            <p className="text-sm text-gray-500">Invoice #{invoice.invoice_number}</p>
                        </div>
                        <Link href={route('admin.invoices.show', invoice.id)}>
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
                                    <Label htmlFor="customer_id">Customer</Label>
                                    <select
                                        id="customer_id"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        value={data.customer_id}
                                        onChange={e => setData('customer_id', e.target.value)}
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.first_name} {customer.last_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <p className="text-sm text-red-600">{errors.customer_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="invoice_number">Invoice Number</Label>
                                    <Input
                                        id="invoice_number"
                                        value={invoice.invoice_number}
                                        disabled
                                        className="bg-gray-50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="issue_date">Issue Date</Label>
                                        <Input
                                            id="issue_date"
                                            type="date"
                                            value={data.issue_date}
                                            onChange={e => setData('issue_date', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="due_date">Due Date</Label>
                                        <Input
                                            id="due_date"
                                            type="date"
                                            value={data.due_date}
                                            onChange={e => setData('due_date', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <h3 className="font-medium mb-2">Add Package</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {packages.map(pkg => (
                                            <Button
                                                key={pkg.id}
                                                variant="outline"
                                                onClick={() => addItem('package', pkg)}
                                            >
                                                {pkg.name} - {pkg.subscription_type}
                                                <br />
                                                ${pkg.selling_price}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Add Service</h3>
                                    <div className="flex gap-2 flex-wrap">
                                        {services.map(service => (
                                            <Button
                                                key={service.id}
                                                variant="outline"
                                                onClick={() => addItem('service', service)}
                                            >
                                                {service.name} - ${service.selling_price}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">Add Product</h3>
                                    <Button onClick={() => addItem('product', { id: '', name: '', selling_price: 0 })}>
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Add Product
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {data.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-7 gap-4 items-start border-b pb-4">
                                        <div className="col-span-2 space-y-2">
                                            <Label>Item</Label>
                                            {item.type === 'product' ? (
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    value={item.item_id}
                                                    onChange={e => updateItem(index, 'item_id', e.target.value)}
                                                >
                                                    <option value="">Select Product</option>
                                                    {products.map(product => (
                                                        <option 
                                                            key={product.id} 
                                                            value={product.id}
                                                            disabled={getProductStock(product.id, item.id) <= 0}
                                                        >
                                                            {product.name} ({getProductStock(product.id, item.id)} {product.unit} available)
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <Input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={e => updateItem(index, 'description', e.target.value)}
                                                    readOnly
                                                />
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Quantity</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={item.quantity}
                                                onChange={e => updateItem(index, 'quantity', e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === '-' || e.key === '+' || e.key === 'e') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                            {errors[`items.${index}.quantity`] && (
                                                <p className="text-sm text-red-600">{errors[`items.${index}.quantity`]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Unit Price</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.unit_price}
                                                onChange={e => updateItem(index, 'unit_price', e.target.value)}
                                            />
                                            {errors[`items.${index}.unit_price`] && (
                                                <p className="text-sm text-red-600">{errors[`items.${index}.unit_price`]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Tax</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.tax}
                                                onChange={e => updateItem(index, 'tax', e.target.value)}
                                            />
                                            {errors[`items.${index}.tax`] && (
                                                <p className="text-sm text-red-600">{errors[`items.${index}.tax`]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Discount</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={item.discount}
                                                onChange={e => updateItem(index, 'discount', e.target.value)}
                                            />
                                            {errors[`items.${index}.discount`] && (
                                                <p className="text-sm text-red-600">{errors[`items.${index}.discount`]}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Total</Label>
                                            <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                                                ${calculateTotal(item).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="pt-8">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => removeItem(index)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {errors.items && <p className="text-sm text-red-600">{errors.items}</p>}

                                <div className="flex justify-end space-x-4 text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>${calculateInvoiceTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                />
                                {errors.notes && <p className="text-sm text-red-600">{errors.notes}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Total Tax</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.tax}
                                    onChange={e => setData('tax', e.target.value)}
                                />
                                {errors.tax && (
                                    <p className="text-sm text-red-600">{errors.tax}</p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    Update Invoice
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