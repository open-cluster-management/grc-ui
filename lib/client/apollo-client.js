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

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import lodash from 'lodash'
import config from '../shared/config'
import * as Query from './queries'
import { reloadingVar, timestampVar, startPollingFunc, stopPollingFunc, refetchFunc, refreshCookie } from './reactiveVars'

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

const getXsrfToken = () => {
  const token = document.getElementById('app-access') ? document.getElementById('app-access').value : ''
  return token.toString('ascii')
}
const link = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    )

  if (networkError) {
    console.log(`[Network error]: ${{networkError}}`)
    if(networkError.statusCode === 401) {
      location.reload(true)
    }
  }
})

const authLink = new ApolloLink((operation, forward) => {
  console.log(operation)
  return forward(operation).map(response => {
    const context = operation.getContext()
    console.log(context.response.status)
    console.log(context.response)
    // console.log(response)
    return response
  })
})

const client = new ApolloClient({
  connectToDevTools: true,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          reloading: {
            read() {
              return reloadingVar()
            }
          },
          timestamp: {
            read() {
              return timestampVar()
            }
          },
          startPolling: {
            read() {
              return startPollingFunc()
            }
          },
          stopPolling: {
            read() {
              return stopPollingFunc()
            }
          },
          refetch: {
            read() {
              return refetchFunc()
            }
          },
          refreshCookie: {
            read() {
              return refreshCookie()
            }
          }
        }
      }
    }
  }),
  link: ApolloLink.from([link, authLink, new HttpLink({
    uri: `${config.contextPath}/graphql`,
    credentials: 'same-origin',
    headers: {
      'XSRF-Token': getXsrfToken(),
      'context': {
        'locale': 'en'
      }
    },
    fetchOptions: {
      redirect: 'error',
    }
  })]),
  defaultOptions,
})

const searchClient = new ApolloClient({
  connectDevTools: process.env.NODE_ENV === 'development',
  cache: new InMemoryCache(),
  link: ApolloLink.from([
    new HttpLink({
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
  createResources(resources){
    return client.mutate({ mutation: Query.createResources, variables: { resources } })
  }
  createAndUpdateResources(toCreate, toUpdate){
    return client.mutate({ mutation: Query.createAndUpdateResources, variables: { toCreate, toUpdate } })
  }

  updateResource(resourceType, namespace, name, body, selfLink, resourcePath) {
    return client.mutate({ mutation: Query.updateResource, variables: { resourceType, namespace, name, body, selfLink, resourcePath } })
  }

  remove(input) {
    const removeKind = input.kind
    switch(removeKind) {
    case 'HCMPolicyPolicy':
    default:{
      const comRes = input.selected.filter((res) => res.selected === true)
      return client.mutate({ mutation: Query.deleteCompliance, variables: { selfLink: input.metadata.selfLink, resources: comRes } })
    }}
  }
}

export default new GrcApolloClient()
