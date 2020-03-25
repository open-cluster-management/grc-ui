# grc-ui[![Build Status](https://travis-ci.com/open-cluster-management/grc-ui.svg?token=1xoYGv8XzWhB2heDk2My&branch=master)](https://travis-ci.com/open-cluster-management/grc-ui)
The UI microservice, `grc-ui` uses the `platform-ui` environment from IBM Hybrid Cloud Manager.

## Design

The UI Platform is developed as an isomorphic react application. View the list of major components that are used to build this service:

* NodeJS
* Express
* React
* Dust
* Redux
* Webpack 3
* Babel
* Apollo/GraphQL
* Bluemix Carbon
* Jest
* Nightwatch


## Build

<pre>
export ARTIFACTORY_PWD=xxx && npm install
You can get the value of ARTIFACTORY_PWD from: https://ibm.ent.box.com/notes/287638278960
   npm run build
or npm run build:watch
or npm run build:production
</pre>

## Running

<!--for consistency purposes, I suggest that you change the section title from Running to Installation-->
1. You must configure an existing cluster to support local development. Complete the following steps: <!--The localhost redirect ui registration URL was removed by the auth team.  < is this statement needed?-->

   1. SSH into your existing cluster with the following command: `make ssh`
   2. Install `jq` if it is not already installed by running the following command: `sudo apt-get install jq -y`
   3. Run the following command to create a file with the environment variables from the `platform-ui` folder:
      `curl https://raw.github.ibm.com/IBMPrivateCloud/platform-ui/master/setup-dev.sh?token=<token> | sudo bash`
      
     * You can also copy and run the script from [IBMPrivateCloud/platform-ui repository](https://github.ibm.com/IBMPrivateCloud/platform-ui/blob/master/setup-dev.sh).

2. The following environment variables need to be set. View the [shared dev env](https://ibm.ent.box.com/notes/291748731101) to get the values. Your environment might resemble the following content:

<pre>
hcmUiApiUrl=https://localhost:4000/hcmuiapi
headerUrl
OAUTH2_CLIENT_ID
OAUTH2_CLIENT_SECRET
OAUTH2_REDIRECT_URL=https://localhost:3000/multicloud/policies/auth/callback
SERVICEACCT_TOKEN
API_SERVER_URL
</pre>

3. Start the server for production by running the following command:

<pre>
npm run start:production
</pre>

4. Start the server for development by running the following commands:

<pre>
npm run build:watch
npm run start
</pre>

5.Open a browser to `https://localhost:{httpPort}/multicloud` and log in using your cluster admin credentials.

## Storybook

To view the storybook, run the following command:

<pre>
npm run storybook
</pre>

Launch your storybook at: http://localhost:6006/.

## Testing

Run the following command to start all unit tests and selenium based tests. **Note**: It is required that the UI runs locally or can target a remote cluster to start the selenium based tests. Run the following command:

<pre>
npm run test:unit
</pre>

Before you run any end-to-end (e2e) test, set the environment parameters, `selenium_user` and `selenium_password` by running the following command:

<pre>
export SELENIUM_USER=UI_USERNAME
export SELENIUM_PASSWORD=UI_PASSWORD
</pre>

By default, e2e test runs against https://localhost:3000. You can run e2e test against a specific remote cluster. 

First, set the environment parameter, `SELENIUM_CLUSTER` by running the following command:

<pre>export SELENIUM_CLUSTER=https://target.base.url</pre>

Then run the following command to start the e2e test:

<pre>
npm run test:e2e
</pre>


## NPM Commands

View the full list of npm scripts are described in the following table:

| Command                          | Description                                                                                                                      |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| `npm start`                      | Starts the application with NODE_ENV='development'.                                                                               |
| `npm test:unit`                  | Runs jest tests.                                                                                                                |
| `npm test:update-snapshot`       | Updates snapshots for jest tests. This command should only be used if you have made changes to a component that requires an updated snapshot artifact for a test case.|
| `npm test:update-a11ySnap`       | Updates snapshots for automated a11y test in e2e test. To update a11y test snapshot, first run `npm run test:e2e` locally, then run this command to update files. Only update a11y snapshot when you make changes and make sure those a11y issues can't be fixed on our side.|
| `npm test:e2e`                   | Runs nightwatch e2e tests.                                                                                                        |
| `npm run start:production`       | Starts the application with NODE_ENV='production'.                                                                                |
| `npm run clean`                  | Deletes the generated files from public folder.                                                                                  |
| `npm run build`                  | Does a FULL development build.  (caching disabled and dev source maps)                                                           |
| `npm run build:production`       | Does a FULL production build.                                                                                                    |
| `npm run build:watch`            | Does a build of application code (w/o the DLL generation) and continues to run in the background watching for changes.            |
| `npm run build:dll`              | Only re-builds the the vendor library component.                                                                                 |
| `npm run test:install-selenium`  | Install selenium standalone for running UI tests locally. Automatically invoked when you run `npm run test:e2e`.                        |
| `npm run lint`                   | Runs linting on the code base.                                                                                                   |
| `npm run lint:fix`               | Attempts to fix any linting errors automatically.                                                                                |
| `npm run shrinkwrap:clean`       | Regenerates a clean `npm-shrinkwrap.json` - THIS COMMAND SHOULD ONLY BE USED IN EXTREME CIRCUMSTANCES.                           |
| `npm run storybook`              | Start the storybook.  |

  **Note**: The build process leverages the Dll and DllReference plugins to extract vendor plugins for faster build times and improve browser caching.  A separate bundle is created for 3rd-party client-side libraries.  The generated bundle is sourced (_public/dll.vendor.js_) along with its manifest (_vendor-manifest.json_).  If new client dependencies are added or existing versions of dependencies are updated, this module needs to be regenerated and recommitted back into source control. Run the following command  `npm run build:dll`.

## Links

These are a few useful links that provide technical reference and best practices when developing for the platform.

- [Carbon Components](https://github.com/carbon-design-system/carbon-components)
- [Carbon React Components](https://github.com/carbon-design-system/carbon-components-react)
- [Webpack](https://webpack.js.org)
- [React Docs](https://facebook.github.io/react/docs/hello-world.html)
- [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html)
- [Redux](http://redux.js.org)
- [Structuring Redux State](https://hackernoon.com/avoiding-accidental-complexity-when-structuring-your-app-state-6e6d22ad5e2a)
- [React Best Practices](https://engineering.musefind.com/our-best-practices-for-writing-react-components-dec3eb5c3fc8)
- [Smart and Dumb Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
- [Redux Best Practices](https://medium.com/@kylpo/redux-best-practices-eef55a20cc72)

