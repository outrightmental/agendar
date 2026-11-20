// Copyright (C) 2026 Outright Mental

/*
 Signal: the studio's own first-party analytics (outrightmental/signal), on the landing page only.

 Two parts, kept apart:

 - Depth, for every reader, with no consent asked: the ladder of 1×1 images in public/index.html,
   which Signal's server counts with no script, no cookie and no id. The landing page scrolls inside
   #agendar-calendar, not the window, so adoptLadder() moves the ladder into the landing page's own
   positioned wrapper, where its rungs sit 200 px apart down what the reader scrolls. When a person
   signs in, React drops that wrapper and the ladder with it.

 - Journeys, only after a yes: the web client, https://signal.outright.io/w/signal.js. It shows its own
   banner, treats Global Privacy Control as a no, and sends nothing without a yes. It is loaded only
   once Google says nobody is signed in, so a page opened signed in never has it. After a sign-in on a
   page that already has it, it sends nothing more unless the reader said yes and then follows a link
   to another studio site (that link is the touch); nothing about a calendar is ever sent.

 Both happen only in a build that has REACT_APP_SIGNAL_KEY (the workflows set it, a local build does
 not), and the client only on agendar.outright.io, so a local server never counts into the stream.
 */

export const SIGNAL_KEY = process.env.REACT_APP_SIGNAL_KEY || '';
export const SIGNAL_HOST = 'agendar.outright.io';
export const SIGNAL_SRC = 'https://signal.outright.io/w/signal.js';
export const SIGNAL_INGEST = 'https://in.signal.outright.io';
export const SIGNAL_PRIVACY = 'https://outrightmental.com/privacy/';
export const SIGNAL_STUDIO = [
  'outrightmental.com', 'nickcharneykaye.com', 'fevertilt.com', 'starharvester.com', 'umlaut-hero.com',
  'conversationsimulator.com', 'docs.conversationsimulator.com', 'xjmusic.com', 'docs.xjmusic.com',
  'podcast.xjmusic.com', 'outright.io', 'agendar.outright.io', 'wetware.outright.io', 'etymolution.com',
  'makeitmoreinteresting.com', 'interesting.outright.io', 'ascendinglark.com', 'garden.ascendinglark.com',
].join(' ');

const SCRIPT_ID = 'signal-script';

/** True when this page may send to Signal: a build with the key, on the production host. */
export function signalAllowed(key = SIGNAL_KEY, hostname = window.location.hostname) {
  return !!key && hostname === SIGNAL_HOST;
}

/** True once the web client has been added to this page. */
export function signalLoaded(doc = document) {
  return !!doc.getElementById(SCRIPT_ID);
}

/**
 * Adds the web client to the page, once. Call it only when nobody is signed in.
 * Returns whether the client is on the page.
 */
export function loadSignal(doc = document, key = SIGNAL_KEY, hostname = window.location.hostname) {
  if (!signalAllowed(key, hostname)) return false;
  if (signalLoaded(doc)) return true;
  const script = doc.createElement('script');
  script.id = SCRIPT_ID;
  script.defer = true;
  script.src = SIGNAL_SRC;
  script.dataset.key = key;
  script.dataset.ingest = SIGNAL_INGEST;
  script.dataset.studio = SIGNAL_STUDIO;
  script.dataset.privacy = SIGNAL_PRIVACY;
  doc.documentElement.classList.add('signal-on');
  doc.body.appendChild(script);
  return true;
}

/** Moves the page's ladder to be the first child of `host`, a positioned element as tall as what scrolls. */
export function adoptLadder(host, doc = document) {
  if (!host) return;
  const ladder = doc.querySelector('[data-signal-depth]');
  if (!ladder || ladder.parentNode === host) return;
  host.insertBefore(ladder, host.firstChild);
}

/** "Privacy choices" links (`data-signal-choices`) show the client's banner again. */
export function onPrivacyChoices(event) {
  const link = event.target && event.target.closest ? event.target.closest('[data-signal-choices]') : null;
  if (!link) return;
  event.preventDefault();
  if (window.Signal && typeof window.Signal.choices === 'function') window.Signal.choices();
}
