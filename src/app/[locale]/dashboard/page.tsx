'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { format } from 'date-fns';
import styles from './page.module.css';

interface Stats {
  totalCustomers: number;
  totalShipments: number;
  activeShipments: number;
  deliveredShipments: number;
  pendingShipments: number;
}

interface Shipment {
  id: string;
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
  };
}

export default function DashboardPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentShipments, setRecentShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data.stats);
      setRecentShipments(data.recentShipments);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className="container">
        <h1 className={styles.title}>{t('dashboard.title')}</h1>
        
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <h3>{t('dashboard.stats.totalCustomers')}</h3>
              <p className={styles.statNumber}>{stats?.totalCustomers || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statContent}>
              <h3>{t('dashboard.stats.activeShipments')}</h3>
              <p className={styles.statNumber}>{stats?.activeShipments || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <h3>{t('dashboard.stats.delivered')}</h3>
              <p className={styles.statNumber}>{stats?.deliveredShipments || 0}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>⏳</div>
            <div className={styles.statContent}>
              <h3>{t('dashboard.stats.pending')}</h3>
              <p className={styles.statNumber}>{stats?.pendingShipments || 0}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.quickActions}>
          <h2>{t('dashboard.quickActions.title')}</h2>
          <div className={styles.actionsGrid}>
            <Link href={`/${locale}/dashboard/customers`} className={styles.actionCard}>
              <span className={styles.actionIcon}>👤</span>
              <span>{t('dashboard.quickActions.addCustomer')}</span>
            </Link>
            <Link href={`/${locale}/dashboard/shipments`} className={styles.actionCard}>
              <span className={styles.actionIcon}>📦</span>
              <span>{t('dashboard.quickActions.addShipment')}</span>
            </Link>
          </div>
        </div>

        {/* Recent Shipments */}
        <div className={styles.recentShipments}>
          <h2>{t('dashboard.recentShipments')}</h2>
          <div className={styles.tableContainer}>
            <table className="table">
              <thead>
                <tr>
                  <th>{t('dashboard.shipments.trackingNumber')}</th>
                  <th>{t('dashboard.shipments.customer')}</th>
                  <th>{t('dashboard.shipments.status')}</th>
                  <th>{t('dashboard.shipments.origin')}</th>
                  <th>{t('dashboard.shipments.destination')}</th>
                  <th>{t('dashboard.shipments.date')}</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                      {locale === 'ar' ? 'لا توجد شحنات بعد' : 'No shipments yet'}
                    </td>
                  </tr>
                ) : (
                  recentShipments.map((shipment) => (
                    <tr key={shipment.id}>
                      <td>
                        <Link 
                          href={`/${locale}/track/${shipment.trackingNumber}`}
                          style={{ color: 'var(--primary-color)', fontWeight: 600 }}
                        >
                          {shipment.trackingNumber}
                        </Link>
                      </td>
                      <td>{shipment.customer.name}</td>
                      <td>
                        <span className={`badge badge-${shipment.status.toLowerCase()}`}>
                          {shipment.status}
                        </span>
                      </td>
                      <td>{shipment.origin}</td>
                      <td>{shipment.destination}</td>
                      <td>{format(new Date(shipment.createdAt), 'MMM dd, yyyy')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

