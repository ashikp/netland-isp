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

export default function ExpenseForm({ expense, accounts, categories, onSubmit }) {
    const form = useForm({
        category: expense?.category ?? '',
        amount: expense?.amount ?? '',
        expense_date: expense?.expense_date ?? format(new Date(), 'yyyy-MM-dd'),
        payment_method: expense?.payment_method ?? '',
        account_id: expense?.transactions?.[0]?.account_id ?? '',
        reference_number: expense?.reference_number ?? '',
        description: expense?.description ?? '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Category
                            </label>
                            <Select
                                value={form.data.category}
                                onValueChange={value => form.setData('category', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(categories).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.errors.category && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.category}</p>
                            )}
                        </div>

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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Expense Date
                            </label>
                            <Input
                                type="date"
                                value={form.data.expense_date}
                                onChange={e => form.setData('expense_date', e.target.value)}
                            />
                            {form.errors.expense_date && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.expense_date}</p>
                            )}
                        </div>

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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                                            {account.name} (${account.balance})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.errors.account_id && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.account_id}</p>
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
                            Description
                        </label>
                        <Textarea
                            value={form.data.description}
                            onChange={e => form.setData('description', e.target.value)}
                            rows={4}
                        />
                        {form.errors.description && (
                            <p className="text-sm text-red-500 mt-1">{form.errors.description}</p>
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
                        {form.processing ? 'Saving...' : expense ? 'Update Expense' : 'Record Expense'}
                    </Button>
                </div>
            </Card>
        </form>
    );
} 