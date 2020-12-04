# Additional notes on Cypress test development and execution

## Alternative way of test execution
You can use the following approach to run Cypress test.

1. Export following environment variables
```
export CYPRESS_OPTIONS_HUB_URL="https://multicloud-console..."
export CYPRESS_OPTIONS_HUB_USER=kubeadmin
export CYPRESS_OPTIONS_HUB_PASSWORD="password"
```
start_cypress_tests.sh will automatically export CYPRESS_RESOURCE_ID=$(date +"%s") to a unique timestamp, it will be used to generate uniqe resource names. However it requires the respective code to call the [getUniqueResourceName()](https://github.com/open-cluster-management/grc-ui/blob/master/tests/cypress/scripts/utils.js#L10) function. You can also overwrite it by own resource id.

2. Enter the repository and execute cypress
```
cd grc-ui
npx cypress open
```

## Unique resource identificators
As mentioned above, environment variable `CYPRESS_RESOURCE_ID` can be used to get unique resource identificators in your tests. This is handy e.g. in case you are running the same test in subsequent runs without doing a proper cleanup.

In order to generate unique identificator in your code use the following code.
```
import { getUniqueResourceName } from '../scripts/utils'

const frname = getUniqueResourceName(name)
```
e.g. `getUniqueResourceName("my-policy")` returns `my-policy-12345` when `CYPRESS_RESOURCE_ID=12345`.
e.g. `getUniqueResourceName("my-policy", '54321')` returns `my-policy-54321` with user own resource id  `54321`.

## Test configuration data
If your test needs some test data you can store them in YAML format in [tests/cypress/config](https://github.com/open-cluster-management/grc-ui/tree/master/tests/cypress/config) directory. Each `.yaml` file in this directory is loaded at start up and the content is available through an environment variable.
E.g. a content of 'demo.yaml' is available in variable `TEST_CONFIG_DEMO` and you can use any of the following approaches to assign it to a variable (dictionary).

```
const data = JSON.parse(Cypress.env('TEST_CONFIG_DEMO'))
```
or
```
import { getConfigObject } from '../config'
const data = getConfigObject('demo')
```
