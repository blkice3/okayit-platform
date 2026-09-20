
// Offline storage utilities using IndexedDB for mobile app

interface OfflineData {
  id: string;
  type: 'progress' | 'user-data' | 'content' | 'settings';
  data: any;
  timestamp: number;
  syncStatus: 'pending' | 'synced' | 'error';
}

interface UserProgress {
  userId: string;
  sectionProgress: Record<string, number>;
  completedSlides: number[];
  achievements: string[];
  lastAccessed: number;
}

interface OfflineContent {
  id: string;
  type: 'audio' | 'image' | 'text';
  url: string;
  blob?: Blob;
  cached: boolean;
}

class OfflineStorageManager {
  private dbName = 'QRHouseTourDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async initialize(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        resolve(false);
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log('IndexedDB initialized successfully');
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('offlineData')) {
          const store = db.createObjectStore('offlineData', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('syncStatus', 'syncStatus', { unique: false });
        }

        if (!db.objectStoreNames.contains('userProgress')) {
          db.createObjectStore('userProgress', { keyPath: 'userId' });
        }

        if (!db.objectStoreNames.contains('offlineContent')) {
          const contentStore = db.createObjectStore('offlineContent', { keyPath: 'id' });
          contentStore.createIndex('type', 'type', { unique: false });
          contentStore.createIndex('cached', 'cached', { unique: false });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // User Progress Management
  async saveUserProgress(progress: UserProgress): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['userProgress'], 'readwrite');
      const store = transaction.objectStore('userProgress');
      const request = store.put({
        ...progress,
        lastAccessed: Date.now()
      });

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  async getUserProgress(userId: string): Promise<UserProgress | null> {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['userProgress'], 'readonly');
      const store = transaction.objectStore('userProgress');
      const request = store.get(userId);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => resolve(null);
    });
  }

  // Offline Content Caching
  async cacheContent(content: OfflineContent): Promise<boolean> {
    if (!this.db) return false;

    try {
      // Download content if not cached
      if (!content.cached && content.url) {
        const response = await fetch(content.url);
        const blob = await response.blob();
        content.blob = blob;
        content.cached = true;
      }

      return new Promise((resolve) => {
        const transaction = this.db!.transaction(['offlineContent'], 'readwrite');
        const store = transaction.objectStore('offlineContent');
        const request = store.put(content);

        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    } catch (error) {
      console.error('Failed to cache content:', error);
      return false;
    }
  }

  async getCachedContent(id: string): Promise<OfflineContent | null> {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['offlineContent'], 'readonly');
      const store = transaction.objectStore('offlineContent');
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.blob) {
          // Convert blob to URL for use
          result.url = URL.createObjectURL(result.blob);
        }
        resolve(result || null);
      };
      request.onerror = () => resolve(null);
    });
  }

  async getAllCachedContent(): Promise<OfflineContent[]> {
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['offlineContent'], 'readonly');
      const store = transaction.objectStore('offlineContent');
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        // Convert blobs to URLs
        results.forEach((content: OfflineContent) => {
          if (content.blob) {
            content.url = URL.createObjectURL(content.blob);
          }
        });
        resolve(results);
      };
      request.onerror = () => resolve([]);
    });
  }

  // Settings Management
  async saveSetting(key: string, value: any): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key, value, timestamp: Date.now() });

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => resolve(null);
    });
  }

  // Sync Management
  async getPendingSync(): Promise<OfflineData[]> {
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const index = store.index('syncStatus');
      const request = index.getAll('pending');

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  }

  async markAsSynced(id: string): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.syncStatus = 'synced';
          const putRequest = store.put(data);
          putRequest.onsuccess = () => resolve(true);
          putRequest.onerror = () => resolve(false);
        } else {
          resolve(false);
        }
      };
      getRequest.onerror = () => resolve(false);
    });
  }

  // Cache Management
  async clearCache(): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['offlineContent'], 'readwrite');
      const store = transaction.objectStore('offlineContent');
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Cache cleared successfully');
        resolve(true);
      };
      request.onerror = () => resolve(false);
    });
  }

  async getCacheSize(): Promise<number> {
    if (!this.db) return 0;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction(['offlineContent'], 'readonly');
      const store = transaction.objectStore('offlineContent');
      const request = store.getAll();

      request.onsuccess = () => {
        const contents = request.result || [];
        let totalSize = 0;
        contents.forEach((content: OfflineContent) => {
          if (content.blob) {
            totalSize += content.blob.size;
          }
        });
        resolve(totalSize);
      };
      request.onerror = () => resolve(0);
    });
  }
}

// Pre-cache essential content for offline use
export const preloadEssentialContent = async () => {
  const storage = new OfflineStorageManager();
  const initialized = await storage.initialize();
  
  if (!initialized) {
    console.error('Failed to initialize offline storage');
    return false;
  }

  const essentialContent: OfflineContent[] = [
    {
      id: 'welcome-audio',
      type: 'audio',
      url: '/audio/welcome.mp3',
      cached: false
    },
    {
      id: 'broken-mirrors-audio',
      type: 'audio',
      url: '/audio/BROKEN MIRRORS.mp3',
      cached: false
    },
    {
      id: 'once-upon-time-audio',
      type: 'audio',
      url: '/audio/Once upon a time....mp3',
      cached: false
    },
    {
      id: 'inside-voices-audio',
      type: 'audio',
      url: '/audio/Inside Voices.mp3',
      cached: false
    }
  ];

  let cachedCount = 0;
  for (const content of essentialContent) {
    const success = await storage.cacheContent(content);
    if (success) cachedCount++;
  }

  console.log(`Cached ${cachedCount}/${essentialContent.length} essential content items`);
  return cachedCount > 0;
};

// Export singleton instance
export const offlineStorage = new OfflineStorageManager();
