import { Wizard } from '@/components/Wizard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-4 bg-white">
      <div className="w-full">
        <Wizard />
      </div>
    </main>
  );
}
