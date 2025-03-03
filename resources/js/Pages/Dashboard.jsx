import DesktopLayout from '@/Layouts/DesktopLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
    return (
        <DesktopLayout>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Customers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">1,234</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Active NAS</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">12</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Available IPs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">45</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Active Packages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">8</p>
                    </CardContent>
                </Card>
            </div>
        </DesktopLayout>
    );
}
