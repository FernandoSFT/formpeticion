import { Wizard } from '@/components/Wizard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Diseña tu Viaje</h1>
        <p className="text-gray-500">Déjanos los detalles y nosotros haremos la magia.</p>
      </div>
      <Wizard />
    </main>
  );
}
