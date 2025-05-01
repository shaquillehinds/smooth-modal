export function strToNumPercentage(percentage: string | number) {
  if (typeof percentage === 'number') return percentage;
  try {
    const num = parseInt(percentage, 10);
    if (isNaN(num)) throw new Error('Invalid percentage format.');
    return num;
  } catch (error) {
    throw new Error('Invalid percentage format.');
  }
}
