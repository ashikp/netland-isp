import { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHeader from '@/Components/PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PackageIndex({ packages }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);

    const form = useForm({
        name: '',
        ip_pool_name: '',
        subscription_type: '',
        package_cost: '',
        reseller_package_cost: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingPackage) {
            form.put(route('admin.packages.update', editingPackage.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingPackage(null);
                    form.reset();
                }
            });
        } else {
            form.post(route('admin.packages.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    form.reset();
                }
            });
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                <PageHeader title="Package Management">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setEditingPackage(null);
                                form.reset();
                            }}>
                                Add New Package
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingPackage ? 'Edit Package' : 'Add New Package'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Package Name</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={e => form.setData('name', e.target.value)}
                                    />
                                    {form.errors.name && (
                                        <p className="text-sm text-red-500">{form.errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="ip_pool_name">IP Pool Name</Label>
                                    <Input
                                        id="ip_pool_name"
                                        value={form.data.ip_pool_name}
                                        onChange={e => form.setData('ip_pool_name', e.target.value)}
                                    />
                                    {form.errors.ip_pool_name && (
                                        <p className="text-sm text-red-500">{form.errors.ip_pool_name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="subscription_type">Subscription Type</Label>
                                    <Select
                                        value={form.data.subscription_type}
                                        onValueChange={(value) => form.setData('subscription_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subscription type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {form.errors.subscription_type && (
                                        <p className="text-sm text-red-500">{form.errors.subscription_type}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="package_cost">Package Cost</Label>
                                    <Input
                                        id="package_cost"
                                        type="number"
                                        step="0.01"
                                        value={form.data.package_cost}
                                        onChange={e => form.setData('package_cost', e.target.value)}
                                    />
                                    {form.errors.package_cost && (
                                        <p className="text-sm text-red-500">{form.errors.package_cost}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="reseller_package_cost">Reseller Package Cost</Label>
                                    <Input
                                        id="reseller_package_cost"
                                        type="number"
                                        step="0.01"
                                        value={form.data.reseller_package_cost}
                                        onChange={e => form.setData('reseller_package_cost', e.target.value)}
                                    />
                                    {form.errors.reseller_package_cost && (
                                        <p className="text-sm text-red-500">{form.errors.reseller_package_cost}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full">
                                    {editingPackage ? 'Update' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </PageHeader>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>IP Pool</TableHead>
                                <TableHead>Package Cost</TableHead>
                                <TableHead>Reseller Cost</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {packages.data.map((pkg) => (
                                <TableRow key={pkg.id}>
                                    <TableCell>{pkg.name}</TableCell>
                                    <TableCell>{pkg.ip_pool_name}</TableCell>
                                    <TableCell>${pkg.package_cost}</TableCell>
                                    <TableCell>${pkg.reseller_package_cost}</TableCell>
                                    <TableCell className="capitalize">{pkg.subscription_type}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingPackage(pkg);
                                                    form.setData({
                                                        name: pkg.name,
                                                        ip_pool_name: pkg.ip_pool_name,
                                                        subscription_type: pkg.subscription_type,
                                                        package_cost: pkg.package_cost,
                                                        reseller_package_cost: pkg.reseller_package_cost
                                                    });
                                                    setIsOpen(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this package?')) {
                                                        router.delete(route('admin.packages.destroy', pkg.id));
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminLayout>
    );
} 