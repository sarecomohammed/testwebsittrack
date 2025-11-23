import { redirect } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import { getCurrentUser } from '@/lib/auth';
import DashboardNav from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  
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

