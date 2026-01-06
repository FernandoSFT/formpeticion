'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

interface NotesStepProps {
    onNext: (data: { notes: string }) => void;
    isSubmitting: boolean;
    defaultValue?: string;
}

export function NotesStep({ onNext, isSubmitting, defaultValue = '' }: NotesStepProps) {
    const [notes, setNotes] = useState(defaultValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext({ notes });
    };

    return (
        <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-900">¿Algo más que debamos saber?</h2>

            <p className="text-gray-500 -mt-4 text-sm">
                Cuéntanos sobre tus preferencias de habitaciones, presupuesto, alergias, o cualquier detalle que nos ayude a personalizar tu viaje.
            </p>

            <div className="space-y-2">
                <textarea
                    autoFocus
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Escribe aquí tus anotaciones..."
                    rows={6}
                    className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-sm resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-70"
            >
                {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        Finalizar Solicitud <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </motion.form>
    );
}
