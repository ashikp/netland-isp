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

export default function ExpenseIndex({ expenses, categories }) {
    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Expenses">
                        <Link href={route('admin.expenses.create')}>
                            <Button>Record New Expense</Button>
                        </Link>
                    </PageHeader>

                    <Card className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Expense Number</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Payment Method</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.data.map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell>{expense.expense_number}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {categories[expense.category]}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>${expense.amount}</TableCell>
                                        <TableCell>
                                            {format(new Date(expense.expense_date), 'MMM dd, yyyy')}
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {expense.payment_method.replace('_', ' ')}
                                        </TableCell>
                                        <TableCell>
                                            {expense.transactions[0]?.account.name}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Link href={route('admin.expenses.show', expense.id)}>
                                                    <Button variant="outline" size="sm">
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link href={route('admin.expenses.edit', expense.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this expense?')) {
                                                            router.delete(route('admin.expenses.destroy', expense.id));
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