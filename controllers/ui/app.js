/* eslint-disable no-unused-vars */
/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
/* Copyright Contributors to the Open Cluster Management project */

'use strict'

const thunkMiddleware = require('redux-thunk').default,
      redux = require('redux'),
      express = require('express'),
      context = require('../../lib/shared/context'),
      msgs = require('../../nls/platform.properties'),
      config = require('../../config'),
      appUtil = require('../../lib/server/app-util'),
      router = express.Router({ mergeParams: true }),
      request = require('../../lib/server/request')

import _ from 'lodash'

let App, Login, reducers, access  //laziy initialize to reduce startup time seen on k8s

const targetAPIGroups = [
  'policy.open-cluster-management.io',
  'apps.open-cluster-management.io',
]
const appJson = 'application/json'

const getUserNamespaces = (auth, cb) => {
  const options = {
    url: `${config.get('API_SERVER_URL')}/apis/project.openshift.io/v1/projects`,
    headers: {
      'Content-Type': appJson,
      'Accept': appJson,
      'Authorization': auth
    },
    json: true
  }

  request(options, null, [200, 201, 204], (err, response) => {
    if (err) {
      return cb(err, null)
    }

    let userNamespaces = _.get(response, 'body.items', null)
    userNamespaces = userNamespaces
      ? userNamespaces.map(item => ({ Name: item.metadata.name }))
      : []
    return cb(err, userNamespaces)
  })
}

function nsFormatter(multiNS) {
  let formattedNS = []
  if (Array.isArray(multiNS) && multiNS.length > 0) {
    formattedNS = multiNS.map((ns) => {
      if (ns.Name) {
        return ns.Name
      } else {
        return ns.name
      }})
  }
  return formattedNS
}

async function getUserAccess(authorizationToken, singleNS, apiGroups, rawDataFlag, resolve, reject){
  const k8sAPI = '/apis/authorization.k8s.io/v1'
  const options = {
    method: 'POST',
    url: `${config.get('API_SERVER_URL')}${k8sAPI}/selfsubjectrulesreviews`,
    json: true,
    headers: {
      'Content-Type': appJson,
      'Accept': appJson,
      Authorization: authorizationToken
    },
    body: {
      apiVersion: 'authorization.k8s.io/v1',
      kind: 'SelfSubjectRulesReview',
      spec: {
        namespace: singleNS
      },
    }
  }

  request(options, null, [200,201], (err, res) => {
    if (err) {
      return reject(err)
    }
    const userAccess = userAccessFormatter(res, apiGroups, singleNS, rawDataFlag)
    return resolve(userAccess)
  })
}

const getUserAccessInfo = (authorizationToken, trgtAPIGroups, rawDataFlag, namespaces, cb) => {
  const userAllNS = nsFormatter(namespaces)
  const userAccessReq = []
  userAllNS.forEach((singleNS) => {// each element binds with one NS then parallelly call whole array
    userAccessReq.push(
      new Promise((resolve, reject) => {
        return getUserAccess(authorizationToken, singleNS, trgtAPIGroups, rawDataFlag, resolve, reject)
      })
    )
  })
  Promise.all(userAccessReq).then(
    (userAccessResult) => {
      return cb(null, userAccessResult)
    }
  ).catch(
    (err) => {
      return cb(err, null)
    }
  )
}

function userAccessFormatter(accessInfo, apiGrps, singleNS, rawDataFlag) {
  const trgtAPIGroups = new Set(apiGrps)
  const singleNSAccess ={
    namespace: singleNS,
    rules: {},
  }
  // if user query raw = true, also return original raw access data on each namespace
  if (rawDataFlag) {
    singleNSAccess.rawData = accessInfo
  }
  const resourceRules = _.get(accessInfo,'body.status.resourceRules','')
  if (Array.isArray(resourceRules) && resourceRules.length > 0) {
    resourceRules.forEach((resourceRule) => {
      if (Array.isArray(resourceRule.apiGroups)) {
        const apiGroups = _.compact(resourceRule.apiGroups)
        resourceRule.apiGroups.length > 0 && apiGroups.forEach((api) => {
          // no matter if user want *, always return these special cases
          if (Array.isArray(resourceRule.resources) && (trgtAPIGroups.has(api) || api === '*')) {
            const resources = _.compact(resourceRule.resources)
            const verbs = _.compact(resourceRule.verbs)
            resourceRule.resources.length > 0 && resources.forEach((resource) => {
              // use the combined api + resource as the unique key
              const mapKey = `${api}/${resource}`
              if (Object.prototype.hasOwnProperty.call(singleNSAccess.rules, mapKey)) {
                singleNSAccess.rules[mapKey] = _.union(singleNSAccess.rules[mapKey], verbs)
              }
              else {
                singleNSAccess.rules[mapKey] = verbs
              }
            })
          }
        })
      }
    })
  }
  return singleNSAccess
}

router.get('*', (req, res) => {
  reducers = reducers === undefined ? require('../../src-web/reducers') : reducers

  const store = redux.createStore(redux.combineReducers(reducers), redux.applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
  ))

  // let userAccess
  // const auth = req.headers.Authorization || req.headers.authorization || `Bearer ${req.cookies['acm-access-token-cookie']}`
  const ctx = getContext(req)
      return res.render('home', Object.assign({
        manifest: appUtil.app().locals.manifest,
        contextPath: config.get('contextPath'),
        state: store.getState(),
        props: ctx,
      }, ctx))
  // getUserNamespaces(auth, (err, userNS) => {
  //   if (err) {
  //     return res.status(err.statusCode || 500).send(err.details)
  //   }
  //   getUserAccessInfo(auth, targetAPIGroups, null, userNS, (uaErr, ua) => {
  //     if (err) {
  //       return res.status(uaErr.statusCode || 500).send(uaErr.details)
  //     }
  //     userAccess = ua
  //     access = access === undefined ? require('../../src-web/actions/access') : access
  //     if (userAccess) {
  //       store.dispatch(access.userAccessSuccess(userAccess))
  //     }

  //     Login = Login === undefined ? require('../../src-web/actions/login') : Login
  //     store.dispatch(Login.receiveLoginSuccess(req.user))

  //     App = App === undefined ? require('../../src-web/containers/App').default : App

  //   })
  // })
})

function getContext(req) {
  const reqContext = context(req)
  return {
    title: msgs.get('common.app.name', reqContext.locale),
    context: reqContext,
    xsrfToken: req.csrfToken(),
  }
}

module.exports = router
