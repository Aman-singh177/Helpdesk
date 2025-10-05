export const calculateSLA = (priority) => {
  const now = new Date();
  const hours = {
    high: 4,
    medium: 24,
    low: 48
  }[priority] || 24;

  now.setHours(now.getHours() + hours);
  return now;
};
  