[![Deploy](https://github.com/outrightmental/agendar/actions/workflows/deploy.yml/badge.svg)](https://github.com/outrightmental/agendar/actions/workflows/deploy.yml)

# Agendar<sup>&trade;</sup>

**a Heads-Up Display for being on time.**

![Agendar by Outright Mental™ is a Heads-Up Display for being on time](public/images/AgendarUsage1.jpg)

In a world of remote meetings, challenges arise between the focus of working without distraction, and showing up on time for events.

It may be especially challenging for a person using a computer to shift gears from deep focus without being a second late.

Assume that I already use [Google Calendar](https://calendar.google.com/) to keep track of the events I will be attending. In order to optimize my chance of success, to cut through the tunnel vision and remain aware of events throughout the day, I mount a tablet on an arm on my desk, dedicated to displaying my agenda:

![Regular display of Google Calendar events](public/images/BeforeAgendar.jpg)

I tried this, and there was still something lacking. I want the absolute minimum amount of information, tightly centered around these principles:

* Full-screen app has a dark backdrop.
* Events are displayed in monochrome type with minimal decoration.
* Display a local time zone 24-hour clock with seconds.
* Show events from all calendars approaching within the next 24 hours.
* Display event time in terms of how far its beginning occurs from now.
* Within 1 hour of occurring, an event is highlighted in lighter gray.
* Within 10 minutes of occurring, an event is highlighted in yellow, to draw visual attention.
* Within 1 minute of occurring, an event is highlighted with an animated rainbow of all hues, to demand attention.
* Once it begins, an event is highlighted green as visual confirmation of attendance.    
* Consistent progression of visual cues conditions for enhanced punctuality.

Most crucially, there is a security requirement:

* **_Don't share my Google data!_ Use the latest Google APIs to authenticate directly from a web browser, and display events, without touching my data.**

That's exactly what Agendar is!

It's required to have [Google Calendar](https://calendar.google.com/) in order to run the app in your web browser, authenticate directly with the latest Google APIs, and display events, without touching your data:

Within 1 hour of occurring, an event is highlighted in lighter gray, and then within 10 minutes of occurring, an event is highlighted in yellow, to draw visual attention:

![Agendar by Outright Mental™ is a Heads-Up Display for being on time](public/images/AgendarUsage0.jpg)

Finally, as shown in the main photo, within 1 minute of occurring, an event is highlighted with an animated rainbow of all hues, to demand attention.

It's ***COMPLETELY FREE TO USE*** at **[agendar.outright.io](https://agendar.outright.io)**&mdash; just login with Google to display your Calendar events.

💡 **Install as a Progressive Web App (PWA)** for the best experience! See [installation instructions](#installing-agendar-as-a-pwa) below.

We never access your information!

Your browser will connect directly to Google Calendar in order display upcoming events in a unique way.

Authored by [Nick Charney Kaye](https://charneykaye.com) with &#9829; to meet the heightened strangeness of working from the internet.

Sponsored by [Outright Mental](https://outrightmental.com)<sup>&trade;</sup>

[Privacy](https://privacy.outright.io) and [Terms](https://terms.outright.io) 

## We <em>never</em> access your information!

Your browser will connect directly to Google Calendar in order display upcoming events in a unique way.

## Environment

These environment variables must be set in order to build and run the app. This can by creating an **.env** file in the root of the project, which will be ignored by git-- secrets should Never be checked in to the repository:

```
REACT_APP_GOOGLE_API_KEY=ABC
REACT_APP_GOOGLE_CLIENT_ID=123
```

These environment variables are optional (used only in production)

```
REACT_APP_GOOGLE_ANALYTICS_ID=G-123
```

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

Agendar is fully installable as a Progressive Web App (PWA)! This provides:
- **Offline support** - App shell loads offline so you can start Agendar without internet (calendar data requires connectivity)
- **App-like experience** - Install on your device and launch like a native app
- **Fast loading** - Essential assets are cached for instant startup

#### Installing Agendar as a PWA

##### On Desktop (Chrome, Edge, Brave)
1. Visit [agendar.outright.io](https://agendar.outright.io)
2. In your browser, open the address bar or main menu and look for an option like **"Install Agendar"**, **"Install app"**, or **"Install this site as an app"**
3. Select the install option and confirm to add Agendar to your applications
4. Launch Agendar from your applications menu, start menu, or desktop shortcut

##### On Mobile (iOS Safari)
1. Open [agendar.outright.io](https://agendar.outright.io) in Safari
2. Tap the **Share** button in the toolbar
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** to install
5. Launch Agendar from your home screen

##### On Mobile (Android Chrome)
1. Visit [agendar.outright.io](https://agendar.outright.io) in Chrome
2. Open the browser menu and choose **"Install app"** or **"Add to Home screen"** (wording may vary)
3. Follow the prompts to install
4. Launch Agendar from your app drawer or home screen

#### PWA Features
- **Service Worker**: Implements intelligent caching strategy
- **Offline-capable**: App shell and essential assets are precached for offline access
- **Network-only for external APIs**: Always fetches fresh calendar data directly from Google (no cached fallback)
- **Network-first for app updates**: HTML is fetched fresh when online to ensure you get the latest version
- **Cache-first for static assets**: Scripts, styles, and images load instantly from cache (limited to 50 most recent items)
- **Auto-updates**: Service worker updates automatically when new versions are deployed (takes effect after closing all tabs)

For more technical details, see: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
