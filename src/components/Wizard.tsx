'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneInput } from './steps/PhoneInput';
import { UserDetails } from './steps/UserDetails';
import { TripDetails } from './steps/TripDetails';
import { FamilyComposition } from './steps/FamilyComposition';
import { CheckCircle2 } from 'lucide-react';

export function Wizard() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePhoneValidated = (data: any) => {
        setFormData({ ...formData, ...data });
        if (data.exists && data.user) {
            // User exists, prefill data and skip to Trip Details? 
            // User prompt: "Si el contacto existe: Recupera nombre y email. Muestra bienvenida y permite confirmar o editar."
            // So we GO to step 2 (UserDetails) but prefilled.
            setStep(2);
        } else {
            // User new: Go to step 2 (Empty).
            setStep(2);
        }
    };

    const handleUserDetails = (data: any) => {
        setFormData({ ...formData, ...data });
        setStep(3);
    };

    const handleTripDetails = (data: any) => {
        setFormData({ ...formData, ...data });
        setStep(4);
    };

    const handleFamilyComposition = async (data: any) => {
        const finalData = { ...formData, ...data };
        setFormData(finalData);
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/notion/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: finalData.phone,
                    name: finalData.name,
                    email: finalData.email,
                    contactId: finalData.user?.id, // If existed
                    destination: finalData.destination,
                    tripType: finalData.tripType,
                    dates: finalData.dates,
                    adults: finalData.adults,
                    children: finalData.children,
                    childrenAges: finalData.childrenAges
                })
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                alert('Hubo un error al enviar la solicitud.');
            }

        } catch (e) {
            console.error(e);
            alert('Error de conexión.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600"
                >
                    <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h2 className="text-3xl font-bold">¡Solicitud Recibida!</h2>
                <p className="text-gray-500 max-w-md">Gracias por confiar en nosotros. Tu asesor de viajes se pondrá en contacto contigo pronto para empezar a planear esta aventura.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100 min-h-[400px]">
            <div className="mb-8">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-black"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>
                <p className="text-right text-xs text-gray-400 mt-2">Paso {step} de 4</p>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="1" exit={{ opacity: 0, x: -20 }}>
                        <PhoneInput onValidated={handlePhoneValidated} />
                    </motion.div>
                )}
                {step === 2 && (
                    <motion.div key="2" exit={{ opacity: 0, x: -20 }}>
                        <UserDetails
                            initialData={formData.user || null}
                            onNext={handleUserDetails}
                        />
                    </motion.div>
                )}
                {step === 3 && (
                    <motion.div key="3" exit={{ opacity: 0, x: -20 }}>
                        <TripDetails onNext={handleTripDetails} />
                    </motion.div>
                )}
                {step === 4 && (
                    <motion.div key="4" exit={{ opacity: 0, x: -20 }}>
                        <FamilyComposition onNext={handleFamilyComposition} isSubmitting={isSubmitting} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
