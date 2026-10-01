let cachedData = {
  userPermissions: {} as any,
  customRoles: [] as any[]
};
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export const PermissionsManager = {
  load: async () => {
    if (isLoaded) return;
    if (!loadPromise) {
      loadPromise = fetch('/api/permissions')
        .then(res => res.json())
        .then(data => {
          if (data) {
            cachedData.userPermissions = data.userPermissions || {};
            cachedData.customRoles = data.customRoles || [];
          }
          isLoaded = true;
        })
        .catch(err => {
          console.error("Failed to load global permissions", err);
          isLoaded = true; // Fallback to empty so app doesn't hang
        });
    }
    return loadPromise;
  },
  
  // Also provide a way to forcefully reload (e.g., if we suspect another browser updated it)
  reload: async () => {
    loadPromise = null;
    isLoaded = false;
    return PermissionsManager.load();
  },

  getUserPermissions: () => cachedData.userPermissions,
  
  getCustomRoles: () => cachedData.customRoles,
  
  saveUserPermissions: async (userPermissions: any) => {
    cachedData.userPermissions = userPermissions;
    try {
      await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPermissions })
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('crm_permissions_updated'));
      }
    } catch (e) {
      console.error("Failed to save user permissions", e);
    }
  },
  
  saveCustomRoles: async (customRoles: any[]) => {
    cachedData.customRoles = customRoles;
    try {
      await fetch('/api/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customRoles })
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('crm_permissions_updated'));
      }
    } catch (e) {
      console.error("Failed to save custom roles", e);
    }
  }
};
