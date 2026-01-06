'use client';

import { Info } from 'lucide-react';
import { useState, useEffect } from 'react';

export function VersionFooter() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const version = process.env.APP_VERSION;
    const date = process.env.APP_BUILD_DATE ? new Date(process.env.APP_BUILD_DATE).toLocaleString() : 'Unknown';

    return (
        <div className="fixed bottom-2 right-2 p-2 group z-50">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-64 text-xs text-gray-600 pointer-events-none group-hover:pointer-events-auto">
                <p><span className="font-semibold">Versión (SHA):</span> {version?.substring(0, 7)}</p>
                <p><span className="font-semibold">Actualizado:</span> {date}</p>
            </div>
            <div className="opacity-10 hover:opacity-50 transition-opacity cursor-help">
                <Info className="w-4 h-4 text-black" />
            </div>
        </div>
    );
}
