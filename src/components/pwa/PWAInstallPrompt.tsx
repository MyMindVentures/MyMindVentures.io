import React, { useState, useEffect } from 'react';
import { serviceWorkerManager } from '../../lib/pwa/ServiceWorkerManager';

interface PWAInstallPromptProps {
  className?: string;
  variant?: 'banner' | 'button' | 'modal';
  showIcon?: boolean;
  showDescription?: boolean;
  autoHide?: boolean;
  autoHideDelay?: number;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  className = '',
  variant = 'banner',
  showIcon = true,
  showDescription = true,
  autoHide = true,
  autoHideDelay = 10000
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Check of install prompt beschikbaar is
    const checkInstallPrompt = () => {
      if (serviceWorkerManager.isInstallPromptAvailable()) {
        setIsVisible(true);
        setInstallPrompt(serviceWorkerManager);
      }
    };

    // Check direct
    checkInstallPrompt();

    // Luister naar install prompt events
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setIsVisible(true);
      setInstallPrompt(event);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setInstallPrompt(null);
      // Toon success message
      showSuccessMessage();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Auto-hide na delay
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isVisible, autoHide, autoHideDelay]);

  const handleInstall = async () => {
    if (!installPrompt) return;

    try {
      setIsInstalling(true);
      
      if (installPrompt.prompt) {
        await installPrompt.prompt();
        const choiceResult = await installPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ PWA installatie geaccepteerd');
          showSuccessMessage();
        } else {
          console.log('❌ PWA installatie afgewezen');
          showDismissedMessage();
        }
      } else {
        // Fallback voor service worker manager
        await serviceWorkerManager.installPWA();
      }
      
      setIsVisible(false);
    } catch (error) {
      console.error('❌ Fout bij PWA installatie:', error);
      showErrorMessage();
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    showDismissedMessage();
  };

  const showSuccessMessage = () => {
    // Toon success toast
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 600;
        animation: slideIn 0.3s ease;
      ">
        🎉 PWA succesvol geïnstalleerd!
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const showDismissedMessage = () => {
    // Toon dismissed toast
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #6b7280;
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(107, 114, 128, 0.3);
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 600;
        animation: slideIn 0.3s ease;
      ">
        ℹ️ PWA installatie afgewezen
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const showErrorMessage = () => {
    // Toon error toast
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 600;
        animation: slideIn 0.3s ease;
      ">
        ❌ Fout bij PWA installatie
      </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  if (!isVisible) return null;

  // Render verschillende varianten
  switch (variant) {
    case 'button':
      return (
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className={`pwa-install-button ${className}`}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isInstalling ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            opacity: isInstalling ? 0.7 : 1,
            transform: isInstalling ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          {showIcon && '📱'}
          {isInstalling ? 'Installeren...' : 'App installeren'}
        </button>
      );

    case 'modal':
      return (
        <div
          className={`pwa-install-modal ${className}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {showIcon && (
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}
              >
                📱
              </div>
            )}
            
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '12px',
                color: '#1f2937'
              }}
            >
              Installeer MyMindVentures.io
            </h3>
            
            {showDescription && (
              <p
                style={{
                  color: '#6b7280',
                  marginBottom: '24px',
                  lineHeight: '1.6'
                }}
              >
                Installeer deze app op je apparaat voor snelle toegang en offline functionaliteit.
              </p>
            )}
            
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}
            >
              <button
                onClick={handleDismiss}
                style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Later
              </button>
              
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isInstalling ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: isInstalling ? 0.7 : 1
                }}
              >
                {isInstalling ? 'Installeren...' : 'Installeren'}
              </button>
            </div>
          </div>
        </div>
      );

    case 'banner':
    default:
      return (
        <div
          className={`pwa-install-banner ${className}`}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #1e293b, #334155)',
            color: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flex: 1
            }}
          >
            {showIcon && (
              <div
                style={{
                  fontSize: '32px',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
              >
                📱
              </div>
            )}
            
            <div>
              <h4
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '4px',
                  color: '#f8fafc'
                }}
              >
                Installeer MyMindVentures.io
              </h4>
              
              {showDescription && (
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#cbd5e1',
                    margin: 0
                  }}
                >
                  Snelle toegang en offline functionaliteit
                </p>
              )}
            </div>
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: '8px'
            }}
          >
            <button
              onClick={handleDismiss}
              style={{
                background: 'rgba(148, 163, 184, 0.2)',
                color: '#cbd5e1',
                border: '1px solid rgba(148, 163, 184, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Later
            </button>
            
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isInstalling ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isInstalling ? 0.7 : 1
              }}
            >
              {isInstalling ? 'Installeren...' : 'Installeren'}
            </button>
          </div>
        </div>
      );
  }
};

// CSS animaties
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { 
      transform: translateY(100%); 
      opacity: 0; 
    }
    to { 
      transform: translateY(0); 
      opacity: 1; 
    }
  }
  
  .pwa-install-banner {
    animation: slideIn 0.3s ease;
  }
  
  .pwa-install-modal {
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;
document.head.appendChild(style);

export default PWAInstallPrompt;
