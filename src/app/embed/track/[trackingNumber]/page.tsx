'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
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
  timeline: TimelineItem[];
  customer: {
    name: string;
  };
  company: {
    name: string;
  };
}

export default function EmbedTrackingPage({ params }: { params: { trackingNumber: string } }) {
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
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error || !trackingData) {
    return (
      <div className={styles.error}>
        <h2>Shipment Not Found</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.embedPage}>
      <div className={styles.header}>
        <h1 className={styles.trackingNumber}>{trackingData.trackingNumber}</h1>
        <span className={`${styles.badge} ${styles[trackingData.status.toLowerCase()]}`}>
          {trackingData.status}
        </span>
      </div>

      <div className={styles.route}>
        <div className={styles.routePoint}>
          <span className={styles.routeLabel}>From</span>
          <span className={styles.routeValue}>{trackingData.origin}</span>
        </div>
        <div className={styles.routeArrow}>→</div>
        <div className={styles.routePoint}>
          <span className={styles.routeLabel}>To</span>
          <span className={styles.routeValue}>{trackingData.destination}</span>
        </div>
      </div>

      {trackingData.currentLocation && (
        <div className={styles.currentLocation}>
          📍 Current: {trackingData.currentLocation}
        </div>
      )}

      {trackingData.estimatedDelivery && (
        <div className={styles.delivery}>
          Estimated Delivery: {format(new Date(trackingData.estimatedDelivery), 'MMM dd, yyyy')}
        </div>
      )}

      <div className={styles.timeline}>
        <h2>Tracking History</h2>
        {trackingData.timeline.map((item, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineDot}></div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineStatus}>
                <span className={`${styles.badge} ${styles[item.status.toLowerCase()]}`}>
                  {item.status}
                </span>
                <span className={styles.timelineDate}>
                  {format(new Date(item.timestamp), 'MMM dd, HH:mm')}
                </span>
              </div>
              <div className={styles.timelineLocation}>📍 {item.location}</div>
              <div className={styles.timelineDesc}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <span>Powered by <strong>TrakoShip</strong></span>
        <span className={styles.company}>{trackingData.company.name}</span>
      </div>
    </div>
  );
}

