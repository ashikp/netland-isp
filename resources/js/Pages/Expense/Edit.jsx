import AdminLayout from '@/Layouts/AdminLayout';
import ExpenseForm from '@/Components/ExpenseForm';
import { router } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';

export default function ExpenseEdit({ expense, accounts, categories }) {
    const handleSubmit = (form) => {
        form.put(route('admin.expenses.update', expense.id), {
            onSuccess: () => {
                router.visit(route('admin.expenses.show', expense.id));
            },
        });
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50/50">
                <div className="p-6 space-y-6">
                    <PageHeader title="Edit Expense" />
                    
                    <ExpenseForm
                        expense={expense}
                        accounts={accounts}
                        categories={categories}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </AdminLayout>
    );
} 