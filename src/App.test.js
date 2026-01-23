// Copyright (C) 2026 Outright Mental

import {render, screen, act} from '@testing-library/react';
import App from './App';

test('renders login button', () => {
  render(<App/>);
  const loginButton = screen.getByText(/login with google/i);
  expect(loginButton).toBeInTheDocument();
});

describe('Fullscreen functionality', () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;

  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  test('adds fullscreen event listeners on mount', () => {
    const {unmount} = render(<App/>);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('webkitfullscreenchange', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('mozfullscreenchange', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('MSFullscreenChange', expect.any(Function));
    
    unmount();
  });

  test('removes fullscreen event listeners on unmount', () => {
    const {unmount} = render(<App/>);
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('fullscreenchange', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('webkitfullscreenchange', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mozfullscreenchange', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('MSFullscreenChange', expect.any(Function));
  });

  test('handleFullscreenChange updates state when entering fullscreen', () => {
    const {unmount} = render(<App/>);
    
    // Mock document.fullscreenElement to simulate being in fullscreen
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: document.documentElement
    });
    
    // Trigger fullscreen change event wrapped in act
    act(() => {
      const fullscreenChangeEvent = new Event('fullscreenchange');
      document.dispatchEvent(fullscreenChangeEvent);
    });
    
    // Check that the fullscreen button shows exit icon (when isFullscreen is true)
    const fullscreenButton = document.getElementById('fullscreen-button');
    expect(fullscreenButton).toBeInTheDocument();
    expect(fullscreenButton.querySelector('title').textContent).toBe('Exit Fullscreen Mode');
    
    // Clean up
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: null
    });
    unmount();
  });

  test('handleFullscreenChange updates state when exiting fullscreen', () => {
    const {unmount} = render(<App/>);
    
    // First set to fullscreen
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: document.documentElement
    });
    
    act(() => {
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    
    // Then exit fullscreen
    Object.defineProperty(document, 'fullscreenElement', {
      writable: true,
      configurable: true,
      value: null
    });
    
    act(() => {
      document.dispatchEvent(new Event('fullscreenchange'));
    });
    
    // Check that the fullscreen button shows enter icon (when isFullscreen is false)
    const fullscreenButton = document.getElementById('fullscreen-button');
    expect(fullscreenButton).toBeInTheDocument();
    expect(fullscreenButton.querySelector('title').textContent).toBe('Enter Fullscreen Mode');
    
    unmount();
  });
});
