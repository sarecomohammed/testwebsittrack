'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
  };

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href={`/${locale}/`} className={styles.logo}>
          TrakoShip
        </Link>

        <div className={styles.navLinks}>
          <Link href={`/${locale}/`} className={styles.navLink}>
            {t('nav.home')}
          </Link>
          <Link href={`/${locale}/features`} className={styles.navLink}>
            {t('nav.features')}
          </Link>
          <Link href={`/${locale}/pricing`} className={styles.navLink}>
            {t('nav.pricing')}
          </Link>
          <Link href={`/${locale}/about`} className={styles.navLink}>
            {t('nav.about')}
          </Link>
        </div>

        <div className={styles.navActions}>
          <button onClick={switchLocale} className={styles.langBtn}>
            {locale === 'en' ? 'العربية' : 'English'}
          </button>
          <Link href={`/${locale}/login`} className={styles.loginBtn}>
            {t('nav.login')}
          </Link>
          <Link href={`/${locale}/register`} className="btn btn-primary">
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </nav>
  );
}

