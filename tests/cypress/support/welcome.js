/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

var apiUrl =
    Cypress.config().baseUrl.replace('multicloud-console.apps', 'api') + ':6443'

const acmVersion = (token) => {
    return cy.request({
        url: Cypress.config().baseUrl + '/multicloud/header/version',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }).then(resp => {
        return resp.body['status']['currentVersion']
    })
}

const oauthTokenEndpoint = (token) => {
    return cy.request({
        url: apiUrl + '/.well-known/oauth-authorization-server',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }).then(resp => {
        return resp.body['token_endpoint']
    })
}

export const oauthIssuer = (token) => {
    return cy.request({
        url: apiUrl + '/.well-known/oauth-authorization-server',
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    }).then(resp => {
        return resp.body['issuer']
    })
}

export const welcomePage = {
    whenGoToWelcomePage:() => cy.visit('/multicloud/welcome'),
    shouldExist: () => {
        cy.get('.welcome--introduction').should('contain', 'Welcome! Let’s get started.')
        cy.get('.welcome--svcs').should('contain', 'Go to Overview').and('contain', 'Go to Clusters').and('contain', 'Go to Applications').and('contain', 'Go to Governance and risk')
    },
    validateSvcs: () => {
        cy.contains('Go to Overview').click()
        overviewPage.shouldExist()
        cy.visit('/multicloud/welcome')
        cy.contains('Go to Clusters').click()
        cy.get('.pf-c-title').should('contain', 'Cluster management')
        cy.visit('/multicloud/welcome')
        cy.contains('Go to Applications').click()
        cy.get('.secondary-header-wrapper').find('h1').should('contain', 'Applications')
        cy.visit('/multicloud/welcome')
        cy.contains('Go to Governance and risk').click()
        cy.get('.pf-c-page').find('h1').should('contain', 'Governance and risk')
        cy.visit('/multicloud/welcome')
    },
    validateConnect: () => {
        cy.get('[target="dev-community"]').should('have.prop', 'href', 'https://www.redhat.com/en/blog/products')
        cy.get('[target="support"]').should('have.prop', 'href', 'https://access.redhat.com/support')
    }
}

export const clustersPage = {
    shouldExist: () => {
        cy.get('.pf-c-page').should('contain', 'Cluster management')
    }
}

export const overviewPage = {
    shouldExist: () => {
        cy.get('.pf-c-page').should('contain', 'Overview')
    }
}

export const searchPage = {
    shouldExist: () => {
        cy.get('.pf-c-page').should('contain', 'Search')
    }
}

export const applicationPage = {
    shouldExist: () => {
        cy.get('.pf-c-page', {timeout: 10000 }).should('contain', 'Applications')
    }
}

export const grcPage = {
    shouldExist: () => {
        cy.get('.pf-c-page', {timeout: 10000 }).should('contain', 'Governance and risk')
    }
}

export const credentialsPage = {
    shouldExist: () => {
        cy.get('.pf-c-page', {timeout: 10000 }).should('contain', 'Manage credentials')
    }
}

export const kuiPage = {
    shouldExist: () => {
        cy.get('.bx--header__name').should('contain', 'Visual Web Terminal')
    }
}

export const resourcePage = {
    shouldExist: () => {
        cy.get('.bx--modal-header__heading').should('contain', 'Create resource')
    }
}

export const leftNav = {
    validateMenu: () => {
        cy.get('#page-sidebar li').should('be.visible').and('have.length', 9)
        cy.get('#nav-toggle').click()
        cy.get('#page-sidebar').should('not.be.visible')
        cy.get('#nav-toggle').click()
    },
    goToHome: () => {
        cy.get('#page-sidebar').contains('Home').click()
        cy.get('#page-sidebar').contains('Welcome').should('not.be.visible')
        cy.get('#page-sidebar').contains('Home').click()
        cy.get('#page-sidebar').contains('Welcome').should('be.visible')
        cy.get('#page-sidebar').contains('Welcome').click()
        welcomePage.shouldExist()
    },
    goToOverview: () => {
        cy.get('#page-sidebar').contains('Home').click()
        cy.get('#page-sidebar').contains('Overview').should('not.be.visible')
        cy.get('#page-sidebar').contains('Home').click()
        cy.get('#page-sidebar').contains('Overview').should('be.visible')
        cy.get('#page-sidebar').contains('Overview').click()
        overviewPage.shouldExist()
    },
    goToClusters: () => {
        cy.get('#page-sidebar').contains('Clusters').click()
        clustersPage.shouldExist()
    },
    goToApplications: () => {
        cy.get('#page-sidebar').contains('Applications').click()
        applicationPage.shouldExist()
    },
    goToGRC: () => {
        cy.get('#page-sidebar').contains('Risk and Compliance').click()
        grcPage.shouldExist()
    },
    goToCredentials: () => {
        cy.get('#page-sidebar').contains('Credentials').click()
        credentialsPage.shouldExist()
    },
    goToKUI: () => {
        cy.get('#page-sidebar').contains('Visual Web Terminal').click()
        kuiPage.shouldExist()
    }
}

export const userMenu = {
    openSearch: () => {
        cy.get('[aria-label="search-button"]').click()
        searchPage.shouldExist()
    },
    openInfo: () => {
        cy.get('[data-test="about-dropdown"]').click()
        cy.get('[data-test="about-dropdown"] li').should('be.visible').and('have.length', 2)
        // Since cypress doesn't support multitab testing, we can check to see if the link includes the documentation link.
        // For now we can exclude the doc version, since the docs might not be available for a certain release.
        cy.get('[data-test="about-dropdown"]').contains('Documentation').should('have.attr', 'href').and('contain', 'https://access.redhat.com/documentation/en-us/red_hat_advanced_cluster_management_for_kubernetes/')
        cy.getCookie('acm-access-token-cookie').should('exist').then((token) => {
            acmVersion(token.value).then((version) => {
                cy.get('[data-test="about-dropdown"]').contains('About').click().get('.pf-c-spinner', {timeout: 20000}).should('not.exist')
                cy.get('.version-details__no').should('contain', version)
                cy.get('[aria-label="Close Dialog"]').click()
            })
        })
    },
    openUser: () => {
        cy.get('[data-test="user-dropdown"]').click()
        cy.get('[data-test="user-dropdown"] li').should('be.visible').and('have.length', 2)
        cy.get('[data-test="user-dropdown"]').click()
        cy.get('#configure').should('not.exist')
        cy.get('#logout').should('not.exist')
    }
}
