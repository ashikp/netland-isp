import { useState } from 'react';
import { router } from '@inertiajs/react';
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
import { Switch } from "@/components/ui/switch";
import { useForm } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function RealIpIndex({ realIps }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingIp, setEditingIp] = useState(null);

    const form = useForm({
        ip_address: '',
        customer_cost: '',
        reseller_cost: '',
        is_used: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingIp) {
            router.put(route('admin.real-ips.update', editingIp.id), form.data, {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingIp(null);
                    form.reset();
                }
            });
        } else {
            router.post(route('admin.real-ips.store'), form.data, {
                onSuccess: () => {
                    setIsOpen(false);
                    form.reset();
                }
            });
        }
    };

    const handleEdit = (ip) => {
        setEditingIp(ip);
        form.setData({
            ip_address: ip.ip_address,
            customer_cost: ip.customer_cost,
            reseller_cost: ip.reseller_cost,
            is_used: ip.is_used,
        });
        setIsOpen(true);
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-6">
                <PageHeader title="Real IP Management">
                    <Dialog open={isOpen} onOpenChange={(open) => {
                        setIsOpen(open);
                        if (!open) {
                            setEditingIp(null);
                            form.reset();
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button>Add New IP</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingIp ? 'Edit Real IP' : 'Add New Real IP'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="ip_address">IP Address</Label>
                                    <Input
                                        id="ip_address"
                                        value={form.data.ip_address}
                                        onChange={e => form.setData('ip_address', e.target.value)}
                                        placeholder="192.168.1.1"
                                    />
                                    {form.errors.ip_address && (
                                        <p className="text-sm text-red-500 mt-1">{form.errors.ip_address}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="customer_cost">Customer Cost</Label>
                                    <Input
                                        id="customer_cost"
                                        type="number"
                                        step="0.01"
                                        value={form.data.customer_cost}
                                        onChange={e => form.setData('customer_cost', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {form.errors.customer_cost && (
                                        <p className="text-sm text-red-500 mt-1">{form.errors.customer_cost}</p>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="reseller_cost">Reseller Cost</Label>
                                    <Input
                                        id="reseller_cost"
                                        type="number"
                                        step="0.01"
                                        value={form.data.reseller_cost}
                                        onChange={e => form.setData('reseller_cost', e.target.value)}
                                        placeholder="0.00"
                                    />
                                    {form.errors.reseller_cost && (
                                        <p className="text-sm text-red-500 mt-1">{form.errors.reseller_cost}</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_used"
                                        checked={form.data.is_used}
                                        onCheckedChange={checked => form.setData('is_used', checked)}
                                    />
                                    <Label htmlFor="is_used">Is Used</Label>
                                </div>
                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={form.processing}
                                >
                                    {editingIp ? 'Update' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </PageHeader>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>IP Address</TableHead>
                                <TableHead>Customer Cost</TableHead>
                                <TableHead>Reseller Cost</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {realIps.data.map((ip) => (
                                <TableRow key={ip.id}>
                                    <TableCell>{ip.ip_address}</TableCell>
                                    <TableCell>${ip.customer_cost}</TableCell>
                                    <TableCell>${ip.reseller_cost}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            ip.is_used ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                            {ip.is_used ? 'Used' : 'Available'}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mr-2"
                                            onClick={() => handleEdit(ip)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => {
                                                if (confirm('Are you sure you want to delete this IP?')) {
                                                    router.delete(route('admin.real-ips.destroy', ip.id));
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
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