'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface TripDetailsData {
    destination: string;
    tripType: string;
    dates: {
        start: string;
        end: string;
        flexible: boolean;
    };
    notes: string;
}

interface TripDetailsProps {
    onNext: (data: TripDetailsData) => void;
}

const TRIP_TYPES = [
    'Luna de miel',
    'Crucero',
    'Familia',
    'Aventura',
    'Relax',
    'Otro'
];

export function TripDetails({ onNext }: TripDetailsProps) {
    const [destination, setDestination] = useState('');
    const [tripType, setTripType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [flexible, setFlexible] = useState(false);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (destination && tripType && startDate && endDate) {
            onNext({
                destination,
                tripType,
                dates: { start: startDate, end: endDate, flexible },
                notes
            });
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <h2 className="text-xl font-semibold">¿Dónde te gustaría ir?</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                    <input
                        type="text"
                        required
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Ej: Japón, Maldivas..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Viaje</label>
                    <select
                        required
                        value={tripType}
                        onChange={(e) => setTripType(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none bg-white"
                    >
                        <option value="">Selecciona una opción</option>
                        {TRIP_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                        <input
                            type="date"
                            required
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                        <input
                            type="date"
                            required
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="flexible"
                        checked={flexible}
                        onChange={(e) => setFlexible(e.target.checked)}
                        className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                    />
                    <label htmlFor="flexible" className="text-sm text-gray-600">Mis fechas son flexibles (+/- 3 días)</label>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Información adicional / Notas
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tipo de habitaciones, régimenes alimenticios, presupuesto aproximado, etc..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:outline-none resize-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
                Siguiente <ArrowRight className="w-4 h-4" />
            </button>
        </motion.form>
    );
}
