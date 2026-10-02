export function timeAgo(dateString: string | Date | null | undefined): string {
  if (!dateString) return "Never";
  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (Number.isNaN(seconds)) return "Unknown";

    if (seconds < 45) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return formatIST(date).split(" at")[0];
  } catch {
    return "Unknown";
  }
}

export function formatIST(dateString: string | Date | null | undefined): string {
  if (!dateString) return "Neural Engine";
  try {
    const isDate = dateString instanceof Date;
    const dateObj = isDate ? dateString : new Date(dateString);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    
    const parts = formatter.formatToParts(dateObj);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';
    
    const day = getPart('day');
    const month = getPart('month');
    const year = getPart('year');
    const hour = getPart('hour');
    const minute = getPart('minute');
    const dayPeriod = getPart('dayPeriod').toUpperCase();
    
    return `${month} ${day}, ${year} at ${hour}:${minute} ${dayPeriod}`;
  } catch {
    return "Unknown Time";
  }
}
