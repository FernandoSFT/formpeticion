'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Minus, Loader2 } from 'lucide-react';

interface FamilyData {
    adults: number;
    children: number;
    childrenAges: number[];
}

interface FamilyCompositionProps {
    onNext: (data: FamilyData) => void;
    isSubmitting?: boolean;
}

export function FamilyComposition({ onNext, isSubmitting }: FamilyCompositionProps) {
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [ages, setAges] = useState<number[]>([]);

    const updateChildren = (count: number) => {
        if (count < 0) return;
        setChildren(count);
        // Adjust ages array
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold">¿Quiénes viajan?</h2>

            <div className="space-y-6">
                {/* Adults */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="font-medium">Adultos</p>
                        <p className="text-sm text-gray-500">12+ años</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setAdults(Math.max(1, adults - 1))} className="p-2 rounded-full hover:bg-gray-200">
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{adults}</span>
                        <button type="button" onClick={() => setAdults(adults + 1)} className="p-2 rounded-full hover:bg-gray-200">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="font-medium">Niños</p>
                        <p className="text-sm text-gray-500">2-11 años</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => updateChildren(children - 1)} className="p-2 rounded-full hover:bg-gray-200">
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{children}</span>
                        <button type="button" onClick={() => updateChildren(children + 1)} className="p-2 rounded-full hover:bg-gray-200">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Ages Input */}
                {children > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3"
                    >
                        <p className="text-sm font-medium">Edades de los niños</p>
                        <div className="grid grid-cols-4 gap-2">
                            {ages.map((age, i) => (
                                <input
                                    key={i}
                                    type="number"
                                    min="0"
                                    max="11"
                                    value={age || ''}
                                    onChange={(e) => updateAge(i, parseInt(e.target.value) || 0)}
                                    placeholder={`Niño ${i + 1}`}
                                    className="w-full px-3 py-2 text-center rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalizar Solicitud'}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
        </motion.form>
    );
}
