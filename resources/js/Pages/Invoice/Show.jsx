import { useState } from 'react';
import { router, Link, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import PageHeader from '@/Components/PageHeader';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AlertTriangle } from 'lucide-react';

const InvoiceShow = ({ invoice, payments, accounts }) => {
    const { toast } = useToast();
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        amount: invoice.balance_due.toString(),
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        payment_method: '',
        account_id: '',
        reference_number: '',
        notes: ''
    });

    const statusColors = {
        draft: 'bg-gray-500',
        sent: 'bg-blue-500',
        paid: 'bg-green-500',
        partially_paid: 'bg-yellow-500',
        overdue: 'bg-red-500',
        cancelled: 'bg-red-700'
    };

    const paymentMethods = [
        { id: 'cash', name: 'Cash' },
        { id: 'bank_transfer', name: 'Bank Transfer' },
        { id: 'check', name: 'Check' },
        { id: 'credit_card', name: 'Credit Card' }
    ];

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        router.post(route('admin.payments.store-invoice-payment', invoice.id), paymentForm, {
            onSuccess: () => {
                setIsPaymentDialogOpen(false);
                setPaymentForm({
                    amount: invoice.balance_due.toString(),
                    payment_date: format(new Date(), 'yyyy-MM-dd'),
                    payment_method: '',
                    account_id: '',
                    reference_number: '',
                    notes: ''
                });
            },
            onError: () => {
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    const handleSend = () => {
        router.post(route('admin.invoices.send', invoice.id), {}, {
            onSuccess: () => {
                toast({
                    title: "Success",
                    description: "Invoice has been sent and inventory updated.",
                });
            },
            onError: (errors) => {
                toast({
                    title: "Error",
                    description: errors.message || "Failed to send invoice.",
                    variant: "destructive"
                });
            }
        });
    };

    return (
        <AdminLayout>
            <Head title={`Invoice ${invoice.invoice_number}`} />
            
            <div className="max-w-7xl mx-auto py-6">
                <Card className="p-6">
                    {/* Header with Actions */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">Invoice #{invoice.invoice_number}</h2>
                            <Badge className={statusColors[invoice.status]}>
                                {invoice.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                        </div>
                        <div className="flex gap-2">
                            {invoice.status === 'draft' && (
                                <>
                                    <Button onClick={handleSend}>
                                        Send Invoice
                                    </Button>
                                    <Link href={route('admin.invoices.edit', invoice.id)}>
                                        <Button variant="outline">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this invoice?')) {
                                                router.delete(route('admin.invoices.destroy', invoice.id));
                                            }
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                            
                            {['sent', 'partially_paid'].includes(invoice.status) && (
                                <>
                                    <Button onClick={() => setIsPaymentDialogOpen(true)}>
                                        Record Payment
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to cancel this invoice?')) {
                                                router.post(route('admin.invoices.cancel', invoice.id));
                                            }
                                        }}
                                    >
                                        Cancel Invoice
                                    </Button>
                                </>
                            )}
                            
                            <Link href={route('admin.invoices.index')}>
                                <Button variant="outline">Back to List</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
                        <p>{invoice.customer.first_name} {invoice.customer.last_name}</p>
                        <p>{invoice.customer.email}</p>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-left">Item</th>
                                    <th className="px-4 py-3 text-left">Description</th>
                                    <th className="px-4 py-3 text-right">Qty</th>
                                    <th className="px-4 py-3 text-right">Unit Price</th>
                                    <th className="px-4 py-3 text-right">Tax</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {invoice.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                                                {item.details && (
                                                    <div className="text-xs text-gray-500">
                                                        {Object.entries(item.details).map(([key, value]) => (
                                                            value && <p key={key}>{key}: {value}</p>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{item.description}</td>
                                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right">${item.unit_price}</td>
                                        <td className="px-4 py-3 text-right">${item.tax}</td>
                                        <td className="px-4 py-3 text-right">${item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-8">
                        <div className="w-72">
                            <div className="flex justify-between py-2">
                                <span>Subtotal:</span>
                                <span>${invoice.subtotal}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span>Tax:</span>
                                <span>${invoice.tax}</span>
                            </div>
                            <div className="flex justify-between py-2 font-bold">
                                <span>Total:</span>
                                <span>${invoice.total}</span>
                            </div>
                            <div className="flex justify-between py-2 text-green-600">
                                <span>Amount Paid:</span>
                                <span>${invoice.amount_paid}</span>
                            </div>
                            <div className="flex justify-between py-2 text-red-600 font-bold">
                                <span>Balance Due:</span>
                                <span>${invoice.balance_due}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-2">Notes:</h3>
                            <p className="text-gray-600">{invoice.notes}</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Payment Dialog */}
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Record Payment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                max={invoice.balance_due}
                                value={paymentForm.amount}
                                onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Payment Method</label>
                            <Select
                                value={paymentForm.payment_method}
                                onValueChange={value => setPaymentForm({...paymentForm, payment_method: value})}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentMethods.map(method => (
                                        <SelectItem key={method.id} value={method.id}>
                                            {method.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Account</label>
                            <Select
                                value={paymentForm.account_id}
                                onValueChange={value => setPaymentForm({...paymentForm, account_id: value})}
                                required
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
                            <label>Payment Date</label>
                            <Input
                                type="date"
                                value={paymentForm.payment_date}
                                onChange={e => setPaymentForm({...paymentForm, payment_date: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label>Reference Number</label>
                            <Input
                                value={paymentForm.reference_number}
                                onChange={e => setPaymentForm({...paymentForm, reference_number: e.target.value})}
                            />
                        </div>
                        <div>
                            <label>Notes</label>
                            <Textarea
                                value={paymentForm.notes}
                                onChange={e => setPaymentForm({...paymentForm, notes: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPaymentDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                Record Payment
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default InvoiceShow; 