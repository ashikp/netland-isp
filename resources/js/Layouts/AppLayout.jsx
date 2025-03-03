import { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export default function AppLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="h-screen w-full">
            <ResizablePanelGroup direction="horizontal">
                {/* Sidebar */}
                <ResizablePanel 
                    defaultSize={20} 
                    minSize={10} 
                    maxSize={20} 
                    collapsible={true} 
                    onCollapse={() => setIsCollapsed(true)}
                    onExpand={() => setIsCollapsed(false)}
                >
                    {/* Add sidebar navigation here */}
                </ResizablePanel>
                
                <ResizableHandle />
                
                {/* Main Content */}
                <ResizablePanel defaultSize={80}>
                    <div className="h-full p-6">
                        {children}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
} 