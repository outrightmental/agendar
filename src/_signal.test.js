// Copyright (C) 2026 Outright Mental

import {adoptLadder, loadSignal, onPrivacyChoices, signalAllowed, SIGNAL_HOST, SIGNAL_SRC} from './_signal';

const KEY = 'agendar-outright-io.f709074e5b7218d57f5329e9';

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.classList.remove('signal-on');
  delete window.Signal;
});

describe('Signal', () => {
  // Issue #178: the app is sized against the viewport, which holds only while nothing above it is positioned.
  test('never positions body where script runs: the app would collapse', () => {
    const fs = require('fs');
    const path = require('path');
    const styles = fs.readdirSync(__dirname).filter((name) => /\.s?css$/.test(name))
      .map((name) => fs.readFileSync(path.join(__dirname, name), 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, ''));
    expect(styles.length).toBeGreaterThan(0);
    for (const text of styles) {
      for (const [, selector, block] of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        if (/(^|[\s,])(html|body)\s*(,|$)/.test(selector.trim())) expect(block).not.toMatch(/position\s*:\s*(relative|absolute|fixed|sticky)/);
      }
    }
    const page = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
    expect(page).toContain('<noscript><style>body { position: relative; }</style></noscript>');
    expect(page.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')).not.toMatch(/body\s*\{[^}]*position/);
  });

  test('sends only from a keyed build on the production host', () => {
    expect(signalAllowed(KEY, SIGNAL_HOST)).toBe(true);
    expect(signalAllowed(KEY, 'localhost')).toBe(false);
    expect(signalAllowed('', SIGNAL_HOST)).toBe(false);
  });

  test('loads the web client nowhere but the production host', () => {
    expect(loadSignal(document, KEY, 'localhost')).toBe(false);
    expect(document.querySelector('script')).toBeNull();
    expect(document.documentElement.classList.contains('signal-on')).toBe(false);
  });

  test('loads the web client once, with its key, the studio and the privacy page', () => {
    expect(loadSignal(document, KEY, SIGNAL_HOST)).toBe(true);
    expect(loadSignal(document, KEY, SIGNAL_HOST)).toBe(true);
    const scripts = document.querySelectorAll('script');
    expect(scripts).toHaveLength(1);
    const script = scripts[0];
    expect(script.src).toBe(SIGNAL_SRC);
    expect(script.defer).toBe(true);
    expect(script.dataset.key).toBe(KEY);
    expect(script.dataset.ingest).toBe('https://in.signal.outright.io');
    expect(script.dataset.privacy).toBe('https://outrightmental.com/privacy/');
    expect(script.dataset.studio.split(' ')).toEqual(expect.arrayContaining(['agendar.outright.io', 'outrightmental.com', 'etymolution.com']));
    expect(script.dataset.banner).toBeUndefined();
    expect(document.documentElement.classList.contains('signal-on')).toBe(true);
  });

  test('moves the ladder to the top of the landing page, and leaves it there', () => {
    document.body.innerHTML = '<div data-signal-depth></div><div id="host"><p>first</p></div>';
    const host = document.getElementById('host');
    adoptLadder(host);
    expect(host.firstChild.hasAttribute('data-signal-depth')).toBe(true);
    adoptLadder(host);
    expect(document.querySelectorAll('[data-signal-depth]')).toHaveLength(1);
    adoptLadder(null);
  });

  test('a "Privacy choices" link shows the banner again', () => {
    document.body.innerHTML = '<a href="#privacy-choices" data-signal-choices><span>Privacy choices</span></a>';
    window.Signal = {choices: jest.fn()};
    document.addEventListener('click', onPrivacyChoices);
    document.querySelector('span').click();
    document.removeEventListener('click', onPrivacyChoices);
    expect(window.Signal.choices).toHaveBeenCalledTimes(1);
  });
});
