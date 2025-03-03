import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import PageHeader from '@/Components/PageHeader';
import { router } from '@inertiajs/react';

export default function TransferShow({ transfer }) {
    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Transfer Details">
                        <div className="flex items-center space-x-2">
                            {transfer.status === 'completed' && (
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to cancel this transfer?')) {
                                            router.post(route('admin.transfers.cancel', transfer.id));
                                        }
                                    }}
                                >
                                    Cancel Transfer
                                </Button>
                            )}
                            <Link href={route('admin.transfers.index')}>
                                <Button variant="outline">Back to List</Button>
                            </Link>
                        </div>
                    </PageHeader>

                    <div className="grid grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Transfer Information</h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Transfer Number</dt>
                                    <dd className="mt-1">{transfer.transfer_number}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1">
                                        <Badge
                                            variant={transfer.status === 'completed' ? 'success' : 'destructive'}
                                        >
                                            {transfer.status}
                                        </Badge>
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Amount</dt>
                                    <dd className="mt-1">${transfer.amount}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Transfer Date</dt>
                                    <dd className="mt-1">
                                        {format(new Date(transfer.transfer_date), 'MMMM dd, yyyy')}
                                    </dd>
                                </div>
                            </dl>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Account Details</h3>
                            <dl className="space-y-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">From Account</dt>
                                    <dd className="mt-1">{transfer.from_account.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">To Account</dt>
                                    <dd className="mt-1">{transfer.to_account.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Reference Number</dt>
                                    <dd className="mt-1">
                                        {transfer.reference_number || 'N/A'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1">
                                        {transfer.description || 'No description provided'}
                                    </dd>
                                </div>
                            </dl>
                        </Card>

                        <Card className="col-span-2 p-6">
                            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
                            <div className="space-y-4">
                                {transfer.transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{transaction.transaction_number}</p>
                                            <p className="text-sm text-gray-500">{transaction.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-medium ${transaction.debit > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {transaction.debit > 0 ? '-' : '+'}${transaction.debit || transaction.credit}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Balance: ${transaction.balance}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 