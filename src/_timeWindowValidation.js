// Copyright (C) 2020 Outright Mental

// Validate rolling time window format (hh:mm)
export function validateRollingTimeWindow(value) {
  if (typeof value !== 'string') return false;
  const parts = value.split(':');
  if (parts.length !== 2) return false;
  const [hours, minutes] = parts.map(Number);
  // Allow up to 168 hours (7 days) for rolling window
  return !isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 168 && minutes >= 0 && minutes < 60;
}

// Validate daily time format (hh:mm AM/PM)
export function validateDailyTime(value) {
  if (typeof value !== 'string') return false;
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return false;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours >= 1 && hours <= 12 && minutes >= 0 && minutes < 60;
}
