'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

interface User {
  id: string;
  email: string;
  companyName: string;
  plan: string;
  createdAt: string;
}

export default function SettingsPage() {
  const t = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label?: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label || 'Code'} copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className={styles.settingsPage}>
      <div className="container">
        <h1>{t('dashboard.settings.title')}</h1>

        {/* Company Profile */}
        <div className={styles.section}>
          <h2>{t('dashboard.settings.profile')}</h2>
          <div className={styles.card}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Company Name:</span>
              <span className={styles.value}>{user.companyName}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{user.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Member Since:</span>
              <span className={styles.value}>
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className={styles.section}>
          <h2>{t('dashboard.settings.plan')}</h2>
          <div className={styles.card}>
            <div className={styles.planBadge}>
              <span className={`badge badge-${user.plan.toLowerCase()}`}>
                {user.plan}
              </span>
            </div>
            <div className={styles.planInfo}>
              {user.plan === 'FREE' && (
                <>
                  <p>✓ 50 Customers</p>
                  <p>✓ 500 Shipments</p>
                  <p>✓ Basic Features</p>
                </>
              )}
              {user.plan === 'BASIC' && (
                <>
                  <p>✓ 200 Customers</p>
                  <p>✓ 2,000 Shipments</p>
                  <p>✓ All Features</p>
                  <p>✓ Email Support</p>
                </>
              )}
              {user.plan === 'PRO' && (
                <>
                  <p>✓ Unlimited Customers</p>
                  <p>✓ Unlimited Shipments</p>
                  <p>✓ All Features + API</p>
                  <p>✓ Priority Support</p>
                </>
              )}
            </div>
            {user.plan !== 'PRO' && (
              <button className="btn btn-primary mt-3">
                {t('dashboard.settings.upgrade')}
              </button>
            )}
          </div>
        </div>

        {/* Tracking Widget - Single Unified Code */}
        <div className={styles.section}>
          <h2>🔍 Tracking Widget for Your Website</h2>
          <div className={styles.card}>
            <p className={styles.description}>
              <strong>Add a tracking widget to your website!</strong> Your customers can search and track their shipments directly from your site. 
              The widget displays YOUR company name (<strong>{user.companyName}</strong>) and shows ONLY your shipments - fully white-labeled with no TrakoShip branding.
            </p>
            
            <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '0.5rem', marginTop: '1.5rem', marginBottom: '2rem', border: '2px solid #0ea5e9' }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '1.1rem', color: '#0369a1' }}>📌 Your Company ID:</strong>
              </div>
              <code style={{ 
                display: 'block', 
                padding: '0.75rem 1rem', 
                background: 'white', 
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                color: '#2563eb',
                wordBreak: 'break-all',
                border: '1px solid #bae6fd'
              }}>
                {user.id}
              </code>
              <button
                onClick={() => copyToClipboard(user.id, 'Company ID')}
                className="btn btn-secondary"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem', marginTop: '1rem' }}
              >
                📋 Copy ID
              </button>
            </div>

            {/* Inline Widget Option */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📦</span> Tracking Widget Code
              </h3>
              <p className={styles.description}>
                Embeds a search box directly in your webpage. Customers search and see results inline. Perfect for a dedicated tracking page.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <a 
                  href={`/embed/search?userId=${user.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem', textDecoration: 'none' }}
                >
                  👁️ Preview Widget
                </a>
              </div>
              <div className={styles.codeContainer}>
                <pre className={styles.codeBlock}>{`<!-- TrakoShip Tracking Widget - Inline Mode -->
<script>
  window.TrakoShipConfig = {
    mode: 'inline',
    userId: '${user.id}',
    containerId: 'trakoship-search'
  };
</script>
<script src="/widget.js"></script>
<div id="trakoship-search"></div>`}</pre>
                <button 
                  onClick={() => copyToClipboard(`<!-- TrakoShip Tracking Widget - Inline Mode -->
<script>
  window.TrakoShipConfig = {
    mode: 'inline',
    userId: '${user.id}',
    containerId: 'trakoship-search'
  };
</script>
<script src="/widget.js"></script>
<div id="trakoship-search"></div>`, 'Inline widget code')} 
                  className={styles.copyBtn}
                >
                  📋 Copy Code
                </button>
              </div>
            </div>

            {/* Key Features */}
            <div style={{ background: '#fef3c7', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #f59e0b' }}>
              <strong style={{ fontSize: '1.05rem', color: '#92400e' }}>✨ Key Features:</strong>
              <ul style={{ marginTop: '0.75rem', marginBottom: 0, paddingLeft: '1.5rem', color: '#78350f' }}>
                <li style={{ marginBottom: '0.5rem' }}>Shows YOUR company name: <strong>{user.companyName}</strong></li>
                <li style={{ marginBottom: '0.5rem' }}>Customers can ONLY see YOUR shipments (secure & isolated)</li>
                <li style={{ marginBottom: '0.5rem' }}>No TrakoShip branding visible (White Label)</li>
                <li style={{ marginBottom: '0.5rem' }}>Professional, modern design</li>
                <li>Fully responsive (mobile & desktop)</li>
              </ul>
            </div>

            {/* Security Note */}
            <div style={{ background: '#dcfce7', padding: '1.25rem', borderRadius: '0.5rem', marginTop: '1.5rem', border: '1px solid #22c55e' }}>
              <strong style={{ fontSize: '1.05rem', color: '#166534' }}>🔒 Security & Privacy:</strong>
              <p style={{ marginTop: '0.5rem', marginBottom: 0, color: '#15803d', lineHeight: '1.6' }}>
                Your Company ID (<code style={{ background: 'white', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>{user.id}</code>) ensures that customers using your widget can ONLY track shipments that belong to YOUR company. 
                They cannot see or access shipments from other companies, even if they know the tracking number.
              </p>
            </div>
          </div>
        </div>

        {/* API Key (Pro Plan only) */}
        {user.plan === 'PRO' && (
          <div className={styles.section}>
            <h2>{t('dashboard.settings.apiKey')}</h2>
            <div className={styles.card}>
              <p className={styles.description}>
                Use this API key to integrate TrakoShip with your applications.
              </p>
              <div className={styles.apiKeyBox}>
                <code>tk_live_xxxxxxxxxxxxxxxxxx</code>
                <button className="btn btn-secondary">
                  Generate New Key
                </button>
              </div>
              <p className={styles.warning}>
                ⚠️ Keep your API key secure. Do not share it publicly.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
