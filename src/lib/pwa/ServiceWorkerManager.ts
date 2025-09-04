// PWA Service Worker Manager
// Beheert service worker registratie, updates en communicatie

export interface ServiceWorkerMessage {
  type: string;
  data?: any;
  id?: string;
}

export interface ServiceWorkerUpdateInfo {
  available: boolean;
  waiting: boolean;
  installing: boolean;
  version?: string;
}

export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export class ServiceWorkerManager {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private updateFound = false;
  private installPrompt: PWAInstallPrompt | null = null;
  private updateCallbacks: Array<(info: ServiceWorkerUpdateInfo) => void> = [];
  private messageCallbacks: Map<string, (data: any) => void> = new Map();

  constructor() {
    this.init();
  }

  private async init() {
    try {
      // Check of service workers worden ondersteund
      if (!('serviceWorker' in navigator)) {
        console.warn('⚠️ Service Workers worden niet ondersteund in deze browser');
        return;
      }

      // Registreer service worker
      await this.registerServiceWorker();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Check voor install prompt
      this.checkInstallPrompt();
      
      console.log('🚀 PWA Service Worker Manager geïnitialiseerd');
    } catch (error) {
      console.error('❌ Fout bij initialiseren van Service Worker Manager:', error);
    }
  }

  private async registerServiceWorker() {
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('✅ Service Worker geregistreerd:', this.swRegistration);

      // Luister naar updates
      this.swRegistration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      // Luister naar state changes
      this.swRegistration.addEventListener('statechange', () => {
        this.handleStateChange();
      });

    } catch (error) {
      console.error('❌ Fout bij registreren van Service Worker:', error);
      throw error;
    }
  }

  private setupEventListeners() {
    // Luister naar service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event);
    });

    // Luister naar online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Luister naar beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this.installPrompt = event as PWAInstallPrompt;
      this.notifyInstallPromptAvailable();
    });

    // Luister naar appinstalled
    window.addEventListener('appinstalled', () => {
      this.handleAppInstalled();
    });
  }

  private handleUpdateFound() {
    this.updateFound = true;
    console.log('🔄 Service Worker update gevonden');
    
    const newWorker = this.swRegistration?.installing;
    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.notifyUpdateAvailable();
        }
      });
    }
  }

  private handleStateChange() {
    if (this.swRegistration?.installing) {
      console.log('📥 Service Worker wordt geïnstalleerd...');
    } else if (this.swRegistration?.waiting) {
      console.log('⏳ Service Worker wacht op activatie...');
    } else if (this.swRegistration?.active) {
      console.log('✅ Service Worker actief');
    }
  }

  private handleServiceWorkerMessage(event: MessageEvent) {
    const { type, data, id } = event.data as ServiceWorkerMessage;
    
    console.log('📨 Service Worker bericht ontvangen:', { type, data, id });

    // Handle specifieke berichten
    switch (type) {
      case 'CACHE_UPDATED':
        this.handleCacheUpdated(data);
        break;
      case 'OFFLINE_QUEUE_UPDATED':
        this.handleOfflineQueueUpdated(data);
        break;
      case 'PUSH_NOTIFICATION_RECEIVED':
        this.handlePushNotification(data);
        break;
      case 'BACKGROUND_SYNC_COMPLETED':
        this.handleBackgroundSyncCompleted(data);
        break;
      default:
        // Check voor custom message callbacks
        if (id && this.messageCallbacks.has(id)) {
          const callback = this.messageCallbacks.get(id);
          if (callback) {
            callback(data);
            this.messageCallbacks.delete(id);
          }
        }
    }
  }

  private handleOnline() {
    console.log('🌐 App is online');
    this.notifyOnlineStatus(true);
    
    // Trigger background sync als er offline operaties waren
    this.triggerBackgroundSync();
  }

  private handleOffline() {
    console.log('📡 App is offline');
    this.notifyOnlineStatus(false);
  }

  private handleInstallPrompt() {
    if (this.installPrompt) {
      this.installPrompt.prompt();
      this.installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('✅ PWA installatie geaccepteerd');
          this.notifyInstallAccepted();
        } else {
          console.log('❌ PWA installatie afgewezen');
          this.notifyInstallDismissed();
        }
        this.installPrompt = null;
      });
    }
  }

  private handleAppInstalled() {
    console.log('🎉 PWA succesvol geïnstalleerd');
    this.notifyAppInstalled();
  }

  private handleCacheUpdated(data: any) {
    console.log('💾 Cache bijgewerkt:', data);
    this.notifyCacheUpdated(data);
  }

  private handleOfflineQueueUpdated(data: any) {
    console.log('📋 Offline queue bijgewerkt:', data);
    this.notifyOfflineQueueUpdated(data);
  }

  private handlePushNotification(data: any) {
    console.log('🔔 Push notificatie ontvangen:', data);
    this.notifyPushNotification(data);
  }

  private handleBackgroundSyncCompleted(data: any) {
    console.log('🔄 Background sync voltooid:', data);
    this.notifyBackgroundSyncCompleted(data);
  }

  // Public methods
  public async checkForUpdates(): Promise<ServiceWorkerUpdateInfo> {
    if (!this.swRegistration) {
      return { available: false, waiting: false, installing: false };
    }

    try {
      await this.swRegistration.update();
      
      return {
        available: this.updateFound,
        waiting: !!this.swRegistration.waiting,
        installing: !!this.swRegistration.installing,
        version: this.swRegistration.active?.scriptURL
      };
    } catch (error) {
      console.error('❌ Fout bij checken voor updates:', error);
      return { available: false, waiting: false, installing: false };
    }
  }

  public async skipWaiting(): Promise<void> {
    if (this.swRegistration?.waiting) {
      try {
        // Stuur skip waiting bericht
        this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Wacht tot de nieuwe service worker actief is
        await new Promise<void>((resolve) => {
          const checkActive = () => {
            if (this.swRegistration?.active && this.updateFound) {
              resolve();
            } else {
              setTimeout(checkActive, 100);
            }
          };
          checkActive();
        });

        // Herlaad de pagina om de nieuwe service worker te activeren
        window.location.reload();
      } catch (error) {
        console.error('❌ Fout bij skip waiting:', error);
      }
    }
  }

  public async clearCache(): Promise<void> {
    try {
      // Stuur clear cache bericht naar service worker
      if (this.swRegistration?.active) {
        this.swRegistration.active.postMessage({ type: 'CLEAR_CACHE' });
      }

      // Clear alle caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );

      console.log('✅ Alle caches gewist');
    } catch (error) {
      console.error('❌ Fout bij wissen van caches:', error);
    }
  }

  public async getCacheInfo(): Promise<Record<string, number>> {
    try {
      const cacheNames = await caches.keys();
      const cacheInfo: Record<string, number> = {};

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheInfo[cacheName] = keys.length;
      }

      return cacheInfo;
    } catch (error) {
      console.error('❌ Fout bij ophalen van cache info:', error);
      return {};
    }
  }

  public async sendMessage(message: ServiceWorkerMessage): Promise<any> {
    if (!this.swRegistration?.active) {
      throw new Error('Service Worker niet actief');
    }

    return new Promise((resolve, reject) => {
      const messageId = Math.random().toString(36).substr(2, 9);
      
      // Setup callback voor response
      this.messageCallbacks.set(messageId, resolve);
      
      // Stuur bericht met ID
      this.swRegistration!.active!.postMessage({
        ...message,
        id: messageId
      });

      // Timeout na 10 seconden
      setTimeout(() => {
        this.messageCallbacks.delete(messageId);
        reject(new Error('Service Worker message timeout'));
      }, 10000);
    });
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications worden niet ondersteund');
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  public async subscribeToPushNotifications(vapidPublicKey: string): Promise<PushSubscription | null> {
    try {
      const permission = await this.requestNotificationPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission niet verleend');
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      console.log('✅ Push notificatie subscription succesvol');
      return subscription;
    } catch (error) {
      console.error('❌ Fout bij push notificatie subscription:', error);
      return null;
    }
  }

  public async triggerBackgroundSync(tag: string = 'ai-insights-sync'): Promise<void> {
    if (!('serviceWorker' in navigator) || !('sync' in navigator.serviceWorker)) {
      console.warn('⚠️ Background sync wordt niet ondersteund');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      console.log('🔄 Background sync geregistreerd:', tag);
    } catch (error) {
      console.error('❌ Fout bij registreren van background sync:', error);
    }
  }

  public async installPWA(): Promise<void> {
    if (this.installPrompt) {
      this.handleInstallPrompt();
    } else {
      throw new Error('Install prompt niet beschikbaar');
    }
  }

  public isInstallPromptAvailable(): boolean {
    return !!this.installPrompt;
  }

  public getUpdateInfo(): ServiceWorkerUpdateInfo {
    if (!this.swRegistration) {
      return { available: false, waiting: false, installing: false };
    }

    return {
      available: this.updateFound,
      waiting: !!this.swRegistration.waiting,
      installing: !!this.swRegistration.installing,
      version: this.swRegistration.active?.scriptURL
    };
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  // Event callbacks
  public onUpdateAvailable(callback: (info: ServiceWorkerUpdateInfo) => void): void {
    this.updateCallbacks.push(callback);
  }

  public onInstallPromptAvailable(callback: () => void): void {
    // Implementeer event system
  }

  public onOnlineStatusChange(callback: (online: boolean) => void): void {
    // Implementeer event system
  }

  public onCacheUpdated(callback: (data: any) => void): void {
    // Implementeer event system
  }

  public onOfflineQueueUpdated(callback: (data: any) => void): void {
    // Implementeer event system
  }

  public onPushNotification(callback: (data: any) => void): void {
    // Implementeer event system
  }

  public onBackgroundSyncCompleted(callback: (data: any) => void): void {
    // Implementeer event system
  }

  public onInstallAccepted(callback: () => void): void {
    // Implementeer event system
  }

  public onInstallDismissed(callback: () => void): void {
    // Implementeer event system
  }

  public onAppInstalled(callback: () => void): void {
    // Implementeer event system
  }

  // Private notification methods
  private notifyUpdateAvailable(): void {
    this.updateCallbacks.forEach(callback => {
      callback(this.getUpdateInfo());
    });
  }

  private notifyInstallPromptAvailable(): void {
    // Implementeer event notification
  }

  private notifyOnlineStatus(online: boolean): void {
    // Implementeer event notification
  }

  private notifyCacheUpdated(data: any): void {
    // Implementeer event notification
  }

  private notifyOfflineQueueUpdated(data: any): void {
    // Implementeer event notification
  }

  private notifyPushNotification(data: any): void {
    // Implementeer event notification
  }

  private notifyBackgroundSyncCompleted(data: any): void {
    // Implementeer event notification
  }

  private notifyInstallAccepted(): void {
    // Implementeer event notification
  }

  private notifyInstallDismissed(): void {
    // Implementeer event notification
  }

  private notifyAppInstalled(): void {
    // Implementeer event notification
  }

  // Utility methods
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private checkInstallPrompt() {
    // Check of install prompt beschikbaar is
    if (this.installPrompt) {
      this.notifyInstallPromptAvailable();
    }
  }
}

// Export singleton instance
export const serviceWorkerManager = new ServiceWorkerManager();
