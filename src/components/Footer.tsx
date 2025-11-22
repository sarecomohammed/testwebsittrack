'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>TrakoShip</h3>
            <p className={styles.footerText}>
              {locale === 'ar' 
                ? 'منصة تتبع شحنات احترافية لشركات الشحن'
                : 'Professional shipment tracking platform'}
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSectionTitle}>
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className={styles.footerLinks}>
              <li><Link href={`/${locale}/`}>{t('nav.home')}</Link></li>
              <li><Link href={`/${locale}/features`}>{t('nav.features')}</Link></li>
              <li><Link href={`/${locale}/pricing`}>{t('nav.pricing')}</Link></li>
              <li><Link href={`/${locale}/about`}>{t('nav.about')}</Link></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSectionTitle}>
              {locale === 'ar' ? 'الحساب' : 'Account'}
            </h4>
            <ul className={styles.footerLinks}>
              <li><Link href={`/${locale}/login`}>{t('nav.login')}</Link></li>
              <li><Link href={`/${locale}/register`}>{t('nav.register')}</Link></li>
              <li><Link href={`/${locale}/dashboard`}>{t('nav.dashboard')}</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>&copy; {currentYear} TrakoShip. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
        </div>
      </div>
    </footer>
  );
}

