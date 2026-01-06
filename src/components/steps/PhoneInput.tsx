'use client';

import { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PhoneInputProps {
    onValidated: (data: any) => void;
}

export function PhoneInput({ onValidated }: PhoneInputProps) {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validatePhone = async () => {
        const cleanPhone = phone.replace(/\s/g, '');
        if (!cleanPhone || cleanPhone.length < 9) {
            setError('Por favor introduce un número válido');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/notion/validate-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: cleanPhone }),
            });

            const data = await res.json();

            onValidated({
                phone: cleanPhone,
                exists: data.exists,
                user: data.user
            });

        } catch (err) {
            setError('Error al conectar. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <h2 className="text-2xl font-bold text-gray-900">Empecemos por tu teléfono</h2>
            <p className="text-gray-500 -mt-4 text-sm">
                Lo usaremos para comprobar si ya eres cliente y recuperar tus datos.
            </p>

            <div className="space-y-2">
                <input
                    type="tel"
                    autoFocus
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => { if (phone.length >= 9) validatePhone(); }}
                    onKeyDown={(e) => e.key === 'Enter' && validatePhone()}
                    className="w-full px-4 py-4 text-lg rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-sm transition-all placeholder:text-gray-400"
                    placeholder="Ej: 600 000 000"
                />
                {error && <p className="text-red-500 text-sm pl-1">{error}</p>}
            </div>

            <button
                onClick={validatePhone}
                disabled={loading || phone.length < 9}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continuar'}
                {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
        </motion.div>
    );
}
