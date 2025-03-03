import { 
    LayoutDashboard,
    Users,
    Network,
    Package,
    Globe,
    Wrench,
    FileText,
    CreditCard,
    BookOpen,
    DollarSign,
    ArrowLeftRight,
    Truck,
    UserCircle,
    Settings,
    LayoutGrid,
    Box,
    Boxes,
    Database,
    ShoppingCart,
    BarChart3,
    Cog
} from 'lucide-react';
import BaseLayout from './BaseLayout';

export default function AdminLayout({ children }) {
    const navigation = [
        {
            section: null,
            items: [
                { 
                    name: 'Dashboard', 
                    href: route('admin.dashboard'), 
                    icon: LayoutDashboard, 
                    current: route().current('admin.dashboard') 
                }
            ]
        },
        {
            section: 'Users',
            icon: UserCircle,
            items: [
                { 
                    name: 'Customers', 
                    href: route('admin.customers.index'), 
                    icon: Users, 
                    current: route().current('admin.customers.*') 
                },
                { 
                    name: 'Suppliers', 
                    href: route('admin.suppliers.index'), 
                    icon: Truck, 
                    current: route().current('admin.suppliers.*') 
                }
            ]
        },
        {
            section: 'Asset',
            icon: Database,
            items: [
                { 
                    name: 'Products', 
                    href: route('admin.products.index'), 
                    icon: Box, 
                    current: route().current('admin.products.*') 
                },
                { 
                    name: 'Inventory', 
                    href: route('admin.inventory.index'), 
                    icon: Boxes, 
                    current: route().current('admin.inventory.*') 
                }
            ]
        },
        {
            section: 'Controller',
            icon: Settings,
            items: [
                { 
                    name: 'NAS', 
                    href: route('admin.nas.index'), 
                    icon: Network, 
                    current: route().current('admin.nas.*') 
                },
                { 
                    name: 'Packages', 
                    href: route('admin.packages.index'), 
                    icon: Package, 
                    current: route().current('admin.packages.*') 
                },
                { 
                    name: 'Real IP', 
                    href: route('admin.real-ips.index'), 
                    icon: Globe, 
                    current: route().current('admin.real-ips.*') 
                },
                { 
                    name: 'Services', 
                    href: route('admin.services.index'), 
                    icon: Wrench, 
                    current: route().current('admin.services.*') 
                }
            ]
        },
        {
            section: 'Accountant',
            icon: LayoutGrid,
            items: [
                { 
                    name: 'Invoices', 
                    href: route('admin.invoices.index'), 
                    icon: FileText, 
                    current: route().current('admin.invoices.*') 
                },
                { 
                    name: 'Payments', 
                    href: route('admin.payments.index'), 
                    icon: CreditCard, 
                    current: route().current('admin.payments.*') 
                },
                { 
                    name: 'Accounts', 
                    href: route('admin.accounts.index'), 
                    icon: BookOpen, 
                    current: route().current('admin.accounts.*') 
                },
                { 
                    name: 'Expenses', 
                    href: route('admin.expenses.index'), 
                    icon: DollarSign, 
                    current: route().current('admin.expenses.*') 
                },
                { 
                    name: 'Purchases', 
                    href: route('admin.purchases.index'), 
                    icon: ShoppingCart, 
                    current: route().current('admin.purchases.*') 
                },
                { 
                    name: 'Transfers', 
                    href: route('admin.transfers.index'), 
                    icon: ArrowLeftRight, 
                    current: route().current('admin.transfers.*') 
                }
            ]
        },
        {
            section: "Reports",
            icon: BarChart3,
            items: [
                {
                    name: "All Reports",
                    href: route('admin.reports.index'),
                    icon: BarChart3,
                    current: route().current("admin.reports.index"),
                },
                {
                    name: "Monthly Sales",
                    href: route('admin.reports.monthly-sales'),
                    icon: BarChart3,
                    current: route().current("admin.reports.monthly-sales"),
                },
                {
                    name: "Monthly Stock",
                    href: route('admin.reports.monthly-stock'),
                    icon: BarChart3,
                    current: route().current("admin.reports.monthly-stock"),
                },
                {
                    name: "Monthly Income",
                    href: route('admin.reports.monthly-income'),
                    icon: BarChart3,
                    current: route().current("admin.reports.monthly-income"),
                },
                {
                    name: "Monthly Expense",
                    href: route('admin.reports.monthly-expense'),
                    icon: BarChart3,
                    current: route().current("admin.reports.monthly-expense"),
                },
                {
                    name: "Monthly Payment",
                    href: route('admin.reports.monthly-payment'),
                    icon: BarChart3,
                    current: route().current("admin.reports.monthly-payment"),
                },
                {
                    name: "Monthly Accounts Balance",
                    href: route('admin.reports.monthly-accounts-balance'),
                    icon: BarChart3,
                    current: route().current("admin.reports.monthly-accounts-balance"),
                },
            ],
        },
        {
            section: "Tools",
            icon: Settings,
            items: [
                {
                    name: "Site Settings",
                    href: route('admin.settings.index'),
                    icon: Cog,
                    current: route().current('admin.settings.index')
                }
            ]
        }
    ];

    return (
        <BaseLayout
            title="Admin Panel"
            navigation={navigation}
            userType="admin"
        >
            {children}
        </BaseLayout>
    );
} 