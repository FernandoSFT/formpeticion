'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface UserData {
    name: string;
    email: string;
}

interface UserDetailsProps {
    onNext: (data: UserData) => void;
    defaultValues?: { name?: string; email?: string };
}

export function UserDetails({ onNext, defaultValues }: UserDetailsProps) {
    const [name, setName] = useState(defaultValues?.name || '');
    const [email, setEmail] = useState(defaultValues?.email || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
            onNext({ name, email });
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
            <h2 className="text-2xl font-bold text-gray-900">Cuéntanos sobre ti</h2>
            <p className="text-gray-500 -mt-4 text-sm">
                Necesitamos tus datos para poder contactarte con la propuesta de viaje.
            </p>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                    <input
                        type="text"
                        required
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@email.com"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={!name || !email}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Siguiente <ArrowRight className="w-5 h-5" />
            </button>
        </motion.form>
    );
}
