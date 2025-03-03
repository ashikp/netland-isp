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
import { Switch } from "@/components/ui/switch";

export default function AccountForm({ account, onSubmit }) {
    const form = useForm({
        name: account?.name ?? '',
        account_number: account?.account_number ?? '',
        type: account?.type ?? '',
        description: account?.description ?? '',
        is_active: account?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    const accountTypes = [
        { value: 'asset', label: 'Asset' },
        { value: 'liability', label: 'Liability' },
        { value: 'equity', label: 'Equity' },
        { value: 'income', label: 'Income' },
        { value: 'expense', label: 'Expense' },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Account Name
                        </label>
                        <Input
                            type="text"
                            value={form.data.name}
                            onChange={e => form.setData('name', e.target.value)}
                        />
                        {form.errors.name && (
                            <p className="text-sm text-red-500 mt-1">{form.errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Account Number
                        </label>
                        <Input
                            type="text"
                            value={form.data.account_number}
                            onChange={e => form.setData('account_number', e.target.value)}
                        />
                        {form.errors.account_number && (
                            <p className="text-sm text-red-500 mt-1">{form.errors.account_number}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Account Type
                        </label>
                        <Select
                            value={form.data.type}
                            onValueChange={value => form.setData('type', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                                {accountTypes.map(type => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.type && (
                            <p className="text-sm text-red-500 mt-1">{form.errors.type}</p>
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

                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={form.data.is_active}
                            onCheckedChange={checked => form.setData('is_active', checked)}
                        />
                        <label className="text-sm font-medium">Active Account</label>
                    </div>
                </div>
            </Card>

            <Card className="p-6">
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={form.processing}
                    >
                        {form.processing ? 'Saving...' : 'Save Account'}
                    </Button>
                </div>
            </Card>
        </form>
    );
} 