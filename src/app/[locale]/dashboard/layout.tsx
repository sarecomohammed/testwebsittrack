import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardNav from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <>
      <DashboardNav />
      <main style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--bg-secondary)' }}>
        {children}
      </main>
    </>
  );
}

