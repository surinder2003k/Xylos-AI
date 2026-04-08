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
  } catch (err) {
    return "Unknown Time";
  }
}
