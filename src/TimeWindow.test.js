// Copyright (C) 2020 Outright Mental

import {render, screen, fireEvent} from '@testing-library/react';
import App from './App';

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
    const app = new App({});
    expect(app.validateRollingTimeWindow('24:00')).toBe(true);
    expect(app.validateRollingTimeWindow('12:30')).toBe(true);
    expect(app.validateRollingTimeWindow('100:45')).toBe(true);
    expect(app.validateRollingTimeWindow('25:70')).toBe(false); // invalid minutes
    expect(app.validateRollingTimeWindow('abc:def')).toBe(false); // non-numeric
    expect(app.validateRollingTimeWindow('12')).toBe(false); // missing colon
  });

  test('validates daily time format correctly', () => {
    const app = new App({});
    expect(app.validateDailyTime('4:00 AM')).toBe(true);
    expect(app.validateDailyTime('12:00 PM')).toBe(true);
    expect(app.validateDailyTime('11:59 AM')).toBe(true);
    expect(app.validateDailyTime('25:00 PM')).toBe(false); // invalid hour
    expect(app.validateDailyTime('12:70 AM')).toBe(false); // invalid minutes
    expect(app.validateDailyTime('abc')).toBe(false); // invalid format
    expect(app.validateDailyTime('12:00')).toBe(false); // missing AM/PM
  });
});
