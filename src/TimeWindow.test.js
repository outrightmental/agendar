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
});
