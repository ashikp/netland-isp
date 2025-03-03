import { useState } from 'react';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
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
import CreatePayment from './CreatePayment';
import PageHeader from '@/Components/PageHeader';

export default function Index({ payments, customers, invoices, accounts }) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'destructive';
            default: return 'secondary';
        }
    };

    const PaymentRow = ({ payment }) => {
        const entity = payment.type === 'supplier' ? payment.supplier : payment.customer;
        const reference = payment.type === 'supplier' ? payment.purchase?.invoice_number : payment.invoice?.invoice_number;
        
        return (
            <TableRow>
                <TableCell>{payment.payment_number}</TableCell>
                <TableCell>{entity?.name}</TableCell>
                <TableCell>{reference}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>
                    {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                    {payment.payment_method.replace('_', ' ').toUpperCase()}
                </TableCell>
                <TableCell>
                    <Badge variant={getStatusBadgeVariant(payment.status)}>
                        {payment.status.toUpperCase()}
                    </Badge>
                </TableCell>
                <TableCell>{payment.account.name}</TableCell>
                <TableCell>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit(route('admin.payments.show', payment.id))}
                        >
                            View
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        );
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Payments">
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            Create Payment
                        </Button>
                    </PageHeader>

                    <Card className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Payment Number</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Invoice</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.data.map((payment) => (
                                    <PaymentRow key={payment.id} payment={payment} />
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </div>

            <CreatePayment
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                customers={customers}
                invoices={invoices}
                accounts={accounts}
            />
        </AdminLayout>
    );
} 