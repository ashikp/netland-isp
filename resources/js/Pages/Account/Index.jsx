import { Link, Head } from '@inertiajs/react';
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
import { Badge } from "@/components/ui/badge";
import PageHeader from '@/Components/PageHeader';

export default function AccountIndex({ accounts }) {
    return (
        <AdminLayout>
            <Head title="Chart of Accounts" />
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Chart of Accounts">
                        <Link href={route('admin.accounts.create')}>
                            <Button>Add New Account</Button>
                        </Link>
                    </PageHeader>

                    <Card className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Account Number</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Balance</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accounts.data.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell>{account.account_number}</TableCell>
                                        <TableCell>{account.name}</TableCell>
                                        <TableCell className="capitalize">{account.type}</TableCell>
                                        <TableCell>${account.balance}</TableCell>
                                        <TableCell>
                                            <Badge variant={account.is_active ? 'success' : 'secondary'}>
                                                {account.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Link href={route('admin.accounts.edit', account.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this account?')) {
                                                            router.delete(route('admin.accounts.destroy', account.id));
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