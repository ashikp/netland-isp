import AdminLayout from '@/Layouts/AdminLayout';
import AccountForm from '@/Components/AccountForm';
import { router, Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function AccountCreate() {
    const handleSubmit = (form) => {
        form.post(route('admin.accounts.store'), {
            onSuccess: () => {
                router.visit(route('admin.accounts.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Create Account" />
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Create Account" />
                    
                    <AccountForm onSubmit={handleSubmit} />
                </div>
            </div>
        </AdminLayout>
    );
} 