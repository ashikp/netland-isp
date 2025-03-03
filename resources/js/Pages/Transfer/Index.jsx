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
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import PageHeader from '@/Components/PageHeader';
import { router } from '@inertiajs/react';

export default function TransferIndex({ transfers }) {
    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Transfers">
                        <Link href={route('admin.transfers.create')}>
                            <Button>New Transfer</Button>
                        </Link>
                    </PageHeader>

                    <Card className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Transfer Number</TableHead>
                                    <TableHead>From Account</TableHead>
                                    <TableHead>To Account</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transfers.data.map((transfer) => (
                                    <TableRow key={transfer.id}>
                                        <TableCell>{transfer.transfer_number}</TableCell>
                                        <TableCell>{transfer.from_account.name}</TableCell>
                                        <TableCell>{transfer.to_account.name}</TableCell>
                                        <TableCell>${transfer.amount}</TableCell>
                                        <TableCell>
                                            {format(new Date(transfer.transfer_date), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={transfer.status === 'completed' ? 'success' : 'destructive'}
                                            >
                                                {transfer.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Link href={route('admin.transfers.show', transfer.id)}>
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                                {transfer.status === 'completed' && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to cancel this transfer?')) {
                                                                router.post(route('admin.transfers.cancel', transfer.id));
                                                            }
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                )}
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