import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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

export default function Show({ purchase, accounts = [] }) {
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        purchase_id: purchase.id,
        account_id: '',
        amount: purchase.balance_due?.toString() || purchase.total.toString(),
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        payment_method: '',
        reference_number: '',
        notes: ''
    });

    const handleSubmitPayment = (e) => {
        e.preventDefault();
        router.post(route('admin.purchases.payments.store', purchase.id), paymentForm, {
            onSuccess: () => {
                setShowPaymentDialog(false);
                router.reload();
            }
        });
    };

    const formatNumber = (value) => {
        const number = parseFloat(value);
        return isNaN(number) ? '0.00' : number.toFixed(2);
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center px-4">
                    <h2 className="text-2xl font-bold tracking-tight">Purchase Details</h2>
                    <div className="space-x-2">
                        <Link href={route('admin.purchases.invoice', purchase.id)}>
                            <Button variant="outline">View Invoice</Button>
                        </Link>
                        <Button onClick={() => setShowPaymentDialog(true)}>
                            Record Payment
                        </Button>
                        <Link href={route('admin.purchases.edit', purchase.id)}>
                            <Button>Edit Purchase</Button>
                        </Link>
                    </div>
                </div>

                <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Supplier Details</h3>
                            <p className="text-gray-700">{purchase.supplier.name}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Purchase Info</h3>
                            <div className="text-gray-700">
                                <p>Purchase Number: {purchase.invoice_number}</p>
                                <p>Date: {format(new Date(purchase.purchase_date), 'PPP')}</p>
                                <p>Due Date: {format(new Date(purchase.due_date), 'PPP')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Items</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Product</th>
                                        <th className="text-center py-3 px-4">Quantity</th>
                                        <th className="text-right py-3 px-4">Unit Price</th>
                                        <th className="text-right py-3 px-4">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchase.items.map((item, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-3 px-4">{item.product.name}</td>
                                            <td className="text-center py-3 px-4">{item.quantity}</td>
                                            <td className="text-right py-3 px-4">${formatNumber(item.unit_price)}</td>
                                            <td className="text-right py-3 px-4">${formatNumber(item.subtotal)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <div className="w-72 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>${formatNumber(purchase.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Tax:</span>
                                <span>${formatNumber(purchase.tax)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Discount:</span>
                                <span>${formatNumber(purchase.discount)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t pt-3">
                                <span>Total:</span>
                                <span>${formatNumber(purchase.total)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Record Payment</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmitPayment} className="space-y-4">
                            <div>
                                <Label htmlFor="account_id">Account</Label>
                                <Select
                                    value={paymentForm.account_id}
                                    onValueChange={(value) => setPaymentForm({...paymentForm, account_id: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.map(account => (
                                            <SelectItem key={account.id} value={account.id.toString()}>
                                                {account.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={paymentForm.amount}
                                    onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                                />
                            </div>

                            <div>
                                <Label htmlFor="payment_method">Payment Method</Label>
                                <Select
                                    value={paymentForm.payment_method}
                                    onValueChange={(value) => setPaymentForm({...paymentForm, payment_method: value})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select payment method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="check">Check</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="payment_date">Payment Date</Label>
                                <Input
                                    type="date"
                                    value={paymentForm.payment_date}
                                    onChange={e => setPaymentForm({...paymentForm, payment_date: e.target.value})}
                                />
                            </div>

                            <div>
                                <Label htmlFor="reference_number">Reference Number</Label>
                                <Input
                                    value={paymentForm.reference_number}
                                    onChange={e => setPaymentForm({...paymentForm, reference_number: e.target.value})}
                                />
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    value={paymentForm.notes}
                                    onChange={e => setPaymentForm({...paymentForm, notes: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit">Record Payment</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
} 