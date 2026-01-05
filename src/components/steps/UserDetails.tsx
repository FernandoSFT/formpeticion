'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface UserData {
    name: string;
    email: string;
}

interface UserDetailsProps {
    initialData?: UserData | null;
    onNext: (data: UserData) => void;
}

export function UserDetails({ initialData, onNext }: UserDetailsProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [email, setEmail] = useState(initialData?.email || '');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && email) {
            onNext({ name, email });
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div className="space-y-2">
                {initialData ? (
                    <h2 className="text-xl font-semibold">¡Hola de nuevo, {initialData.name.split(' ')[0]}!</h2>
                ) : (
                    <h2 className="text-xl font-semibold">Cuéntanos un poco sobre ti</h2>
                )}
                <p className="text-gray-500 text-sm">
                    {initialData ? 'Confirma tus datos para continuar.' : 'Necesitamos tus datos para contactarte.'}
                </p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
                Continuar <ArrowRight className="w-4 h-4" />
            </button>
        </motion.form>
    );
}
