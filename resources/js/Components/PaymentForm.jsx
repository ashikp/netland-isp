import { useForm } from '@inertiajs/react';
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

export default function PaymentForm({ payment, customers, invoices, accounts, onSubmit }) {
    const form = useForm({
        customer_id: payment?.customer_id ?? '',
        invoice_id: payment?.invoice_id ?? '',
        account_id: payment?.account_id ?? '',
        amount: payment?.amount ?? '',
        payment_date: payment?.payment_date ?? format(new Date(), 'yyyy-MM-dd'),
        payment_method: payment?.payment_method ?? '',
        reference_number: payment?.reference_number ?? '',
        notes: payment?.notes ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    // Filter invoices based on selected customer
    const customerInvoices = invoices.filter(
        invoice => invoice.customer_id.toString() === form.data.customer_id
    );

    // Get selected invoice details
    const selectedInvoice = form.data.invoice_id
        ? invoices.find(invoice => invoice.id.toString() === form.data.invoice_id)
        : null;

    // Get selected customer details
    const selectedCustomer = form.data.customer_id
        ? customers.find(customer => customer.id.toString() === form.data.customer_id)
        : null;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Customer
                        </label>
                        <Select
                            value={form.data.customer_id}
                            onValueChange={value => {
                                form.setData('customer_id', value);
                                form.setData('invoice_id', '');
                            }}
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
                        {selectedCustomer && (
                            <p className="text-sm text-gray-500 mt-1">
                                Current Balance: ${selectedCustomer.balance}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Invoice (Optional)
                        </label>
                        <Select
                            value={form.data.invoice_id}
                            onValueChange={value => form.setData('invoice_id', value)}
                            disabled={!form.data.customer_id}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select invoice" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">No Invoice (Direct Payment)</SelectItem>
                                {customerInvoices.map(invoice => (
                                    <SelectItem key={invoice.id} value={invoice.id.toString()}>
                                        {invoice.invoice_number} - ${invoice.balance_due}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.invoice_id && (
                            <p className="text-sm text-red-500 mt-1">{form.errors.invoice_id}</p>
                        )}
                        {selectedInvoice && (
                            <div className="text-sm text-gray-500 mt-1">
                                <p>Total Amount: ${selectedInvoice.total}</p>
                                <p>Balance Due: ${selectedInvoice.balance_due}</p>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Account
                        </label>
                        <Select
                            value={form.data.account_id}
                            onValueChange={value => form.setData('account_id', value)}
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
                        {form.errors.account_id && (
                            <p className="text-sm text-red-500 mt-1">{form.errors.account_id}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Amount
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={form.data.amount}
                                onChange={e => form.setData('amount', e.target.value)}
                            />
                            {form.errors.amount && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.amount}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Payment Date
                            </label>
                            <Input
                                type="date"
                                value={form.data.payment_date}
                                onChange={e => form.setData('payment_date', e.target.value)}
                            />
                            {form.errors.payment_date && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.payment_date}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Payment Method
                            </label>
                            <Select
                                value={form.data.payment_method}
                                onValueChange={value => form.setData('payment_method', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                    <SelectItem value="mobile_banking">Mobile Banking</SelectItem>
                                </SelectContent>
                            </Select>
                            {form.errors.payment_method && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.payment_method}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Reference Number
                            </label>
                            <Input
                                type="text"
                                value={form.data.reference_number}
                                onChange={e => form.setData('reference_number', e.target.value)}
                            />
                            {form.errors.reference_number && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.reference_number}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Notes
                        </label>
                        <Textarea
                            value={form.data.notes}
                            onChange={e => form.setData('notes', e.target.value)}
                            rows={4}
                        />
                        {form.errors.notes && (
                            <p className="text-sm text-red-500 mt-1">{form.errors.notes}</p>
                        )}
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={form.processing}
                    >
                        {form.processing ? 'Processing...' : 'Record Payment'}
                    </Button>
                </div>
            </Card>
        </form>
    );
} 