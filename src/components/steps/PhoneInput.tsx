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
        if (!phone || phone.length < 9) {
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
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();

            // Pass result to parent (exists true/false + user data if any)
            onValidated({
                phone,
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Teléfono Móvil
                </label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => { if (phone.length >= 9) validatePhone(); }}
                    onKeyDown={(e) => e.key === 'Enter' && validatePhone()}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none transition-all"
                    placeholder="600 000 000"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <button
                onClick={validatePhone}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continuar'}
                {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
        </motion.div>
    );
}
