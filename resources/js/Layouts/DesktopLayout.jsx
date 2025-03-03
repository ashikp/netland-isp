import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Navigation from "@/Components/Navigation";

export default function DesktopLayout({ children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-semibold" href="/">
                            <span className="">ISP Company</span>
                        </Link>
                    </div>
                    <ScrollArea className="flex-1 px-3">
                        <Navigation className="p-2" />
                    </ScrollArea>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="lg:hidden"
                            >
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[280px] p-0">
                            <div className="flex h-full flex-col">
                                <div className="flex h-[60px] items-center border-b px-6">
                                    <Link
                                        className="flex items-center gap-2 font-semibold"
                                        href="/"
                                    >
                                        <span className="">ISP Company</span>
                                    </Link>
                                </div>
                                <ScrollArea className="flex-1 px-3">
                                    <Navigation className="p-2" />
                                </ScrollArea>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                router.post(route('logout'));
                            }}
                        >
                            Logout
                        </Button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
} 