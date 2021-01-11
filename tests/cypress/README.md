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

### violations patterns
 * State: draft (used in demo)
 * Path: [tests/cypress/config/violation-patterns.yaml](https://github.com/open-cluster-management/grc-ui/pull/358/files#diff-df2d42454a9fad5cc02820a2ef9c68b1fefcbd1a4bea58d377f4c4d22aabafca)

This is a generic purpose file containing violation message patterns (regexps) used for matching the actual vilation message in the policy status page. There is a separate section for each policy template and within a section there are multiple patterns listed, each having a numeric ID. From the policy pattern name (e.g. `comp-operator-ns`) and ID (e.g. `1`) a unique identifier for the message pattern is constructed (e.g. `comp-operator-ns-1`). Such identifiers are used for the expected cluster violation mapping described below. ID `0` is being used for the compliant message (i.e. there is no violation).
Substitutions should be used for this configuration file in order to adjust template names according to the actual environment.

### cluster violation mapping
 * State: draft (used in demo)
 * Path: Usually stored in a subfolder under `tests/cypress/config`.
 * Example: [config/demo/violations.yaml](https://github.com/open-cluster-management/grc-ui/pull/358/files#diff-c0d94b95d8eb69700ff3b76d88c9a7f6de26aa821700dd1cd845cbcf62f341ad)

The file describe violation message patterns that should be used when checking the actual violations on the detailed policy status page. There is a section per cluster and within the section there is a list of message pattern identifiers (described above) relevant for that particular cluster. There could be also a section having "*" instead of a cluster name, meaning this is the default mapping for server that are not listed.
Substitutions should be used for this configuration file in order to adjust pattern identifiers according to the actual environment.

## Violations checking

There are few facts that must be taken into account when doing a violation check in a test:
 * Each policy may have multiple specifications
 * Each specification should map to a template with unique name. See [issue 8088](https://github.com/open-cluster-management/backlog/issues/8088) for details
 * Each template can report multiple different violations
 * Particular violation messages could vary a bit and therefore it seems reasonable to match them using regexp pattern
 * We SHOULD know which violations are expected to appear on a particular server based on its conviguration in a canary environment

In order to be able to do a violation check for a policy and server we need to capture the details above in various configuration files (see config file description above) and process them in a following manner:

 1. For each policy we get a list of policy templates (and their kind) based on a list of selected specifications in a policy configuration (stored policy description configuration file) - `getPolicyTemplatesNameAndKind()` is doing this
 2. For each cluster we store a list of expected (configured) policy violations (stored in cluster violation mapping configuration file)
 ** Each cluster violation has unique identifier in a configuration consisting of a template name and a number
 ** Each violation identifier maps to a regexp pattern matching the actual violation text
 ** Number 0 is reserved for a text expressing compliance with a specification
 3. From a list of all expected violations per server we filter out only violations relevant for particular policy - using `getViolationsPerPolicy()`. This is handy so we do not have to maintain cluster violations per policy.
 4. Once we know cluster&policy specific violations we can say what is the expected policy status (using `getClusterPolicyStatus()`) and number of non-compliant clusters (using `getViolationsCounter()`)
 ** Using respective regexp patterns we can verify respective violation texts
