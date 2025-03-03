import {
    LayoutDashboard,
    FileText,
    CreditCard,
    BookOpen
} from 'lucide-react';
import BaseLayout from './BaseLayout';

export default function CustomerLayout({ children }) {
    const navigation = [
        { name: 'Dashboard', href: route('customer.dashboard'), icon: LayoutDashboard, current: route().current('customer.dashboard') },
        { name: 'Invoices', href: route('customer.invoices'), icon: FileText, current: route().current('customer.invoices') },
        { name: 'Payments', href: route('customer.payments'), icon: CreditCard, current: route().current('customer.payments') },
        { name: 'Ledger', href: route('customer.ledger'), icon: BookOpen, current: route().current('customer.ledger') }
    ];

    return (
        <BaseLayout
            title="Customer Portal"
            navigation={navigation}
            userType="customer"
        >
            {children}
        </BaseLayout>
    );
} 