export const formatNumber = (num: number, precision: number = 5) => {
  const absNum = Math.abs(num);
  
  if (absNum >= 1000000000000) {
    return (num / 1000000000000).toFixed(2) + 'T';
  }
  if (absNum >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (absNum >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (absNum >= 1000) {
    return (num / 1000).toFixed(2) + 'K';
  }
  
  return num.toFixed(precision);
};
