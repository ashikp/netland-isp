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

export default function NasIndex({ nas }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingNas, setEditingNas] = useState(null);

    const form = useForm({
        name: '',
        ip_address: '',
        secret_key: '',
        router_type: 'mikrotik',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingNas) {
            form.put(route('admin.nas.update', editingNas.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingNas(null);
                    form.reset();
                },
                preserveScroll: true,
                onError: (errors) => {
                    console.error('Update errors:', errors);
                }
            });
        } else {
            form.post(route('admin.nas.store'), {
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
                <PageHeader title="NAS Management">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                setEditingNas(null);
                                form.reset();
                            }}>
                                Add New NAS
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingNas ? 'Edit NAS' : 'Add New NAS'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">NAS Name</Label>
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
                                    <Label htmlFor="ip_address">IP Address</Label>
                                    <Input
                                        id="ip_address"
                                        value={form.data.ip_address}
                                        onChange={e => form.setData('ip_address', e.target.value)}
                                    />
                                    {form.errors.ip_address && (
                                        <p className="text-sm text-red-500">{form.errors.ip_address}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="secret_key">Secret Key</Label>
                                    <Input
                                        id="secret_key"
                                        type="password"
                                        value={form.data.secret_key}
                                        onChange={e => form.setData('secret_key', e.target.value)}
                                    />
                                    {form.errors.secret_key && (
                                        <p className="text-sm text-red-500">{form.errors.secret_key}</p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full">
                                    {editingNas ? 'Update' : 'Create'}
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
                                <TableHead>IP Address</TableHead>
                                <TableHead>Secret Key</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {nas.data.map((nas) => (
                                <TableRow key={nas.id}>
                                    <TableCell>{nas.name}</TableCell>
                                    <TableCell>{nas.ip_address}</TableCell>
                                    <TableCell>{nas.secret_key}</TableCell>
                                    <TableCell>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingNas(nas);
                                                    form.setData({
                                                        name: nas.name,
                                                        ip_address: nas.ip_address,
                                                        secret_key: nas.secret_key,
                                                        router_type: nas.router_type || 'mikrotik',
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
                                                    if (confirm('Are you sure you want to delete this NAS?')) {
                                                        router.delete(route('admin.nas.destroy', nas.id), {
                                                            onSuccess: () => {
                                                                // Optional: Add success notification
                                                            },
                                                            onError: (errors) => {
                                                                console.error('Delete errors:', errors);
                                                            }
                                                        });
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
