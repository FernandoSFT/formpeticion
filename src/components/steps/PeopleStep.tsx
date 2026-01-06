'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Minus } from 'lucide-react';

interface PeopleStepProps {
    onNext: (data: { adults: number; children: number; childrenAges: number[] }) => void;
    defaultValues?: { adults: number; children: number; childrenAges: number[] };
}

export function PeopleStep({ onNext, defaultValues }: PeopleStepProps) {
    const [adults, setAdults] = useState(defaultValues?.adults || 2);
    const [children, setChildren] = useState(defaultValues?.children || 0);
    const [ages, setAges] = useState<number[]>(defaultValues?.childrenAges || []);

    const updateChildren = (count: number) => {
        if (count < 0) return;
        setChildren(count);
        if (count > ages.length) {
            setAges([...ages, 0]);
        } else {
            setAges(ages.slice(0, count));
        }
    };

    const updateAge = (index: number, age: number) => {
        const newAges = [...ages];
        newAges[index] = age;
        setAges(newAges);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({ adults, children, childrenAges: ages });
    };

    return (
        <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-900">¿Quiénes viajan?</h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <p className="font-semibold text-lg">Adultos</p>
                        <p className="text-sm text-gray-500">12+ años</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                            <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-6 text-center font-bold text-lg">{adults}</span>
                        <button type="button" onClick={() => setAdults(adults + 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                        <p className="font-semibold text-lg">Niños</p>
                        <p className="text-sm text-gray-500">2-11 años</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="button" onClick={() => updateChildren(children - 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                            <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-6 text-center font-bold text-lg">{children}</span>
                        <button type="button" onClick={() => updateChildren(children + 1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {children > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 pt-2"
                    >
                        <p className="text-sm font-medium text-gray-700">Edades de los niños</p>
                        <div className="grid grid-cols-4 gap-3">
                            {ages.map((age, i) => (
                                <input
                                    key={i}
                                    type="number"
                                    min="0"
                                    max="11"
                                    value={age || ''}
                                    onChange={(e) => updateAge(i, parseInt(e.target.value) || 0)}
                                    placeholder={`#${i + 1}`}
                                    className="w-full px-3 py-3 text-center rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
            >
                Siguiente <ArrowRight className="w-5 h-5" />
            </button>
        </motion.form>
    );
}
