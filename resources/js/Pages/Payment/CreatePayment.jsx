import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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

export default function CreatePayment({ isOpen, onClose, customers, invoices, accounts }) {
    const [processing, setProcessing] = useState(false);
    const [form, setForm] = useState({
        customer_id: '',
        invoice_id: '',
        account_id: '',
        amount: '',
        payment_date: format(new Date(), 'yyyy-MM-dd'),
        payment_method: '',
        reference_number: '',
        notes: ''
    });

    // Get available invoices for selected customer
    const availableInvoices = form.customer_id
        ? invoices.filter(
            invoice => 
                invoice.customer_id === parseInt(form.customer_id) && 
                invoice.balance_due > 0
          )
        : [];

    // Handle customer selection
    const handleCustomerChange = (value) => {
        setForm(prev => ({
            ...prev,
            customer_id: value,
            invoice_id: '', // Reset invoice selection
            amount: '' // Reset amount
        }));
    };

    // Handle invoice selection
    const handleInvoiceChange = (value) => {
        const selectedInvoice = invoices.find(inv => inv.id === parseInt(value));
        setForm(prev => ({
            ...prev,
            invoice_id: value,
            amount: selectedInvoice ? selectedInvoice.balance_due.toString() : ''
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route('payments.store'), form, {
            onSuccess: () => {
                onClose();
                // Reset form
                setForm({
                    customer_id: '',
                    invoice_id: '',
                    account_id: '',
                    amount: '',
                    payment_date: format(new Date(), 'yyyy-MM-dd'),
                    payment_method: '',
                    reference_number: '',
                    notes: ''
                });
            },
            onError: () => setProcessing(false),
            onFinish: () => setProcessing(false)
        });
    };

    // Debug logging
    console.log('Customers:', customers);
    console.log('Available Invoices:', availableInvoices);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Payment</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Customer Selection */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Customer
                        </label>
                        <Select
                            value={form.customer_id}
                            onValueChange={handleCustomerChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers?.map((customer) => (
                                    <SelectItem 
                                        key={customer.id} 
                                        value={customer.id.toString()}
                                    >
                                        {customer.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Invoice Selection - Only show if customer is selected */}
                    {form.customer_id && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                Invoice
                            </label>
                            <Select
                                value={form.invoice_id}
                                onValueChange={handleInvoiceChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an invoice" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableInvoices.map((invoice) => (
                                        <SelectItem 
                                            key={invoice.id} 
                                            value={invoice.id.toString()}
                                        >
                                            {invoice.invoice_number} - Balance: ${invoice.balance_due}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Amount */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Amount
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={form.amount}
                            onChange={e => setForm({ ...form, amount: e.target.value })}
                            required
                        />
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Payment Method
                        </label>
                        <Select
                            value={form.payment_method}
                            onValueChange={value => setForm({ ...form, payment_method: value })}
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
                    </div>

                    {/* Account */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Account
                        </label>
                        <Select
                            value={form.account_id}
                            onValueChange={value => setForm({ ...form, account_id: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts?.map((account) => (
                                    <SelectItem 
                                        key={account.id} 
                                        value={account.id.toString()}
                                    >
                                        {account.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Payment Date */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Payment Date
                        </label>
                        <Input
                            type="date"
                            value={form.payment_date}
                            onChange={e => setForm({ ...form, payment_date: e.target.value })}
                            required
                        />
                    </div>

                    {/* Reference Number */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Reference Number
                        </label>
                        <Input
                            type="text"
                            value={form.reference_number}
                            onChange={e => setForm({ ...form, reference_number: e.target.value })}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Notes
                        </label>
                        <Textarea
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                            rows={3}
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Creating...' : 'Create Payment'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 