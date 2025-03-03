import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { LogOut, ChevronDown } from 'lucide-react';

export default function BaseLayout({ children, title, navigation, userType = 'admin' }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openSections, setOpenSections] = useState({});

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
                <div className="max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-gray-800">{title}</span>
                        </div>

                        {/* Navigation Items */}
                        <div className="hidden sm:flex sm:items-center space-x-6">
                            {navigation.map((group, groupIndex) => (
                                <div key={group.section || groupIndex} className="relative group">
                                    {group.section ? (
                                        <>
                                            <button
                                                onClick={() => toggleSection(group.section)}
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-150 ease-in-out"
                                            >
                                                <group.icon className="w-4 h-4 mr-2" />
                                                {group.section}
                                                <ChevronDown className="w-4 h-4 ml-1" />
                                            </button>
                                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                                <div className="py-1">
                                                    {group.items.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className={`block px-4 py-2 text-sm ${
                                                                item.current
                                                                    ? 'bg-gray-100 text-gray-900'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                            }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <item.icon className="w-4 h-4 mr-2" />
                                                                {item.name}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        group.items.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                                                    ${item.current
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    } transition-colors duration-150 ease-in-out`}
                                            >
                                                <item.icon className="w-4 h-4 mr-2" />
                                                {item.name}
                                            </Link>
                                        ))
                                    )}
                                </div>
                            ))}

                            {/* Logout Button */}
                            <Link
                                href={route(`${userType}.logout`)}
                                method="post"
                                as="button"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-150 ease-in-out"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="sm:hidden flex items-center">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="sm:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            {navigation.map((group, groupIndex) => (
                                <div key={group.section || groupIndex}>
                                    {group.section ? (
                                        <>
                                            <button
                                                onClick={() => toggleSection(group.section)}
                                                className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            >
                                                <div className="flex items-center">
                                                    <group.icon className="w-5 h-5 mr-3" />
                                                    {group.section}
                                                </div>
                                                <ChevronDown 
                                                    className={`w-5 h-5 transform transition-transform duration-200 ${
                                                        openSections[group.section] ? 'rotate-180' : ''
                                                    }`} 
                                                />
                                            </button>
                                            {openSections[group.section] && (
                                                <div className="pl-4">
                                                    {group.items.map((item) => (
                                                        <Link
                                                            key={item.name}
                                                            href={item.href}
                                                            className={`block px-3 py-2 text-base font-medium ${
                                                                item.current
                                                                    ? 'bg-gray-100 text-gray-900'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                            }`}
                                                        >
                                                            <div className="flex items-center">
                                                                <item.icon className="w-5 h-5 mr-3" />
                                                                {item.name}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        group.items.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`block px-3 py-2 text-base font-medium ${
                                                    item.current
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <item.icon className="w-5 h-5 mr-3" />
                                                    {item.name}
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            ))}
                            <Link
                                href={route(`${userType}.logout`)}
                                method="post"
                                as="button"
                                className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <div className="flex items-center">
                                    <LogOut className="w-5 h-5 mr-3" />
                                    Logout
                                </div>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-16 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
} 