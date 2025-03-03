import AdminLayout from '@/Layouts/AdminLayout';
import ExpenseForm from '@/Components/ExpenseForm';
import { router } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function ExpenseCreate({ accounts, categories }) {
    const handleSubmit = (form) => {
        form.post(route('admin.expenses.store'), {
            onSuccess: () => {
                router.visit(route('admin.expenses.index'));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Record New Expense" />
                    
                    <ExpenseForm
                        accounts={accounts}
                        categories={categories}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </AdminLayout>
    );
} 