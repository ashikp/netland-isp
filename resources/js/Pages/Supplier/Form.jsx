import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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

export default function SupplierForm({ supplier, mode = 'create' }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: supplier?.name ?? '',
        phone_number: supplier?.phone_number ?? '',
        address: supplier?.address ?? '',
        credit_balance: supplier?.credit_balance ?? '0',
        debit_balance: supplier?.debit_balance ?? '0',
        status: supplier?.status ?? 'active',
    });

    function handleSubmit(e) {
        e.preventDefault();
        if (mode === 'create') {
            post(route('admin.suppliers.store'));
        } else {
            put(route('admin.suppliers.update', supplier.id));
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{mode === 'create' ? 'Create Supplier' : 'Update Supplier'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Vendor Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number">Phone Number</Label>
                            <Input
                                id="phone_number"
                                value={data.phone_number}
                                onChange={e => setData('phone_number', e.target.value)}
                            />
                            {errors.phone_number && (
                                <p className="text-sm text-red-600">{errors.phone_number}</p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                            />
                            {errors.address && (
                                <p className="text-sm text-red-600">{errors.address}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="credit_balance">Credit Balance</Label>
                            <Input
                                id="credit_balance"
                                type="number"
                                step="0.01"
                                value={data.credit_balance}
                                onChange={e => setData('credit_balance', e.target.value)}
                            />
                            {errors.credit_balance && (
                                <p className="text-sm text-red-600">{errors.credit_balance}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="debit_balance">Debit Balance</Label>
                            <Input
                                id="debit_balance"
                                type="number"
                                step="0.01"
                                value={data.debit_balance}
                                onChange={e => setData('debit_balance', e.target.value)}
                            />
                            {errors.debit_balance && (
                                <p className="text-sm text-red-600">{errors.debit_balance}</p>
                            )}
                        </div>

                        {mode === 'edit' && (
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={value => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-red-600">{errors.status}</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {mode === 'create' ? 'Create Supplier' : 'Update Supplier'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
} 