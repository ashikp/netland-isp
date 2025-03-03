import AdminLayout from '@/Layouts/AdminLayout';
import TransferForm from '@/Components/TransferForm';
import { router } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function TransferCreate({ accounts }) {
    const handleSubmit = (form) => {
        form.post(route('admin.transfers.store'), {
            onSuccess: () => {
                router.visit(route('admin.transfers.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="New Transfer" />
                    
                    <TransferForm
                        accounts={accounts}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </AdminLayout>
    );
} 