import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';

export default function InvoiceForm({ invoice, customers, packages, services, onSubmit }) {
    const [items, setItems] = useState(invoice?.items ?? []);

    const form = useForm({
        customer_id: invoice?.customer_id ?? '',
        issue_date: invoice?.issue_date ?? format(new Date(), 'yyyy-MM-dd'),
        due_date: invoice?.due_date ?? format(new Date(), 'yyyy-MM-dd'),
        items: invoice?.items ?? [],
        tax: invoice?.tax ?? 0,
        notes: invoice?.notes ?? '',
    });

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + parseFloat(form.data.tax || 0);
    };

    const addItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addPackageItem = (pkg) => {
        setItems([
            ...items,
            {
                description: pkg.name,
                quantity: 1,
                unit_price: pkg.package_cost
            }
        ]);
    };

    const addServiceItem = (service) => {
        setItems([
            ...items,
            {
                description: service.name,
                quantity: 1,
                unit_price: service.price
            }
        ]);
    };

    useEffect(() => {
        form.setData('items', items);
    }, [items]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Customer
                        </label>
                        <Select
                            value={form.data.customer_id}
                            onValueChange={value => form.setData('customer_id', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map(customer => (
                                    <SelectItem key={customer.id} value={customer.id.toString()}>
                                        {customer.first_name} {customer.last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.customer_id && (
                            <p className="text-sm text-red-500 mt-1">{form.errors.customer_id}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Issue Date
                            </label>
                            <Input
                                type="date"
                                value={form.data.issue_date}
                                onChange={e => form.setData('issue_date', e.target.value)}
                            />
                            {form.errors.issue_date && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.issue_date}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Due Date
                            </label>
                            <Input
                                type="date"
                                value={form.data.due_date}
                                onChange={e => form.setData('due_date', e.target.value)}
                            />
                            {form.errors.due_date && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.due_date}</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Items</h3>
                        <div className="space-x-2">
                            <Select onValueChange={value => {
                                const pkg = packages.find(p => p.id.toString() === value);
                                if (pkg) addPackageItem(pkg);
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Add package" />
                                </SelectTrigger>
                                <SelectContent>
                                    {packages.map(pkg => (
                                        <SelectItem key={pkg.id} value={pkg.id.toString()}>
                                            {pkg.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select onValueChange={value => {
                                const service = services.find(s => s.id.toString() === value);
                                if (service) addServiceItem(service);
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Add service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map(service => (
                                        <SelectItem key={service.id} value={service.id.toString()}>
                                            {service.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Button type="button" onClick={addItem}>
                                Add Custom Item
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={e => updateItem(index, 'description', e.target.value)}
                                    />
                                </div>
                                <div className="w-24">
                                    <Input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="Quantity"
                                        value={item.quantity}
                                        onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="w-32">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Unit Price"
                                        value={item.unit_price}
                                        onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="w-32 pt-2">
                                    ${(item.quantity * item.unit_price).toFixed(2)}
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeItem(index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-4 items-center">
                        <span className="font-medium">Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-end space-x-4 items-center">
                        <span className="font-medium">Tax:</span>
                        <div className="w-32">
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.data.tax}
                                onChange={e => form.setData('tax', parseFloat(e.target.value || 0))}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 items-center">
                        <span className="font-medium">Total:</span>
                        <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Notes
                        </label>
                        <Textarea
                            value={form.data.notes}
                            onChange={e => form.setData('notes', e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={form.processing}
                    >
                        {form.processing ? 'Saving...' : 'Save Invoice'}
                    </Button>
                </div>
            </Card>
        </form>
    );
} 