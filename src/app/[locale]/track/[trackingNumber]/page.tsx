'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

interface TimelineItem {
  status: string;
  timestamp: string;
  location: string;
  description: string;
}

interface TrackingData {
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  currentLocation: string | null;
  estimatedDelivery: string | null;
  actualDelivery: string | null;
  timeline: TimelineItem[];
  customer: {
    name: string;
  };
  company: {
    name: string;
  };
  createdAt: string;
}

export default function TrackingPage({ params }: { params: { trackingNumber: string } }) {
  const t = useTranslations();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTrackingData();
  }, []);

  const fetchTrackingData = async () => {
    try {
      const response = await fetch(`/api/track/${params.trackingNumber}`);
      
      if (!response.ok) {
        setError('Shipment not found');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setTrackingData(data);
    } catch (err) {
      setError('Failed to fetch tracking data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.loading}>
          <div className="spinner"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !trackingData) {
    return (
      <>
        <Navbar />
        <div className={styles.error}>
          <div className="container">
            <h1>{t('tracking.notFound')}</h1>
            <p>{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.trackingPage}>
        <div className="container">
          <div className={styles.header}>
            <h1>{t('tracking.title')}</h1>
            <p className={styles.trackingNumber}>{trackingData.trackingNumber}</p>
          </div>

          <div className={styles.content}>
            {/* Status Card */}
            <div className={styles.statusCard}>
              <div className={styles.statusHeader}>
                <span className={`badge badge-${trackingData.status.toLowerCase()}`}>
                  {trackingData.status}
                </span>
                <span className={styles.companyName}>{trackingData.company.name}</span>
              </div>

              <div className={styles.statusInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('tracking.origin')}</span>
                  <span className={styles.infoValue}>{trackingData.origin}</span>
                </div>

                <div className={styles.arrow}>→</div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t('tracking.destination')}</span>
                  <span className={styles.infoValue}>{trackingData.destination}</span>
                </div>
              </div>

              {trackingData.currentLocation && (
                <div className={styles.currentLocation}>
                  <span>📍 Current Location: {trackingData.currentLocation}</span>
                </div>
              )}

              {trackingData.estimatedDelivery && (
                <div className={styles.delivery}>
                  <span>{t('tracking.estimatedDelivery')}: </span>
                  <strong>{format(new Date(trackingData.estimatedDelivery), 'MMMM dd, yyyy')}</strong>
                </div>
              )}

              {trackingData.actualDelivery && (
                <div className={styles.delivery}>
                  <span>Delivered on: </span>
                  <strong>{format(new Date(trackingData.actualDelivery), 'MMMM dd, yyyy HH:mm')}</strong>
                </div>
              )}

              <div className={styles.customerInfo}>
                <span>Customer: {trackingData.customer.name}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.timelineCard}>
              <h2>{t('tracking.timeline')}</h2>
              <div className={styles.timeline}>
                {trackingData.timeline.map((item, index) => (
                  <div key={index} className={styles.timelineItem}>
                    <div className={styles.timelineDot}></div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <span className={`badge badge-${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                        <span className={styles.timelineDate}>
                          {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                      <p className={styles.timelineLocation}>📍 {item.location}</p>
                      <p className={styles.timelineDescription}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

