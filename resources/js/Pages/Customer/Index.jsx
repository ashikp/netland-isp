import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff, Copy } from "lucide-react";
import { format } from 'date-fns';
import PageHeader from '@/Components/PageHeader';
import { router } from '@inertiajs/react';


export default function CustomerIndex({ customers }) {
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const togglePasswordVisibility = (customerId) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [customerId]: !prev[customerId]
        }));
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could add a toast notification here
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Customers">
                        <Link href={route('admin.customers.create')}>
                            <Button>Add New Customer</Button>
                        </Link>
                    </PageHeader>

                    <Card className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Password</TableHead>
                                    <TableHead>Package</TableHead>
                                    <TableHead>Expires</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customers.data.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell>
                                            {customer.first_name} {customer.last_name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <span>{customer.username}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => copyToClipboard(customer.username)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <span>
                                                    {visiblePasswords[customer.id] 
                                                        ? customer.pppoe_password 
                                                        : '••••••••'}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => togglePasswordVisibility(customer.id)}
                                                >
                                                    {visiblePasswords[customer.id] ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => copyToClipboard(customer.pppoe_password)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {customer.package 
                                                ? `${customer.package.name} (${customer.package.subscription_type})`
                                                : 'No Package'}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(customer.expire_date), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Link href={route('admin.customers.edit', customer.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this customer?')) {
                                                            router.delete(route('admin.customers.destroy', customer.id));
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
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
} 