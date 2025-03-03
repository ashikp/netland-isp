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

export default function TransferForm({ transfer, accounts, onSubmit }) {
    const form = useForm({
        from_account_id: transfer?.from_account_id ?? '',
        to_account_id: transfer?.to_account_id ?? '',
        amount: transfer?.amount ?? '',
        transfer_date: transfer?.transfer_date ?? format(new Date(), 'yyyy-MM-dd'),
        reference_number: transfer?.reference_number ?? '',
        description: transfer?.description ?? '',
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
                                From Account
                            </label>
                            <Select
                                value={form.data.from_account_id}
                                onValueChange={value => form.setData('from_account_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select source account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map(account => (
                                        <SelectItem key={account.id} value={account.id.toString()}>
                                            {account.name} (${account.balance})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.errors.from_account_id && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.from_account_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                To Account
                            </label>
                            <Select
                                value={form.data.to_account_id}
                                onValueChange={value => form.setData('to_account_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select destination account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map(account => (
                                        <SelectItem key={account.id} value={account.id.toString()}>
                                            {account.name} (${account.balance})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.errors.to_account_id && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.to_account_id}</p>
                            )}
                        </div>
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
                                Transfer Date
                            </label>
                            <Input
                                type="date"
                                value={form.data.transfer_date}
                                onChange={e => form.setData('transfer_date', e.target.value)}
                            />
                            {form.errors.transfer_date && (
                                <p className="text-sm text-red-500 mt-1">{form.errors.transfer_date}</p>
                            )}
                        </div>
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
                        {form.processing ? 'Processing...' : 'Process Transfer'}
                    </Button>
                </div>
            </Card>
        </form>
    );
} 