/* eslint-disable no-console */
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

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost'
import { withClientState } from 'apollo-link-state'
import lodash from 'lodash'
import gql from 'graphql-tag'
import config from '../shared/config'
import * as Query from './queries'

const queryNewSearchStr = 'New Search (Unsaved)'

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all'
  }
}

const typeDefs = gql`
  scalar JSON

  type Modal {
    open: Boolean
    type: String
    data: JSON
  }

  type SearchQueryTab {
    queryName: String
    description: String
    searchText: String
    updated: Boolean
    id: String
  }

  type SearchQueryTabs {
    unsavedCount: Int
    openedTabName: String
    openedTabId: String
    tabs: [SearchQueryTab]
  }

  type Query {
    modal: Modal
    searchQueryTabs: SearchQueryTabs
  }

  type Mutation {
    updateModal(__typename: String, open: Boolean, type: String, data: JSON): JSON
    updateQueryTabs(__typename: String, unsavedCount: Int, openedTabName: String, openedTabId: String, data: JSON, tabs: [JSON]): JSON
    updateSingleQueryTab(openedTabName: String, openedTabId: String, description: String, searchText: String, updateUnsavedOrExisting: Boolean): JSON
    removeSingleQueryTab(id: String): JSON
  }
`

const stateLink = withClientState({
  cache: new InMemoryCache(),
  defaults: {
    searchInput: {
      __typename: 'SearchInput',
      text: '',
    },
    modal: {
      __typename: 'modal',
      open: false,
      type:'',
      data: {
        __typename: 'ModalData',
        name: '',
        searchText:'',
        description:''
      }
    },
    searchQueryTabs: {
      __typename: 'SearchQueryTabs',
      tabs: [{
        __typename: 'QueryTab',
        queryName: queryNewSearchStr,
        searchText:'',
        description:'',
        updated: false,
        id: queryNewSearchStr
      }],
      unsavedCount: 1,
      openedTabName: queryNewSearchStr,
      openedTabId: queryNewSearchStr
    },
    relatedResources: {
      __typename: 'RelatedResources',
      visibleKinds: []
    }
  },
  typeDefs: typeDefs,
  resolvers: {
    Mutation: {
    },
  }
})

const getXsrfToken = () => {
  const token = document.getElementById('app-access') ? document.getElementById('app-access').value : ''
  return token.toString('ascii')
}

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache(),
  link: ApolloLink.from([stateLink, new HttpLink({
    uri: `${config.contextPath}/graphql`,
    credentials: 'same-origin',
    headers: {
      'XSRF-Token': getXsrfToken(),
      'context': {
        'locale': 'en'
      }
    },
  }) ]),
  defaultOptions,
})

const searchClient = new ApolloClient({
  connectDevTools: process.env.NODE_ENV === 'development',
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    withClientState({
      cache: new InMemoryCache(),
    }), new HttpLink({
      uri: `${config.contextPath}/search/graphql`,
      credentials: 'same-origin',
      headers: {
        'XSRF-Token': getXsrfToken(),
      },
    })
  ]),
  defaultOptions,
})

class GrcApolloClient {

  getGrcClient(){
    return client
  }

  getSearchClient() {
    // TODO - use flag while ironing out the chart changes
    return config['feature_search-api'] ? searchClient : client
  }

  // general search using search-api
  search(q, variables = {}) {
    // TODO - use flag while ironing out the chart changes
    return config['feature_search-api'] ? searchClient.query({ query: q, variables }) : client.query({ query: q, variables })
  }

  // gets list
  get(resourceType, variables = {}) {
    const resourceList = lodash.get(Query, resourceType.list)
    if (resourceList) {
      return client.query({ query: resourceList, variables })
    }
    return Promise.resolve()
  }

  // gets one resource
  getResource(resourceType, variables = {}) {
    return client.query({ query: lodash.get(Query, resourceType.name), variables })
  }
  createPolicy(resources) {
    return client.mutate({ mutation: Query.createPolicy, variables: { resources } })
  }
  createCompliance(resources) {
    return client.mutate({ mutation: Query.createCompliance, variables: { resources } })
  }
  createApplication(resources){
    return client.mutate({ mutation: Query.createApplication, variables: { resources } })
  }
  saveUserQueries(resource){
    return client.mutate({ mutation: Query.createUserQueries, variables: { resource } })
  }
  createResources(resources){
    return client.mutate({ mutation: Query.createResources, variables: { resources } })
  }
  createAndUpdateResources(toCreate, toUpdate){
    return client.mutate({ mutation: Query.createAndUpdateResources, variables: { toCreate, toUpdate } })
  }

  updateResource(resourceType, namespace, name, body, selfLink, resourcePath) {
    return client.mutate({ mutation: Query.updateResource, variables: { resourceType, namespace, name, body, selfLink, resourcePath } })
  }
  updateResourceLabels(resourceType, namespace, name, body, selfLink, resourcePath) {
    return client.mutate({ mutation: Query.updateResourceLabels, variables: { resourceType, namespace, name, body, selfLink, resourcePath } })
  }
  deleteUserQueries(resource) {
    return client.mutate({ mutation: Query.removeQuery, variables: {resource}})
  }

  remove(input) {
    const removeKind = input.kind
    switch(removeKind) {
    case 'HCMPolicyPolicy':
    default:{
      const comRes = input.selected.filter((res) => res.selected === true)
      return client.mutate({ mutation: Query.deleteCompliance, variables: { selfLink: input.metadata.selfLink, resources: comRes } })
    }
    case 'HCMSecurityFindings': {
      if (input.name) {
        return client.mutate({ mutation: Query.deleteOccurrences, variables: { selfLink: input.name} })
      }
    }
    }
    return undefined
  }
}

export default new GrcApolloClient()
