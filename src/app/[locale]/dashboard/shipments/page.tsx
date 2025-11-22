'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { format } from 'date-fns';
import styles from './page.module.css';

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

interface Customer {
  id: string;
  name: string;
}

export default function ShipmentsPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    origin: '',
    destination: '',
    estimatedDelivery: '',
    notes: '',
  });
  const [updateData, setUpdateData] = useState({
    status: '',
    currentLocation: '',
  });

  useEffect(() => {
    fetchShipments();
    fetchCustomers();
  }, []);

  const fetchShipments = async () => {
    try {
      const response = await fetch('/api/shipments');
      const data = await response.json();
      setShipments(data.shipments);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers');
      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setShowModal(false);
        setFormData({
          customerId: '',
          origin: '',
          destination: '',
          estimatedDelivery: '',
          notes: '',
        });
        // Show success modal with tracking number
        setNewTrackingNumber(data.shipment.trackingNumber);
        setShowSuccessModal(true);
        fetchShipments();
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipment) return;
    
    try {
      const response = await fetch(`/api/shipments/${selectedShipment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setShowUpdateModal(false);
        setSelectedShipment(null);
        setUpdateData({ status: '', currentLocation: '' });
        fetchShipments();
      }
    } catch (error) {
      console.error('Error updating shipment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;
    
    try {
      const response = await fetch(`/api/shipments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchShipments();
      }
    } catch (error) {
      console.error('Error deleting shipment:', error);
    }
  };

  const openUpdateModal = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setUpdateData({
      status: shipment.status,
      currentLocation: '',
    });
    setShowUpdateModal(true);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const getEmbedCode = (trackingNumber: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `<!-- TrakoShip Tracking Widget -->
<iframe 
  src="${baseUrl}/embed/track/${trackingNumber}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border: 1px solid #e2e8f0; border-radius: 0.5rem;"
></iframe>`;
  };

  const getTrackingUrl = (trackingNumber: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/${locale}/track/${trackingNumber}`;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={styles.shipmentsPage}>
      <div className="container">
        <div className={styles.header}>
          <h1>{t('dashboard.shipments.title')}</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            {t('dashboard.shipments.add')}
          </button>
        </div>

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
                <th>{t('dashboard.shipments.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    No shipments yet. Create your first shipment!
                  </td>
                </tr>
              ) : (
                shipments.map((shipment) => (
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
                    <td>
                      <div className={styles.actions}>
                        <button 
                          onClick={() => openUpdateModal(shipment)} 
                          className={styles.updateBtn}
                        >
                          Update
                        </button>
                        <button 
                          onClick={() => handleDelete(shipment.id)} 
                          className={styles.deleteBtn}
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Shipment Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{t('dashboard.shipments.add')}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">{t('dashboard.shipments.customer')}</label>
                <select
                  className="form-select"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  required
                >
                  <option value="">Select customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">{t('dashboard.shipments.origin')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('dashboard.shipments.destination')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Delivery</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.estimatedDelivery}
                  onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateModal && selectedShipment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Update Shipment Status</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {selectedShipment.trackingNumber}
            </p>
            <form onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label className="form-label">{t('dashboard.shipments.status')}</label>
                <select
                  className="form-select"
                  value={updateData.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                  required
                >
                  <option value="">Select status...</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PICKED_UP">PICKED_UP</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="RETURNED">RETURNED</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Current Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={updateData.currentLocation}
                  onChange={(e) => setUpdateData({ ...updateData, currentLocation: e.target.value })}
                  placeholder="Optional"
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowUpdateModal(false)} className="btn btn-secondary">
                  {t('common.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal with Tracking Number */}
      {showSuccessModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} style={{ maxWidth: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '4rem', color: 'var(--success-color)', marginBottom: '1rem' }}>
                ✓
              </div>
              <h2 style={{ color: 'var(--success-color)', marginBottom: '0.5rem' }}>
                Shipment Created Successfully!
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Your shipment has been created and a tracking number has been generated.
              </p>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                  📦 Tracking Number:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <code style={{ 
                    flex: 1, 
                    padding: '0.75rem', 
                    background: 'white', 
                    border: '2px solid var(--primary-color)', 
                    borderRadius: '0.5rem', 
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: 'var(--primary-color)'
                  }}>
                    {newTrackingNumber}
                  </code>
                  <button 
                    onClick={() => copyToClipboard(newTrackingNumber, 'Tracking number')}
                    className="btn btn-secondary"
                    style={{ minWidth: '80px' }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                  🔗 Tracking URL:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    value={getTrackingUrl(newTrackingNumber)}
                    readOnly
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button 
                    onClick={() => copyToClipboard(getTrackingUrl(newTrackingNumber), 'Tracking URL')}
                    className="btn btn-secondary"
                    style={{ minWidth: '80px' }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.5rem' }}>
                  📋 Embed Code (Widget):
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <textarea 
                    value={getEmbedCode(newTrackingNumber)}
                    readOnly
                    rows={6}
                    style={{ 
                      flex: 1, 
                      padding: '0.75rem', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '0.5rem',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      resize: 'none'
                    }}
                  />
                  <button 
                    onClick={() => copyToClipboard(getEmbedCode(newTrackingNumber), 'Embed code')}
                    className="btn btn-secondary"
                    style={{ minWidth: '80px' }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link 
                href={`/${locale}/track/${newTrackingNumber}`}
                className="btn btn-primary"
                onClick={() => setShowSuccessModal(false)}
              >
                View Tracking Page
              </Link>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

