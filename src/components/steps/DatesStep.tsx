'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface DatesStepProps {
    onNext: (data: { dates: { start: string; end: string; flexible: boolean } }) => void;
    defaultValues?: { start: string; end: string; flexible: boolean };
}

export function DatesStep({ onNext, defaultValues }: DatesStepProps) {
    const [startDate, setStartDate] = useState(defaultValues?.start || '');
    const [endDate, setEndDate] = useState(defaultValues?.end || '');
    const [flexible, setFlexible] = useState(defaultValues?.flexible || false);

    const today = new Date().toISOString().split('T')[0];

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value;
        setStartDate(newStart);

        // If end date is empty or before start date, update it
        if (!endDate || endDate < newStart) {
            setEndDate(newStart);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (startDate && endDate) {
            onNext({ dates: { start: startDate, end: endDate, flexible } });
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
            <h2 className="text-2xl font-bold text-gray-900">¿Cuándo quieres viajar?</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Ida</label>
                    <input
                        type="date"
                        required
                        min={today}
                        value={startDate}
                        onChange={handleStartDateChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Vuelta</label>
                    <input
                        type="date"
                        required
                        min={startDate || today}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <input
                    type="checkbox"
                    id="flexible"
                    checked={flexible}
                    onChange={(e) => setFlexible(e.target.checked)}
                    className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black cursor-pointer"
                />
                <label htmlFor="flexible" className="text-gray-700 cursor-pointer select-none">
                    Mis fechas son flexibles (+/- 3 días)
                </label>
            </div>

            <button
                type="submit"
                disabled={!startDate || !endDate}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Siguiente <ArrowRight className="w-5 h-5" />
            </button>
        </motion.form>
    );
}
