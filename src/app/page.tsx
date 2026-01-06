import { Wizard } from '@/components/Wizard';
import { VersionFooter } from '@/components/VersionFooter';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-4 bg-white relative">
      <div className="w-full">
        <Wizard />
      </div>
      <VersionFooter />
    </main>
  );
}
