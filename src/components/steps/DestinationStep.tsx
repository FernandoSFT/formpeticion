'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface DestinationStepProps {
    onNext: (data: { destination: string }) => void;
    defaultValue?: string;
}

export function DestinationStep({ onNext, defaultValue = '' }: DestinationStepProps) {
    const [destination, setDestination] = useState(defaultValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (destination.trim()) {
            onNext({ destination });
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-900">¿A dónde te gustaría viajar?</h2>

            <div className="space-y-2">
                <input
                    type="text"
                    required
                    autoFocus
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ej: Japón, Maldivas, Italia..."
                    className="w-full px-4 py-4 text-lg rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-sm placeholder:text-gray-400"
                />
            </div>

            <button
                type="submit"
                disabled={!destination.trim()}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Siguiente <ArrowRight className="w-5 h-5" />
            </button>
        </motion.form>
    );
}
