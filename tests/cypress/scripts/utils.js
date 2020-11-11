/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

var apiUrl =
Cypress.config().baseUrl.replace("multicloud-console.apps", "api") + ":6443";

export const getOpt = (opts, key, defaultValue) => {
    if (opts && opts[key]) {
      return opts[key]
    }
  
    return defaultValue
}
export const oauthIssuer = (token) => {
    return cy.request({
        url: apiUrl + "/.well-known/oauth-authorization-server",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json"
        }
    }).then(resp => { 
        return resp.body['issuer']
    })
}