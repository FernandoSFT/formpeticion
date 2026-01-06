'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneInput } from './steps/PhoneInput';
import { UserDetails } from './steps/UserDetails';
import { DestinationStep } from './steps/DestinationStep';
import { DatesStep } from './steps/DatesStep';
import { PeopleStep } from './steps/PeopleStep';
import { TripTypeStep } from './steps/TripTypeStep';
import { NotesStep } from './steps/NotesStep';
import { CheckCircle2 } from 'lucide-react';

export function Wizard() {
    // Current Step:
    // 1: Phone
    // 2: UserDetails (New or Existing User)
    // 3: Destination
    // 4: Dates
    // 5: People
    // 6: TripType
    // 7: Notes
    const [step, setStep] = useState(1);

    // We store all form data here
    const [formData, setFormData] = useState<any>({});

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const TOTAL_STEPS = 7;

    const handlePhoneValidated = (data: any) => {
        // Always go to Step 2 (UserDetails), whether existing or not.
        // Data for existing user will be passed via formData.user which UserDetails will use as defaultValues
        setFormData((prev: any) => ({ ...prev, ...data }));
        setStep(2);
    };

    const handleUserDetails = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
        setStep(3);
    };

    const handleDestination = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
        setStep(4);
    };

    const handleDates = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
        setStep(5);
    };

    const handlePeople = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
        setStep(6);
    };

    const handleTripType = (data: any) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
        setStep(7);
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleNotes = async (data: any) => {
        const finalData = { ...formData, ...data };
        setFormData(finalData);
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/notion/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: finalData.phone,
                    name: finalData.name || finalData.user?.name,
                    email: finalData.email || finalData.user?.email,
                    contactId: finalData.user?.id,
                    existingUser: finalData.exists,

                    destination: finalData.destination,
                    tripType: finalData.tripType,
                    dates: finalData.dates,
                    adults: finalData.adults,
                    children: finalData.children,
                    childrenAges: finalData.childrenAges,
                    notes: finalData.notes
                })
            });

            if (res.ok) {
                setIsSuccess(true);
            } else {
                console.error("Submit failed", await res.text());
                alert('Hubo un error al enviar la solicitud. Por favor inténtalo de nuevo.');
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
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 p-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-sm"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-gray-900">¡Solicitud Recibida!</h2>
                    <p className="text-gray-500 max-w-md mx-auto text-lg">
                        Gracias por confiar en nosotros. Tu asesor de viajes se pondrá en contacto contigo muy pronto.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
            {/* Progress Bar & Header */}
            <div className="bg-gray-50 px-8 pt-8 pb-4 relative">
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        className="absolute top-8 left-4 p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100"
                        title="Volver"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </button>
                )}

                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mx-4">
                    <motion.div
                        className="h-full bg-black rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                        transition={{ ease: "circOut", duration: 0.5 }}
                    />
                </div>
                <div className="flex justify-between items-center mt-3 mx-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Solicitud de viaje</p>
                    <p className="text-xs font-medium text-gray-500">Paso {step} de {TOTAL_STEPS}</p>
                </div>
            </div>

            <div className="p-8 min-h-[400px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <PhoneInput key="1" onValidated={handlePhoneValidated} />
                    )}
                    {step === 2 && (
                        <UserDetails
                            key="2"
                            onNext={handleUserDetails}
                            // Pre-fill with existing user data if available OR formData.name/email if the user went back
                            defaultValues={{
                                name: formData.name || formData.user?.name,
                                email: formData.email || formData.user?.email
                            }}
                        />
                    )}
                    {step === 3 && (
                        <DestinationStep
                            key="3"
                            onNext={handleDestination}
                            defaultValue={formData.destination}
                        />
                    )}
                    {step === 4 && (
                        <DatesStep
                            key="4"
                            onNext={handleDates}
                            defaultValues={formData.dates}
                        />
                    )}
                    {step === 5 && (
                        <PeopleStep
                            key="5"
                            onNext={handlePeople}
                            defaultValues={{
                                adults: formData.adults,
                                children: formData.children,
                                childrenAges: formData.childrenAges
                            }}
                        />
                    )}
                    {step === 6 && (
                        <TripTypeStep
                            key="6"
                            onNext={handleTripType}
                            defaultValue={formData.tripType}
                        />
                    )}
                    {step === 7 && (
                        <NotesStep
                            key="7"
                            onNext={handleNotes}
                            isSubmitting={isSubmitting}
                            defaultValue={formData.notes}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
