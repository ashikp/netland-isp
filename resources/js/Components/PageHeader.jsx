export default function PageHeader({ title, children, actions }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <div className="flex items-center space-x-4">
                    {actions || children}
                </div>
            </div>
        </div>
    );
} 