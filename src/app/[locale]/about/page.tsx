import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  
  const t = useTranslations();

  return (
    <>
      <Navbar />
      <div className={styles.aboutPage}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>{t('about.title')}</h1>
          </div>
        </section>

        <section className={styles.content}>
          <div className="container">
            <div className={styles.sections}>
              <div className={styles.section}>
                <div className={styles.icon}>🎯</div>
                <h2>{t('about.mission.title')}</h2>
                <p>{t('about.mission.content')}</p>
              </div>

              <div className={styles.section}>
                <div className={styles.icon}>💡</div>
                <h2>{t('about.problem.title')}</h2>
                <p>{t('about.problem.content')}</p>
              </div>

              <div className={styles.section}>
                <div className={styles.icon}>🚀</div>
                <h2>{t('about.vision.title')}</h2>
                <p>{t('about.vision.content')}</p>
              </div>

              <div className={styles.section}>
                <div className={styles.icon}>⭐</div>
                <h2>{t('about.values.title')}</h2>
                <ul className={styles.valuesList}>
                  <li>{t('about.values.speed')}</li>
                  <li>{t('about.values.clarity')}</li>
                  <li>{t('about.values.simplicity')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

