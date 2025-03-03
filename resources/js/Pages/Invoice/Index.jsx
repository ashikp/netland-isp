import { Link, router, Head } from '@inertiajs/react';
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
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import PageHeader from '@/Components/PageHeader';

export default function InvoiceIndex({ invoices }) {
    const getStatusBadgeVariant = (status) => {
        const variants = {
            draft: 'secondary',
            sent: 'primary',
            paid: 'success',
            partially_paid: 'warning',
            overdue: 'destructive',
            cancelled: 'outline'
        };
        return variants[status] || 'secondary';
    };

    return (
        <AdminLayout>
            <Head title="Invoices" />
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Invoices">
                        <Link href={route('admin.invoices.create')}>
                            <Button>Create New Invoice</Button>
                        </Link>
                    </PageHeader>

                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice Number</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Due Date</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Balance Due</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices.data.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>{invoice.invoice_number}</TableCell>
                                        <TableCell>
                                            {invoice.customer.first_name} {invoice.customer.last_name}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(invoice.issue_date), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            {format(new Date(invoice.due_date), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell>${invoice.total}</TableCell>
                                        <TableCell>${invoice.balance_due}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(invoice.status)}>
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link href={route('admin.invoices.show', invoice.id)}>
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                                {invoice.status === 'draft' && (
                                                    <>
                                                        <Link href={route('admin.invoices.edit', invoice.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this invoice?')) {
                                                                    router.delete(route('admin.invoices.destroy', invoice.id));
                                                                }
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 