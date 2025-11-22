import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function FeaturesPage() {
  const t = useTranslations();

  return (
    <>
      <Navbar />
      <div className={styles.featuresPage}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>{t('features.title')}</h1>
            <p className={styles.subtitle}>{t('features.subtitle')}</p>
          </div>
        </section>

        <section className={styles.content}>
          <div className="container">
            <div className={styles.featuresList}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>👥</div>
                <div className={styles.featureContent}>
                  <h2>{t('features.customerManagement.title')}</h2>
                  <p>{t('features.customerManagement.description')}</p>
                  <ul>
                    <li>Add and manage customer profiles</li>
                    <li>Store contact information and addresses</li>
                    <li>Quick search and filtering</li>
                    <li>View customer shipment history</li>
                  </ul>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>📦</div>
                <div className={styles.featureContent}>
                  <h2>{t('features.shipmentTracking.title')}</h2>
                  <p>{t('features.shipmentTracking.description')}</p>
                  <ul>
                    <li>Real-time status updates</li>
                    <li>Complete shipment timeline</li>
                    <li>Multiple status stages</li>
                    <li>Delivery notifications</li>
                  </ul>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔢</div>
                <div className={styles.featureContent}>
                  <h2>{t('features.autoTracking.title')}</h2>
                  <p>{t('features.autoTracking.description')}</p>
                  <ul>
                    <li>Automatic tracking number generation</li>
                    <li>Unique IDs for every shipment</li>
                    <li>Easy to remember format</li>
                    <li>No manual entry required</li>
                  </ul>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>📊</div>
                <div className={styles.featureContent}>
                  <h2>{t('features.dashboard.title')}</h2>
                  <p>{t('features.dashboard.description')}</p>
                  <ul>
                    <li>Overview of all operations</li>
                    <li>Key statistics and metrics</li>
                    <li>Recent shipments list</li>
                    <li>Quick actions menu</li>
                  </ul>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔗</div>
                <div className={styles.featureContent}>
                  <h2>{t('features.embedWidget.title')}</h2>
                  <p>{t('features.embedWidget.description')}</p>
                  <ul>
                    <li>Simple JavaScript code snippet</li>
                    <li>Works on any website</li>
                    <li>Customizable appearance</li>
                    <li>Responsive design</li>
                  </ul>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🌍</div>
                <div className={styles.featureContent}>
                  <h2>{t('features.multilingual.title')}</h2>
                  <p>{t('features.multilingual.description')}</p>
                  <ul>
                    <li>Arabic and English interfaces</li>
                    <li>RTL layout support</li>
                    <li>Easy language switching</li>
                    <li>Translated content</li>
                  </ul>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🔌</div>
                <div className={styles.featureContent}>
                  <h2>{t('features.apiAccess.title')}</h2>
                  <p>{t('features.apiAccess.description')}</p>
                  <ul>
                    <li>RESTful API endpoints</li>
                    <li>Integrate with your systems</li>
                    <li>Secure authentication</li>
                    <li>Complete documentation (Pro plan)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

