import AdminLayout from '@/Layouts/AdminLayout';
import AccountForm from '@/Components/AccountForm';
import { router, Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function AccountEdit({ account }) {
    const handleSubmit = (form) => {
        form.put(route('admin.accounts.update', account.id), {
            onSuccess: () => {
                router.visit(route('admin.accounts.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Update Account" />
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Update Account" />
                    
                    <AccountForm account={account} onSubmit={handleSubmit} />
                </div>
            </div>
        </AdminLayout>
    );
} 