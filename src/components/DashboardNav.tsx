'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './DashboardNav.module.css';

export default function DashboardNav() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${locale}/login`);
  };

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
  };

  return (
    <nav className={styles.dashboardNav}>
      <div className={`container ${styles.navContainer}`}>
        <Link href={`/${locale}/`} className={styles.logo}>
          TrakoShip
        </Link>

        <div className={styles.navLinks}>
          <Link 
            href={`/${locale}/dashboard`} 
            className={pathname === `/${locale}/dashboard` ? styles.active : ''}
          >
            {t('dashboard.title')}
          </Link>
          <Link 
            href={`/${locale}/dashboard/customers`}
            className={pathname.includes('/customers') ? styles.active : ''}
          >
            {t('dashboard.customers.title')}
          </Link>
          <Link 
            href={`/${locale}/dashboard/shipments`}
            className={pathname.includes('/shipments') ? styles.active : ''}
          >
            {t('dashboard.shipments.title')}
          </Link>
          <Link 
            href={`/${locale}/dashboard/settings`}
            className={pathname.includes('/settings') ? styles.active : ''}
          >
            {t('dashboard.settings.title')}
          </Link>
        </div>

        <div className={styles.navActions}>
          <button onClick={switchLocale} className={styles.langBtn}>
            {locale === 'en' ? 'عربي' : 'EN'}
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
}

