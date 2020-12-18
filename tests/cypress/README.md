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
If your test needs some test data you can store them in [tests/cypress/config](https://github.com/open-cluster-management/grc-ui/tree/master/tests/cypress/config) directory or its subdirectories. Each file in this directory is loaded at start up and the content is available through an environment variable.
E.g. a content of [sample/demo-policy-raw.yaml](https://github.com/open-cluster-management/grc-ui/tree/master/tests/cypress/config/sample/demo-policy-raw.yaml) is available in variable `TEST_CONFIG_SAMPLE__DEMO_POLICY_RAW_YAML` and you can use getConfigObject(relativePath, format) function where `relativePath` is a path with respect to the `config` directory and format is the format of the actual config file.
Currently only `raw`, `txt`, `yaml` and `json` formats are supported.

```
const data = JSON.parse(Cypress.env('TEST_CONFIG_SAMPLE__DEMO_POLICY_RAW_YAML'))
```
or
```
import { getConfigObject } from '../config'
const data = getConfigObject('sample/demo-policy-raw.yaml', 'raw') --- get raw data
const data = getConfigObject('sample/demo-policy-config.yaml', 'yaml') --- get javascript object (dictionary) created from the parsed YAML configuration
const data = getConfigObject('sample/demo-policy-config.yaml') --- same as above as YAML format is autodetected from the filename suffix
```
You can also do substitutions in your configuration in order to adjust it the actual runtime environment. This can be done by passing `getConfigObject()` and optional parameter with a dictionary of regular expressions being keys and replacing text being values. You can also use function `getDefaultSubstitutionRules()` returninch such dictionary for the most commonly performed substitutions.

For example:
Having a configuration file `cluster-policy-templates.yaml` with the following content
```
local-cluster:
 - [UNAME]-example-0
```
we can use the following code
```
import { getDefaultSubstitutionRules } from '../../views/policy'
import { getConfigObject } from '../../config'
const clusterPolicyTemplates = getConfigObject('cluster-policy-tempates.yaml', 'yaml', getDefaultSubstitutionRules('my-policy'))
```
would create a dictionary matching the following object
```
{ 'local-cluster': [ 'my-policy-example-0' ] }
```

## The commonly used configuration file types
In this section we are going to present and explain configuration file types that are currently being used by cypress tests.

### cluster list
 * State: draft (used in demo)
 * Path: tests/cypress/config/clusters.yaml
 * Example: [config/demo/clusters.yaml](https://github.com/open-cluster-management/grc-ui/pull/358/files#diff-20a8e39681436d2de40012e88cf54929a00a2f38bcba179d79dbdd1a2fc76946)

This configuration file should contain details about individual imported clusters avaialable in RHACM. Ideally, it would be created by a script prior test execution according to the actual testing (e.g. canary) environment.

### raw YAML file
 * State: used in tests
 * Path: Usually stored in a subfolder under `tests/cypress/config`.
 * Example: [tests/cypress/config/certPolicyTest/test_certificate_raw.yaml](https://github.com/open-cluster-management/grc-ui/blob/master/tests/cypress/config/certPolicyTest/test_certificate_raw.yaml).

These files are used to contain a raw YAML which is being used in a test e.g. as a content of YAML editor. Substitutions can be used in order to adjust the content for the actual environment.


### policy description
 * State: used in tests
 * Path: Usually stored in a subfolder under `tests/cypress/config`.
 * Example: [config/sample/demo-policy-conf.yaml](https://github.com/open-cluster-management/grc-ui/blob/master/tests/cypress/config/sample/demo-policy-config.yaml)

This configuration file contain policy details that can be used both for policy creation and policy validation (checking that policy as respective properties). In some cases multiple policies can be specified in one file, policy name being (usually) a section header. Within a section there are various policy attributes specified.

### policy placement rule description
 * State: draft (used in demo) - in a future it may be merged with policy description described above
 * Path: Usually stored in a subfolder under `tests/cypress/config`.
 * Example: [config/sample/demo-policy-placement-rule.yaml](https://github.com/open-cluster-management/grc-ui/blob/master/tests/cypress/config/sample/demo-policy-placement-rule.yaml)

This configuration file is being used for validation of the policy placement rule at the detailed policy status page. It also contain the expected (overall) compliance status for each relevant cluster.

### violations patterns
 * State: draft (used in demo)
 * Path: [tests/cypress/config/violation-patterns.yaml](https://github.com/open-cluster-management/grc-ui/pull/358/files#diff-df2d42454a9fad5cc02820a2ef9c68b1fefcbd1a4bea58d377f4c4d22aabafca)

This is a generic purpose file containing violation message patterns (regexps) used for matching the actual vilation message in the policy status page. There is a separate section for each policy template and within a section there are multiple patterns listed, each having a numeric ID. From the policy pattern name (e.g. `comp-operator-ns`) and ID (e.g. `1`) a unique identifier for the message pattern is constructed (e.g. `comp-operator-ns-1`). Such identifiers are used for the expected cluster violation mapping described below. ID `0` is being used for the compliant message (i.e. there is no violation).
Substitutions should be used for this configuration file in order to adjust template names according to the actual environment.

### cluster violation mapping
 * State: draft (used in demo)
 * Path: Usually stored in a subfolder under `tests/cypress/config`.
 * Example: [config/demo/violations.yaml](https://github.com/open-cluster-management/grc-ui/pull/358/files#diff-c0d94b95d8eb69700ff3b76d88c9a7f6de26aa821700dd1cd845cbcf62f341ad)

The file describe violation message patterns that should be used when checking the actual violations on the detailed policy status page. There is a section per cluster and within the section there is a list of message pattern identifiers (described above) relevant for that particular cluster.
Substitutions should be used for this configuration file in order to adjust pattern identifiers according to the actual environment.
