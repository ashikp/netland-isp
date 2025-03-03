import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function Show({ supplier }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        credit_amount: '',
        debit_amount: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('admin.suppliers.update-balance', supplier.id), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="px-4 py-6 bg-white shadow-sm">
                    <h1 className="text-2xl font-bold">Supplier Details</h1>
                </div>

                <div className="px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Supplier Info */}
                        <Card className="p-6 lg:col-span-2">
                            <h2 className="text-lg font-semibold mb-4">Supplier Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Vendor Name</p>
                                    <p className="font-medium">{supplier.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-medium">{supplier.phone_number}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="font-medium">{supplier.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        supplier.status === 'active' 
                                            ? 'bg-green-50 text-green-700' 
                                            : 'bg-red-50 text-red-700'
                                    }`}>
                                        {supplier.status}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        {/* Balance Info */}
                        <Card className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-lg font-semibold mb-4">Balance Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Credit Balance</p>
                                            <p className="text-lg font-semibold text-emerald-600">
                                                +${supplier.credit_balance}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Debit Balance</p>
                                            <p className="text-lg font-semibold text-red-600">
                                                -${supplier.debit_balance}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Net Balance</p>
                                            <p className={`text-lg font-semibold ${
                                                supplier.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                                            }`}>
                                                ${supplier.balance}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full">Update Balance</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Update Balance</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="credit_amount">Credit Amount</Label>
                                                <Input
                                                    id="credit_amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.credit_amount}
                                                    onChange={e => setData('credit_amount', e.target.value)}
                                                />
                                                {errors.credit_amount && (
                                                    <p className="text-sm text-red-600">{errors.credit_amount}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="debit_amount">Debit Amount</Label>
                                                <Input
                                                    id="debit_amount"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.debit_amount}
                                                    onChange={e => setData('debit_amount', e.target.value)}
                                                />
                                                {errors.debit_amount && (
                                                    <p className="text-sm text-red-600">{errors.debit_amount}</p>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={processing}>
                                                    Update Balance
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 