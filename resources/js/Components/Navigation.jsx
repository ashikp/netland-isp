import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Network,
    Package,
    Globe,
    Wrench,
    BookOpen,
    FileText,
    CreditCard,
    DollarSign,
    ArrowLeftRight,
    BarChart3,
} from "lucide-react";

export default function Navigation({ className }) {
    const navigationItems = [
        // ISP Management Section
        {
            name: "Dashboard",
            href: "admin.dashboard",
            icon: LayoutDashboard,
            current: route().current("admin.dashboard"),
        },
        {
            name: "Customers",
            href: "admin.customers.index",
            icon: Users,
            current: route().current("admin.customers.*"),
        },
        {
            name: "NAS",
            href: "admin.nas.index",
            icon: Network,
            current: route().current("admin.nas.*"),
        },
        {
            name: "Packages",
            href: "admin.packages.index",
            icon: Package,
            current: route().current("admin.packages.*"),
        },
        {
            name: "Real IP",
            href: "admin.real-ips.index",
            icon: Globe,
            current: route().current("admin.real-ips.*"),
        },
        {
            name: "Services",
            href: "admin.services.index",
            icon: Wrench,
            current: route().current("admin.services.*"),
        },

        // Accounting Section
        {
            name: "Accounts",
            href: "admin.accounts.index",
            icon: BookOpen,
            current: route().current("admin.accounts.*"),
        },
        {
            name: "Invoices",
            href: "admin.invoices.index",
            icon: FileText,
            current: route().current("admin.invoices.*"),
        },
        {
            name: "Payments",
            href: "admin.payments.index",
            icon: CreditCard,
            current: route().current("admin.payments.*"),
        },
        {
            name: "Expenses",
            href: "admin.expenses.index",
            icon: DollarSign,
            current: route().current("admin.expenses.*"),
        },
        {
            name: "Transfers",
            href: "admin.transfers.index",
            icon: ArrowLeftRight,
            current: route().current("admin.transfers.*"),
        },
        {
            name: "Reports",
            href: "admin.reports.index",
            icon: BarChart3,
            current: route().current("admin.reports.*"),
        },
    ];

    return (
        <nav className={cn("space-y-0.5", className)}>
            {navigationItems.map((item) => (
                <Link
                    key={item.name}
                    href={route(item.href)}
                    className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                        item.current &&
                            "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                    )}
                >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                </Link>
            ))}
        </nav>
    );
} 