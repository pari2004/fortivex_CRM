'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BusinessDay {
  day: string;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
}

export interface NotificationsConfig {
  newLead: boolean;
  demoReminder: boolean;
  paymentReminder: boolean;
  studentRegistration: boolean;
  newAdmission: boolean;
  taskReminder: boolean;
  whatsapp: boolean;
  email: boolean;
  systemAlerts: boolean;
}

export interface AppearanceConfig {
  theme: string;
  accent: string;
  sidebar: string;
  density: string;
  fontSize: string;
  animations: boolean;
  glassEffect: boolean;
  smoothScroll: boolean;
  dashboardBackground: string;
}

export interface ApiKeyConfig {
  id: string;
  name: string;
  serviceName: string;
  key: string;
  env: 'Development' | 'Production';
  status: 'Connected' | 'Disconnected';
  lastUpdated: string;
  lastTested: string;
  description: string;
}

export interface BackupRecord {
  id: string;
  name: string;
  date: string;
  createdBy: string;
  size: string;
  status: 'Completed' | 'Failed' | 'In Progress';
}

export interface BackupSettings {
  autoBackup: boolean;
  frequency: string;
}

interface SettingsContextType {
  companyLogo: string | null;
  updateCompanyLogo: (logo: string) => void;
  businessHours: BusinessDay[];
  updateBusinessHours: (hours: BusinessDay[]) => void;
  notifications: NotificationsConfig;
  updateNotifications: (notifs: NotificationsConfig) => void;
  resetNotifications: () => void;
  appearance: AppearanceConfig;
  updateAppearance: (app: AppearanceConfig) => void;
  apiKeys: ApiKeyConfig[];
  updateApiKeys: (keys: ApiKeyConfig[]) => void;
  backups: BackupRecord[];
  updateBackups: (records: BackupRecord[]) => void;
  backupSettings: BackupSettings;
  updateBackupSettings: (settings: BackupSettings) => void;
}

const DEFAULT_HOURS: BusinessDay[] = [
  { day: 'Monday', isOpen: true, openingTime: '09:00', closingTime: '18:30' },
  { day: 'Tuesday', isOpen: true, openingTime: '09:00', closingTime: '18:30' },
  { day: 'Wednesday', isOpen: true, openingTime: '09:00', closingTime: '18:30' },
  { day: 'Thursday', isOpen: true, openingTime: '09:00', closingTime: '18:30' },
  { day: 'Friday', isOpen: true, openingTime: '09:00', closingTime: '18:30' },
  { day: 'Saturday', isOpen: true, openingTime: '09:00', closingTime: '13:00' },
  { day: 'Sunday', isOpen: false, openingTime: '', closingTime: '' },
];

const DEFAULT_NOTIFS: NotificationsConfig = {
  newLead: true,
  demoReminder: true,
  paymentReminder: true,
  studentRegistration: true,
  newAdmission: true,
  taskReminder: true,
  whatsapp: true,
  email: true,
  systemAlerts: true
};

const DEFAULT_APPEARANCE: AppearanceConfig = {
  theme: 'dark',
  accent: 'blue',
  sidebar: 'expanded',
  density: 'comfortable',
  fontSize: 'medium',
  animations: true,
  glassEffect: true,
  smoothScroll: true,
  dashboardBackground: 'default'
};

const DEFAULT_API_KEYS: ApiKeyConfig[] = [
    { id: '1', name: 'Gemini Primary', serviceName: 'Google Gemini API', key: 'AIzaSyDemoKey****************', env: 'Production', status: 'Connected', lastUpdated: 'Today', lastTested: 'Today', description: 'Primary AI generation key.' },
  { id: '2', name: 'OpenAI Fallback', serviceName: 'OpenAI API', key: 'sk-demo****************', env: 'Production', status: 'Disconnected', lastUpdated: '1 Week Ago', lastTested: '1 Week Ago', description: 'Fallback model.' },
  { id: '3', name: 'Outlook Calendar', serviceName: 'Microsoft Outlook API', key: 'ms-graph-outlook****************', env: 'Production', status: 'Disconnected', lastUpdated: 'Never', lastTested: 'Never', description: 'Calendar and email sync.' },
  { id: '4', name: 'Teams Meetings', serviceName: 'Microsoft Teams API', key: 'ms-graph-teams****************', env: 'Production', status: 'Disconnected', lastUpdated: 'Never', lastTested: 'Never', description: 'Teams meeting creation and sync.' },
];

const DEFAULT_BACKUPS: BackupRecord[] = [
  { id: '1', name: 'backup_full_2026-08-04.zip', date: 'Aug 04, 2026 02:00 AM', createdBy: 'System', size: '1.2 GB', status: 'Completed' },
  { id: '2', name: 'backup_full_2026-08-03.zip', date: 'Aug 03, 2026 02:00 AM', createdBy: 'System', size: '1.18 GB', status: 'Completed' },
];

