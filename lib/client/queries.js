/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019, 2020. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import gql from 'graphql-tag'

export const userAccess = gql`
  query userAccess($resource: String!, $action: String!, $namespace: String, $apiGroup: String){
    userAccess(resource: $resource, action: $action, namespace: $namespace, apiGroup: $apiGroup)
  }
`

export const HCMNodeList = gql`
  query getNodes {
    items: nodes {
      architecture
      capacity {
        cpu
      }
      cluster {
        metadata {
          name
        }
      }
      metadata {
        creationTimestamp
        labels
        name
      }
      osImage
      roles
    }
  }
`

export const HCMApplicationList = gql`
  query getApplications {
    applications {
      uid
      name
      namespace
      policies {
        uid
        name
        namespace
        clusters {
          name
        }
      }
    }
  }
`

export const createPolicy = gql`
  mutation createPolicy($resources: [JSON]!) {
    createPolicy(resources: $resources)
  }
`

export const createCompliance = gql`
  mutation createCompliance($resources: [JSON]!) {
    createCompliance(resources: $resources)
  }
`

export const createApplication = gql`
  mutation createApplication($resources: [JSON]!) {
    createApplication(resources: $resources)
  }
`

export const createResources = gql`
  mutation createResources($resources: [JSON]!) {
    createResources(resources: $resources)
  }
`

export const updateResourceLabels = gql`
  mutation updateResourceLabels($resourceType: String!, $namespace: String!, $name: String!, $body: JSON, $selfLink: String, $resourcePath: String) {
    updateResourceLabels(resourceType: $resourceType, namespace: $namespace, name: $name, body: $body, selfLink: $selfLink, resourcePath: $resourcePath)
  }
`

export const removeQuery = gql`
  mutation deleteQuery($resource: JSON!) {
    deleteQuery(resource: $resource)
  }
`

export const updateResource = gql`
  mutation updateResource($resourceType: String!, $namespace: String!, $name: String!, $body: JSON, $selfLink: String, $resourcePath: String) {
    updateResource(resourceType: $resourceType, namespace: $namespace, name: $name, body: $body, selfLink: $selfLink, resourcePath: $resourcePath)
  }
`

export const deleteCompliance = gql`
  mutation deleteCompliance($selfLink: String!, $resources: JSON) {
    deleteCompliance(selfLink: $selfLink, resources: $resources)
  }
`
export const deleteOccurrences = gql`
  mutation deleteOccurrences($selfLink: String!) {
    deleteOccurrences(selfLink: $selfLink)
  }
`

export const PlacementBinding = gql`
  query getPlacementBindings($parent: JSON!) {
    placementBindings: placementBindings(parent: $parent) {
      metadata {
        name
        resourceVersion
        selfLink
      }
    }
  }
`

export const PlacementRule = gql`
  query getPlacementRules($parent: JSON!) {
    placementRules: placementRules(parent: $parent) {
      metadata {
        name
        resourceVersion
        selfLink
      }
    }
  }
`

export const HCMPolicyList = gql`
  query getPolicies {
    items: policies {
      metadata {
        name
        namespace
      }
      status
      enforcement
    }
  }
`

export const HCMPolicy = gql`
  query getPolicies($name: String!, $clusterName: String) {
    policies: policies(name: $name, clusterName: $clusterName) {
      cluster
      metadata {
        name
        namespace
        selfLink
        creationTimestamp
        annotations
        labels
        resourceVersion
        uid
      }
      status
      enforcement
      raw
      roleTemplates {
        name
        lastTransition
        complianceType
        apiVersion
        status
        raw
      }
      roleBindingTemplates {
        name
        lastTransition
        complianceType
        apiVersion
        status
        raw
      }
      objectTemplates {
        name
        kind
        lastTransition
        complianceType
        apiVersion
        status
        raw
      }
      policyTemplates {
        name
        kind
        lastTransition
        complianceType
        apiVersion
        status
        raw
      }
      violations {
        name
        cluster
        message
        timestamp
      }
      rules {
        complianceType
        templateType
        ruleUID
        verbs
        apiGroups
        resources
      }
    }
  }
`

export const HCMPolicyViolations = gql`
  query getPolicyViolations($policyName: String!, $policyNamespace: String!) {
    violations: violationsInPolicy(policy: $policyName, namespace: $policyNamespace) {
      cluster
      message
      name
      timestamp
      consoleURL
    }
  }
`

export const GRCList = gql`
  query getCompliances($userAccountID: String!) {
    policies: compliances {
      metadata {
        name
        namespace
        selfLink
        annotations
        resourceVersion
      }
      name
      namespace
      raw
      remediation
      policyCompliant
      clusterCompliant
      placementPolicies {
        metadata {
          name
          selfLink
        }
      }
      placementBindings {
        metadata {
          name
          selfLink
        }
      }
    }
    findings: occurrences(userAccountID: $userAccountID) {
      name
      shortDescription
      finding
      reportedBy
      context
      securityClassification
    }
  }
`

export const GRCListNoSA = gql`
  query getCompliances{
    policies: compliances {
      metadata {
        name
        namespace
        selfLink
        annotations
        resourceVersion
      }
      name
      namespace
      raw
      remediation
      policyCompliant
      clusterCompliant
      placementPolicies {
        metadata {
          name
          selfLink
        }
      }
      placementBindings {
        metadata {
          name
          selfLink
        }
      }
    }
  }
`

