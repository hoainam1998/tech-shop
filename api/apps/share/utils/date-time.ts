type DateTimeAttributesType = {
  year: number;
  month: number;
  date: number;
  hour: number;
  minutes: number;
};

/**
 * Get a few datetime object attributes.
 * @param {Date} date - The datetime object input.
 * @returns {DateTimeAttributesType} A groups datetime attributes.
 */
const getDateTimeAttributes = (date: Date): DateTimeAttributesType => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    hour: date.getHours(),
    minutes: date.getMinutes(),
  };
};

/**
 * Format current datetime.
 * @returns {string} The datetime formatted.
 */
const formatCurrentDateTime = (): string => {
  const { date, month, year, hour, minutes } = getDateTimeAttributes(new Date());
  return `${date}-${month}-${year} ${hour}h${minutes}`;
};

/**
 * Format specific datetime.
 * @param {Date} specificDate - A specific datetime.
 * @returns {string} The datetime formatted.
 */
const formatSpecificDateTime = (specificDate: Date): string => {
  const dateObj = new Date(specificDate);
  const { date, month, year, hour, minutes } = getDateTimeAttributes(dateObj);
  return `${date}-${month}-${year} ${hour}:${minutes}`;
};

export { formatCurrentDateTime, formatSpecificDateTime };
