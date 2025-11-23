import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  
  return (
    <>
      <Navbar />
      <HomeContent locale={locale} />
      <Footer />
    </>
  );
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations();

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
            <p className={styles.heroSubtitle}>{t('hero.subtitle')}</p>
            <div className={styles.heroButtons}>
              <Link href={`/${locale}/register`} className="btn btn-primary btn-large">
                {t('hero.getStarted')}
              </Link>
              <Link href={`/${locale}/features`} className="btn btn-secondary btn-large">
                {t('hero.watchDemo')}
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.mockDashboard}>
              <div className={styles.mockHeader}></div>
              <div className={styles.mockBody}>
                <div className={styles.mockCard}></div>
                <div className={styles.mockCard}></div>
                <div className={styles.mockCard}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
          <p className={styles.sectionSubtitle}>{t('features.subtitle')}</p>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3 className={styles.featureTitle}>{t('features.customerManagement.title')}</h3>
              <p className={styles.featureDesc}>{t('features.customerManagement.description')}</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📦</div>
              <h3 className={styles.featureTitle}>{t('features.shipmentTracking.title')}</h3>
              <p className={styles.featureDesc}>{t('features.shipmentTracking.description')}</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔢</div>
              <h3 className={styles.featureTitle}>{t('features.autoTracking.title')}</h3>
              <p className={styles.featureDesc}>{t('features.autoTracking.description')}</p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔗</div>
              <h3 className={styles.featureTitle}>{t('features.embedWidget.title')}</h3>
              <p className={styles.featureDesc}>{t('features.embedWidget.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className={styles.whyUs}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t('whyUs.title')}</h2>
          <div className={styles.whyUsGrid}>
            <div className={styles.whyUsCard}>
              <div className={styles.whyUsIcon}>⚡</div>
              <p>{t('whyUs.speed')}</p>
            </div>
            <div className={styles.whyUsCard}>
              <div className={styles.whyUsIcon}>✨</div>
              <p>{t('whyUs.clarity')}</p>
            </div>
            <div className={styles.whyUsCard}>
              <div className={styles.whyUsIcon}>🎯</div>
              <p>{t('whyUs.simplicity')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
            <p className={styles.ctaSubtitle}>{t('cta.subtitle')}</p>
            <Link href={`/${locale}/register`} className="btn btn-primary btn-large">
              {t('cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

