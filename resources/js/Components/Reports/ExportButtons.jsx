import { Button } from "@/components/ui/button";

export default function ExportButtons({ type, date }) {
    const handleExport = (format) => {
        window.location.href = route('admin.reports.export', {
            type,
            format,
            date
        });
    };

    return (
        <div className="flex gap-2">
            <Button onClick={() => handleExport('pdf')}>
                Export PDF
            </Button>
            <Button onClick={() => handleExport('excel')}>
                Export Excel
            </Button>
        </div>
    );
} 