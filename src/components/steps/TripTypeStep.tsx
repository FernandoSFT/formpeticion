'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

interface TripTypeStepProps {
    onNext: (data: { tripType: string }) => void;
    defaultValue?: string;
}

const TRIP_TYPES = [
    'Luna de miel',
    'Crucero',
    'Familia',
    'Aventura',
    'Relax',
    'Otro'
];

export function TripTypeStep({ onNext, defaultValue = '' }: TripTypeStepProps) {
    // Parse defaultValue which might be a comma-separated string into an array
    const initialTypes = defaultValue ? defaultValue.split(', ') : [];
    const [selectedTypes, setSelectedTypes] = useState<string[]>(initialTypes);

    const toggleType = (type: string) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTypes.length > 0) {
            onNext({ tripType: selectedTypes.join(', ') });
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
            <h2 className="text-2xl font-bold text-gray-900">¿Qué tipo de viaje buscas?</h2>
            <p className="text-gray-500 -mt-4 text-sm">Puedes seleccionar varias opciones.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRIP_TYPES.map((type) => {
                    const isSelected = selectedTypes.includes(type);
                    return (
                        <button
                            key={type}
                            type="button"
                            onClick={() => toggleType(type)}
                            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${isSelected
                                ? 'border-black bg-gray-50 ring-1 ring-black'
                                : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            <span className={`block font-medium ${isSelected ? 'text-black' : 'text-gray-700'}`}>
                                {type}
                            </span>
                            {isSelected && <Check className="w-5 h-5 text-black" />}
                        </button>
                    );
                })}
            </div>

            <button
                type="submit"
                disabled={selectedTypes.length === 0}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Siguiente <ArrowRight className="w-5 h-5" />
            </button>
        </motion.form>
    );
}
