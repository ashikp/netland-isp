import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import PageHeader from '@/Components/PageHeader';

export default function ExpenseShow({ expense, categories }) {
    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Expense Details">
                        <div className="flex items-center space-x-2">
                            <Link href={route('admin.expenses.edit', expense.id)}>
                                <Button variant="outline">Edit Expense</Button>
                            </Link>
                            <Link href={route('admin.expenses.index')}>
                                <Button variant="outline">Back to List</Button>
                            </Link>
                        </div>
                    </PageHeader>

                    <div className="grid grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Expense Number</dt>
                                    <dd className="mt-1">{expense.expense_number}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                                    <dd className="mt-1">
                                        <Badge variant="outline">
                                            {categories[expense.category]}
                                        </Badge>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Amount</dt>
                                    <dd className="mt-1">${expense.amount}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Expense Date</dt>
                                    <dd className="mt-1">
                                        {format(new Date(expense.expense_date), 'MMMM dd, yyyy')}
                                    </dd>
                                </div>
                            </dl>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                                    <dd className="mt-1 capitalize">
                                        {expense.payment_method.replace('_', ' ')}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Account</dt>
                                    <dd className="mt-1">
                                        {expense.transactions[0]?.account.name}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Reference Number</dt>
                                    <dd className="mt-1">
                                        {expense.reference_number || 'N/A'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1">
                                        {expense.description || 'No description provided'}
                                    </dd>
                                </div>
                            </dl>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 