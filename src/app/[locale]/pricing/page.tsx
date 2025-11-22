import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function PricingPage() {
  const t = useTranslations();
  const locale = useLocale();

  const plans = [
    {
      name: t('pricing.free.name'),
      price: 0,
      customers: t('pricing.free.customers'),
      shipments: t('pricing.free.shipments'),
      features: t('pricing.free.features'),
      support: t('pricing.free.support'),
      highlighted: false,
    },
    {
      name: t('pricing.basic.name'),
      price: 25,
      customers: t('pricing.basic.customers'),
      shipments: t('pricing.basic.shipments'),
      features: t('pricing.basic.features'),
      support: t('pricing.basic.support'),
      highlighted: true,
    },
    {
      name: t('pricing.pro.name'),
      price: 100,
      customers: t('pricing.pro.customers'),
      shipments: t('pricing.pro.shipments'),
      features: t('pricing.pro.features'),
      support: t('pricing.pro.support'),
      highlighted: false,
    },
  ];

  return (
    <>
      <Navbar />
      <div className={styles.pricingPage}>
        <section className={styles.hero}>
          <div className="container">
            <h1 className={styles.title}>{t('pricing.title')}</h1>
            <p className={styles.subtitle}>{t('pricing.subtitle')}</p>
          </div>
        </section>

        <section className={styles.content}>
          <div className="container">
            <div className={styles.pricingGrid}>
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`${styles.pricingCard} ${
                    plan.highlighted ? styles.highlighted : ''
                  }`}
                >
                  {plan.highlighted && (
                    <div className={styles.badge}>
                      {locale === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                    </div>
                  )}
                  <h2 className={styles.planName}>{plan.name}</h2>
                  <div className={styles.price}>
                    <span className={styles.priceAmount}>${plan.price}</span>
                    <span className={styles.pricePeriod}>/{t('pricing.monthly')}</span>
                  </div>
                  <ul className={styles.featuresList}>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      {plan.customers}
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      {plan.shipments}
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      {plan.features}
                    </li>
                    <li>
                      <span className={styles.checkmark}>✓</span>
                      {plan.support}
                    </li>
                  </ul>
                  <Link
                    href={`/${locale}/register`}
                    className={`btn ${
                      plan.highlighted ? 'btn-primary' : 'btn-secondary'
                    } ${styles.ctaButton}`}
                  >
                    {plan.price === 0 ? t('pricing.startTrial') : t('pricing.choosePlan')}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

