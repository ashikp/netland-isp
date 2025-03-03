import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card } from "@/components/ui/card";
import { 
    BarChart3, 
    LineChart, 
    PieChart,
    Wallet,
    CreditCard,
    DollarSign 
} from 'lucide-react';

export default function ReportsIndex() {
    const reports = [
        {
            name: 'Monthly Sales',
            description: 'View detailed monthly sales transactions',
            icon: BarChart3,
            route: 'admin.reports.monthly-sales'
        },
        {
            name: 'Monthly Stock',
            description: 'Track product stock movements',
            icon: PieChart,
            route: 'admin.reports.monthly-stock'
        },
        {
            name: 'Monthly Income',
            description: 'Analyze monthly income from all sources',
            icon: Wallet,
            route: 'admin.reports.monthly-income'
        },
        {
            name: 'Monthly Expense',
            description: 'Review monthly expenses by category',
            icon: DollarSign,
            route: 'admin.reports.monthly-expense'
        },
        {
            name: 'Monthly Payment',
            description: 'Track all payment transactions',
            icon: CreditCard,
            route: 'admin.reports.monthly-payment'
        },
        {
            name: 'Monthly Accounts Balance',
            description: 'Monitor account balances and transactions',
            icon: LineChart,
            route: 'admin.reports.monthly-accounts-balance'
        }
    ];

    return (
        <AdminLayout>
            <Head title="Reports" />

            <div className="max-w-7xl mx-auto py-6">
                <h1 className="text-2xl font-semibold mb-6">Reports</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <Link key={report.name} href={route(report.route)}>
                            <Card className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <report.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="font-medium">{report.name}</h2>
                                        <p className="text-sm text-gray-500">{report.description}</p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
} 