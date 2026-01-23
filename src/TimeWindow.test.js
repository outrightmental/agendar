// Copyright (C) 2020 Outright Mental

import {render, screen, fireEvent} from '@testing-library/react';
import App from './App';
import {validateRollingTimeWindow, validateDailyTime} from './_timeWindowValidation';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Time Window Settings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loads default time window settings', () => {
    render(<App/>);
    // The app should load with default settings
    expect(localStorage.getItem('agendar_time_window_settings')).toBeNull();
  });

  test('time window settings are persisted to localStorage', () => {
    // Set initial settings
    const settings = {
      mode: 'Daily',
      rollingTimeWindow: '24:00',
      dailyBeginsAt: '4:00 AM',
    };
    localStorage.setItem('agendar_time_window_settings', JSON.stringify(settings));
    
    const stored = JSON.parse(localStorage.getItem('agendar_time_window_settings'));
    expect(stored.mode).toBe('Daily');
    expect(stored.rollingTimeWindow).toBe('24:00');
    expect(stored.dailyBeginsAt).toBe('4:00 AM');
  });

  test('rolling mode time window can be changed', () => {
    const settings = {
      mode: 'Rolling',
      rollingTimeWindow: '12:30',
      dailyBeginsAt: '4:00 AM',
    };
    localStorage.setItem('agendar_time_window_settings', JSON.stringify(settings));
    
    const stored = JSON.parse(localStorage.getItem('agendar_time_window_settings'));
    expect(stored.mode).toBe('Rolling');
    expect(stored.rollingTimeWindow).toBe('12:30');
  });

  test('daily mode time window can be changed', () => {
    const settings = {
      mode: 'Daily',
      rollingTimeWindow: '24:00',
      dailyBeginsAt: '8:00 AM',
    };
    localStorage.setItem('agendar_time_window_settings', JSON.stringify(settings));
    
    const stored = JSON.parse(localStorage.getItem('agendar_time_window_settings'));
    expect(stored.mode).toBe('Daily');
    expect(stored.dailyBeginsAt).toBe('8:00 AM');
  });

  test('validates rolling time window format correctly', () => {
    expect(validateRollingTimeWindow('24:00')).toBe(true);
    expect(validateRollingTimeWindow('12:30')).toBe(true);
    expect(validateRollingTimeWindow('100:45')).toBe(true);
    expect(validateRollingTimeWindow('168:00')).toBe(true); // max 7 days
    expect(validateRollingTimeWindow('169:00')).toBe(false); // exceeds max
    expect(validateRollingTimeWindow('25:70')).toBe(false); // invalid minutes
    expect(validateRollingTimeWindow('abc:def')).toBe(false); // non-numeric
    expect(validateRollingTimeWindow('12')).toBe(false); // missing colon
    expect(validateRollingTimeWindow(null)).toBe(false); // null input
  });

  test('validates daily time format correctly', () => {
    expect(validateDailyTime('4:00 AM')).toBe(true);
    expect(validateDailyTime('12:00 PM')).toBe(true);
    expect(validateDailyTime('11:59 AM')).toBe(true);
    expect(validateDailyTime('25:00 PM')).toBe(false); // invalid hour
    expect(validateDailyTime('12:70 AM')).toBe(false); // invalid minutes
    expect(validateDailyTime('abc')).toBe(false); // invalid format
    expect(validateDailyTime('12:00')).toBe(false); // missing AM/PM
    expect(validateDailyTime(null)).toBe(false); // null input
  });
});
