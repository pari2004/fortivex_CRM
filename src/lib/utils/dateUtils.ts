export function isWithinDateRange(dateString: string | undefined | null, filterOption: string): boolean {
  if (!dateString) return true; // Include records without a date for demo purposes
  
  const recordDate = new Date(dateString);
  if (isNaN(recordDate.getTime())) return true; // Invalid date

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const recordDateStart = new Date(recordDate);
  recordDateStart.setHours(0, 0, 0, 0);

  // If custom range format "YYYY-MM-DD to YYYY-MM-DD"
  if (filterOption.includes(' to ')) {
    const [startStr, endStr] = filterOption.split(' to ');
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    return recordDate >= startDate && recordDate <= endDate;
  }

  switch (filterOption) {
    case 'Today': {
      return recordDateStart.getTime() === today.getTime();
    }
    case 'Yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return recordDateStart.getTime() === yesterday.getTime();
    }
    case 'Last 7 Days': {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return recordDateStart >= sevenDaysAgo && recordDateStart <= today;
    }
    case 'Last 30 Days': {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return recordDateStart >= thirtyDaysAgo && recordDateStart <= today;
    }
    case 'This Month': {
      return recordDateStart.getMonth() === today.getMonth() && recordDateStart.getFullYear() === today.getFullYear();
    }
    case 'Last Month': {
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return recordDateStart.getMonth() === lastMonth.getMonth() && recordDateStart.getFullYear() === lastMonth.getFullYear();
    }
    case 'This Quarter': {
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const recordQuarter = Math.floor(recordDateStart.getMonth() / 3);
      return recordQuarter === currentQuarter && recordDateStart.getFullYear() === today.getFullYear();
    }
    case 'This Year': {
      return recordDateStart.getFullYear() === today.getFullYear();
    }
    default:
      return true;
  }
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
