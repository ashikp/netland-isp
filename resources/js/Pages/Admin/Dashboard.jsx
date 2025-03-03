import { Link, Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import {
    Users,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    TrendingUp,
    DollarSign
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const formatCurrency = (amount) => {
    return parseFloat(amount).toFixed(2);
};

export default function Dashboard({ stats }) {
    return (
        <AdminLayout>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50/50">
                <div className="space-y-6">
                    <div className="px-4 py-6 bg-white shadow-sm">
                        <h1 className="text-2xl font-bold">Dashboard</h1>
                    </div>

                    <div className="px-4">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                                        <p className="text-2xl font-semibold">{stats.total_customers}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Wallet className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Income This Month</p>
                                        <p className="text-2xl font-semibold">${formatCurrency(stats.income_this_month)}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Activity className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Balance</p>
                                        <p className="text-2xl font-semibold">${formatCurrency(stats.total_balance)}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-emerald-100 rounded-lg">
                                        <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Balance In</p>
                                        <p className="text-2xl font-semibold text-emerald-600">+${formatCurrency(stats.total_balance_in)}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <div className="flex items-center">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <ArrowDownRight className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Balance Out</p>
                                        <p className="text-2xl font-semibold text-red-600">-${formatCurrency(stats.total_balance_out)}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Monthly Income</h2>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats.monthly_income}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="income"
                                                stroke="#4F46E5"
                                                strokeWidth={2}
                                                dot={{ r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Monthly Profit</h2>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={stats.monthly_profit}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="profit"
                                                stroke="#10B981"
                                                strokeWidth={2}
                                                dot={{ r: 4 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* Recent Activities */}
                        <div className="mb-6">
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
                                <div className="space-y-4">
                                    {stats.recent_activities.map((activity, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{activity.description}</p>
                                                <p className="text-sm text-gray-500">
                                                    {format(new Date(activity.date), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-medium ${
                                                    activity.type === 'income' ? 'text-emerald-600' : 
                                                    activity.type === 'expense' ? 'text-red-600' : 'text-gray-900'
                                                }`}>
                                                    {activity.type === 'income' ? '+' : 
                                                     activity.type === 'expense' ? '-' : ''} 
                                                    ${formatCurrency(activity.amount)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {activity.status}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
} 