export const GRCCreation = gql`
  query getDiscoveries {
    discoveries {
      clusterLabels
      policyNames
      annotations
      templates {
        name
        spec
      }
      namespaces
    }
  }
`

export const FindingList = gql`
  query getOccurrences($userAccountID: String!) {
    findings: occurrences(userAccountID: $userAccountID) {
      name
      shortDescription
      longDescription
      providerId
      providerName
      remediation
      updateTime
      finding
      reportedBy
      context
      securityClassification
    }
  }
`

export const HCMComplianceList = gql`
  query getCompliances {
    items: compliances {
      metadata {
        name
        namespace
        selfLink
        annotations
        resourceVersion
      }
      name
      namespace
      raw
      remediation
      policyCompliant
      clusterCompliant
      clusterNS
      clusterConsoleURL
      placementPolicies {
        metadata {
          name
          selfLink
        }
      }
      placementBindings {
        metadata {
          name
          selfLink
        }
      }
    }
  }
`

export const HCMPolicyPolicyList = gql`
  query getCompliances {
    items: compliances {
      metadata {
        name
        namespace
        selfLink
        annotations
        resourceVersion
      }
      name
      namespace
      raw
      remediation
      policyCompliant
      clusterCompliant
      placementPolicies {
        metadata {
          name
          selfLink
        }
      }
      placementBindings {
        metadata {
          name
          selfLink
        }
      }
    }
  }
`

export const HCMCompliance = gql`
  query getSingleCompliance($name: String!, $namespace: String) {
    items: compliances(name: $name, namespace: $namespace) {
      raw
      metadata {
        creationTimestamp
        name
        namespace
        resourceVersion
        selfLink
        uid
        annotations
      }
      annotations
      placementPolicies {
        metadata {
          annotations
          name
          namespace
          creationTimestamp
          selfLink
        }
        clusterLabels
        clusterReplicas
        resourceSelector
        status
        raw
      }
      placementBindings {
        metadata {
          name
          namespace
          creationTimestamp
          selfLink
        }
        placementRef {
          name
          kind
        }
        subjects {
          name
          apiGroup
          kind
        }
        raw
      }
      complianceStatus {
        clusterNamespace
        localCompliantStatus
        localValidStatus
        compliant
      }
      compliancePolicy {
        name
        status
        complianceName
        complianceNamespace
        complianceSelfLink
        roleTemplates {
          apiVersion
          complianceType
          compliant
          lastTransition
          name
          kind
          validity
          raw
        }
        roleBindingTemplates {
          apiVersion
          complianceType
          compliant
          lastTransition
          name
          kind
          validity
          raw
        }
        objectTemplates {
          apiVersion
          complianceType
          compliant
          lastTransition
          name
          kind
          validity
          raw
        }
        policyTemplates {
          apiVersion
          complianceType
          compliant
          lastTransition
          name
          kind
          validity
          raw
        }
        detail
        raw
      }
      compliancePolicies {
        name
        clusterCompliant
        clusterNotCompliant
        complianceName
        complianceNamespace
        policies {
          name
          cluster
          compliant
          complianceName
          complianceNamespace
          valid
          enforcement
          status
          raw
          metadata {
            annotations
            creationTimestamp
            name
            resourceVersion
            selfLink
            uid
          }
          roleTemplates {
            name
            lastTransition
            complianceType
            apiVersion
            compliant
            raw
          }
          roleBindingTemplates {
            name
            lastTransition
            complianceType
            apiVersion
            compliant
            raw
          }
          objectTemplates {
            name
            lastTransition
            complianceType
            apiVersion
            compliant
            kind
            raw
          }
          rules {
            complianceType
            templateType
            ruleUID
            apiGroups
            verbs
            resources
          }
          violations {
            name
            cluster
            message
            timestamp
          }
        }
      }
      policyCompliant
      clusterCompliant
      clusters
    }
  }
`

export const createUserQueries = gql`
  mutation saveQuery($resource: JSON!) {
    saveQuery(resource: $resource)
  }
`

export const AllPoliciesInCluster = gql`
  query getAllPoliciesInCluster($cluster: String!) {
    items: policiesInCluster(cluster: $cluster) {
      cluster
      kind
      metadata {
        name
        namespace
        selfLink
        creationTimestamp
        annotations
        labels
        uid
      }
      policiesStatusDetails
    }
  }
`

export const AllClustersInPolicy = gql`
  query getAllClustersInPolicy($policy: String!, $hubNamespace: String) {
    items: clustersInPolicy(policy: $policy, hubNamespace: $hubNamespace) {
      name
      total
      violated
      policyListStatuses
      metadata {
        labels
        name
        namespace
        annotations
        uid
        selfLink
      }
      status
    }
  }
`

export const AllPoliciesInApplication = gql`
query getAllPoliciesInApplication($violatedPolicies: JSON!) {
  items: policiesInApplication(violatedPolicies: $violatedPolicies) {
    cluster
    metadata {
      name
      namespace
      selfLink
      creationTimestamp
      annotations
      resourceVersion
      uid
    }
    status
    enforcement
    detail {
      exclude_namespace
      include_namespace
    }
    raw
  }
}
`
