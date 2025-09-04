import React, { useState, useEffect } from 'react';
import { serviceWorkerManager } from '../../lib/pwa/ServiceWorkerManager';

interface PWAStatusProps {
  className?: string;
  showDetails?: boolean;
  showCacheInfo?: boolean;
  showUpdateButton?: boolean;
  variant?: 'compact' | 'detailed' | 'card';
}

export const PWAStatus: React.FC<PWAStatusProps> = ({
  className = '',
  showDetails = true,
  showCacheInfo = true,
  showUpdateButton = true,
  variant = 'detailed'
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateInfo, setUpdateInfo] = useState<any>(null);
  const [cacheInfo, setCacheInfo] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial load
    loadStatus();
    
    // Setup event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Listen for service worker updates
    serviceWorkerManager.onUpdateAvailable((info) => {
      setUpdateInfo(info);
    });

    // Periodic status updates
    const interval = setInterval(loadStatus, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      
      // Get update info
      const updates = await serviceWorkerManager.checkForUpdates();
      setUpdateInfo(updates);
      
      // Get cache info
      if (showCacheInfo) {
        const cache = await serviceWorkerManager.getCacheInfo();
        setCacheInfo(cache);
      }
    } catch (error) {
      console.error('❌ Fout bij laden van PWA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      await serviceWorkerManager.skipWaiting();
    } catch (error) {
      console.error('❌ Fout bij updaten:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      setIsLoading(true);
      await serviceWorkerManager.clearCache();
      await loadStatus(); // Reload status
    } catch (error) {
      console.error('❌ Fout bij wissen van cache:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return '#ef4444'; // Red
    if (updateInfo?.available) return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (updateInfo?.available) return 'Update beschikbaar';
    return 'Online';
  };

  const getStatusIcon = () => {
    if (!isOnline) return '📡';
    if (updateInfo?.available) return '🔄';
    return '✅';
  };

  // Render verschillende varianten
  switch (variant) {
    case 'compact':
      return (
        <div
          className={`pwa-status-compact ${className}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: `${getStatusColor()}20`,
            border: `1px solid ${getStatusColor()}40`,
            color: getStatusColor(),
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          <span style={{ fontSize: '14px' }}>{getStatusIcon()}</span>
          <span>{getStatusText()}</span>
        </div>
      );

    case 'card':
      return (
        <div
          className={`pwa-status-card ${className}`}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}
            >
              PWA Status
            </h3>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '20px',
                background: `${getStatusColor()}20`,
                border: `1px solid ${getStatusColor()}40`,
                color: getStatusColor(),
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <span style={{ fontSize: '16px' }}>{getStatusIcon()}</span>
              <span>{getStatusText()}</span>
            </div>
          </div>

          {showDetails && (
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px'
                }}
              >
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 4px 0' }}>
                    Verbinding
                  </p>
                  <p style={{ color: '#1f2937', fontWeight: '500', margin: 0 }}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
                
                <div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 4px 0' }}>
                    Service Worker
                  </p>
                  <p style={{ color: '#1f2937', fontWeight: '500', margin: 0 }}>
                    {updateInfo?.active ? 'Actief' : 'Inactief'}
                  </p>
                </div>
                
                {updateInfo?.version && (
                  <div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 4px 0' }}>
                      Versie
                    </p>
                    <p style={{ color: '#1f2937', fontWeight: '500', margin: 0 }}>
                      {updateInfo.version.split('/').pop()?.split('?')[0] || 'Unknown'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {showCacheInfo && Object.keys(cacheInfo).length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4
                style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}
              >
                Cache Informatie
              </h4>
              
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px'
                }}
              >
                {Object.entries(cacheInfo).map(([cacheName, count]) => (
                  <div
                    key={cacheName}
                    style={{
                      padding: '8px 12px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <p style={{ color: '#6b7280', fontSize: '0.75rem', margin: '0 0 2px 0' }}>
                      {cacheName.replace('mymindventures-', '').replace('-v1', '')}
                    </p>
                    <p style={{ color: '#1f2937', fontWeight: '600', margin: 0 }}>
                      {count} items
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}
          >
            {showUpdateButton && updateInfo?.available && (
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Updaten...' : '🔄 Update installeren'}
              </button>
            )}
            
            <button
              onClick={loadStatus}
              disabled={isLoading}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isLoading ? 'Laden...' : '🔄 Vernieuwen'}
            </button>
            
            {showCacheInfo && (
              <button
                onClick={handleClearCache}
                disabled={isLoading}
                style={{
                  background: '#fef2f2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoading ? 'Wissen...' : '🗑️ Cache wissen'}
              </button>
            )}
          </div>
        </div>
      );

    case 'detailed':
    default:
      return (
        <div
          className={`pwa-status-detailed ${className}`}
          style={{
            background: 'linear-gradient(135deg, #1e293b, #334155)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}
          >
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                margin: 0,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              PWA Dashboard Status
            </h3>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderRadius: '25px',
                background: `${getStatusColor()}20`,
                border: `2px solid ${getStatusColor()}40`,
                color: getStatusColor(),
                fontSize: '1rem',
                fontWeight: '600'
              }}
            >
              <span style={{ fontSize: '20px' }}>{getStatusIcon()}</span>
              <span>{getStatusText()}</span>
            </div>
          </div>

          {showDetails && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '24px'
              }}
            >
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🌐</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Verbinding</span>
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
              
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>⚙️</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Service Worker</span>
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                  {updateInfo?.active ? 'Actief' : 'Inactief'}
                </p>
              </div>
              
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '18px' }}>📱</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Display Mode</span>
                </div>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                  {window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser'}
                </p>
              </div>
            </div>
          )}

          {showCacheInfo && Object.keys(cacheInfo).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4
                style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#e2e8f0',
                  margin: '0 0 16px 0'
                }}
              >
                💾 Cache Overzicht
              </h4>
              
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px'
                }}
              >
                {Object.entries(cacheInfo).map(([cacheName, count]) => (
                  <div
                    key={cacheName}
                    style={{
                      background: 'rgba(15, 23, 42, 0.5)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.1)',
                      textAlign: 'center'
                    }}
                  >
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 8px 0' }}>
                      {cacheName.replace('mymindventures-', '').replace('-v1', '').toUpperCase()}
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#3b82f6' }}>
                      {count}
                    </p>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '4px 0 0 0' }}>
                      items
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap'
            }}
          >
            {showUpdateButton && updateInfo?.available && (
              <button
                onClick={handleUpdate}
                disabled={isLoading}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isLoading ? 0.7 : 1,
                  transform: isLoading ? 'scale(0.98)' : 'scale(1)'
                }}
              >
                {isLoading ? 'Updaten...' : '🔄 Update installeren'}
              </button>
            )}
            
            <button
              onClick={loadStatus}
              disabled={isLoading}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '14px 28px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {isLoading ? 'Laden...' : '🔄 Status vernieuwen'}
            </button>
            
            {showCacheInfo && (
              <button
                onClick={handleClearCache}
                disabled={isLoading}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? 'Wissen...' : '🗑️ Alle cache wissen'}
              </button>
            )}
          </div>
        </div>
      );
  }
};

export default PWAStatus;