const DEFAULT_BACKUP_SETTINGS: BackupSettings = {
  autoBackup: true,
  frequency: 'Daily'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessDay[]>(DEFAULT_HOURS);
  const [notifications, setNotifications] = useState<NotificationsConfig>(DEFAULT_NOTIFS);
  const [appearance, setAppearance] = useState<AppearanceConfig>(DEFAULT_APPEARANCE);
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>(DEFAULT_API_KEYS);
  const [backups, setBackups] = useState<BackupRecord[]>(DEFAULT_BACKUPS);
  const [backupSettings, setBackupSettings] = useState<BackupSettings>(DEFAULT_BACKUP_SETTINGS);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('fortivex_logo');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedLogo) setCompanyLogo(savedLogo);

      const savedHours = localStorage.getItem('fortivex_hours');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedHours) setBusinessHours(JSON.parse(savedHours));

      const savedNotifs = localStorage.getItem('fortivex_notifs');
      if (savedNotifs) setNotifications(JSON.parse(savedNotifs));

      const savedApp = localStorage.getItem('fortivex_appearance');
      if (savedApp) setAppearance(JSON.parse(savedApp));

      const savedApiKeys = localStorage.getItem('fortivex_api_keys');
      if (savedApiKeys) setApiKeys(JSON.parse(savedApiKeys));

      const savedBackups = localStorage.getItem('fortivex_backups');
      if (savedBackups) setBackups(JSON.parse(savedBackups));

      const savedBackupSettings = localStorage.getItem('fortivex_backup_settings');
      if (savedBackupSettings) setBackupSettings(JSON.parse(savedBackupSettings));
    } catch (e) {
      console.error('Failed to load settings', e);
    }
    setIsInitializing(false);
  }, []);

  // Apply appearance side-effects (CSS variables)
  useEffect(() => {
    if (isInitializing) return;
    
    // Apply accent color
    const root = document.documentElement;
    const accentColors: Record<string, string> = {
      blue: '#2563eb',
      purple: '#8b5cf6',
      green: '#10b981',
      orange: '#f59e0b',
      cyan: '#06b6d4',
      red: '#ef4444',
      pink: '#ec4899',
      indigo: '#6366f1',
      teal: '#14b8a6',
    };
    root.style.setProperty('--primary-color', accentColors[appearance.accent] || accentColors.blue);
    
    // Apply theme (could append class to body)
    document.body.classList.remove('light-theme', 'dark-theme');
    
    let activeTheme = appearance.theme;
    if (activeTheme === 'system') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (activeTheme === 'light') {
      document.body.classList.add('light-theme');
    } else if (activeTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }

    // Apply dashboard background if base64 (we'll store it as a CSS var and use it in DynamicBackground)
    if (appearance.dashboardBackground.startsWith('data:image')) {
      root.style.setProperty('--custom-dashboard-bg', `url(${appearance.dashboardBackground})`);
    } else {
      root.style.removeProperty('--custom-dashboard-bg');
    }
    
    
    // Smooth scroll
    if (appearance.smoothScroll) {
      document.documentElement.style.setProperty('--scroll-behavior', 'smooth');
    } else {
      document.documentElement.style.setProperty('--scroll-behavior', 'auto');
    }

    // Glass effect
    if (appearance.glassEffect) {
      document.body.classList.remove('no-glass');
    } else {
      document.body.classList.add('no-glass');
    }

  }, [appearance, isInitializing]);

  const updateCompanyLogo = (logo: string) => {
    setCompanyLogo(logo);
    localStorage.setItem('fortivex_logo', logo);
  };

  const updateBusinessHours = (hours: BusinessDay[]) => {
    setBusinessHours(hours);
    localStorage.setItem('fortivex_hours', JSON.stringify(hours));
  };

  const updateNotifications = (notifs: NotificationsConfig) => {
    setNotifications(notifs);
    localStorage.setItem('fortivex_notifs', JSON.stringify(notifs));
  };

  const resetNotifications = () => {
    setNotifications(DEFAULT_NOTIFS);
    localStorage.removeItem('fortivex_notifs');
  };

  const updateAppearance = (app: AppearanceConfig) => {
    setAppearance(app);
    localStorage.setItem('fortivex_appearance', JSON.stringify(app));
  };

  const updateApiKeys = (keys: ApiKeyConfig[]) => {
    setApiKeys(keys);
    localStorage.setItem('fortivex_api_keys', JSON.stringify(keys));
  };

  const updateBackups = (records: BackupRecord[]) => {
    setBackups(records);
    localStorage.setItem('fortivex_backups', JSON.stringify(records));
  };

  const updateBackupSettings = (settings: BackupSettings) => {
    setBackupSettings(settings);
    localStorage.setItem('fortivex_backup_settings', JSON.stringify(settings));
  };

  if (isInitializing) return null; // Avoid hydration mismatch

  return (
    <SettingsContext.Provider value={{
      companyLogo, updateCompanyLogo,
      businessHours, updateBusinessHours,
      notifications, updateNotifications, resetNotifications,
      appearance, updateAppearance,
      apiKeys, updateApiKeys,
      backups, updateBackups,
      backupSettings, updateBackupSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
