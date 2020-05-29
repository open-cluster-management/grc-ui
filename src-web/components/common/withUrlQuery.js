/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { updateResourceFilters, STRING_SPLITTER } from '../../actions/filters'
import { connect } from 'react-redux'
import queryString from 'query-string'

const pageWithUrlQuery = (ChildComponent, resourceType) => {
// HOC to handle the url query parameters
// used in TagInput.js
  class PageWithUrlQuery extends React.Component {
    static propTypes = {
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      putParamsFiltersIntoStore: PropTypes.func,
    }

    createLocationSearch(queries) {
      // create location search in React router
      // .....？{filters:{clusterLabel:[cloud=IBM]}}
      if (queries.length > 0) {
        const result = {}
        queries.forEach((item) => {
          if (item.type) {
            if (!Array.isArray(result[item.type])) {
              result[item.type] = Array.of(item.name)
            } else {
              result[item.type].push(item.name)
            }
          }
        })
        return JSON.stringify(result)
      } else {
        return false
      }
    }

    createURLFilters(inputs) {
      let result = ''
      if (inputs.includes('={') && inputs.includes('}')) {
        const searchFields = inputs.replace('},', '}},').toLowerCase().split('},')
        result += '{'
        searchFields.forEach((search, i) => {
          const localSearchKey = search.substring(0, search.indexOf('='))
          const searchField = search.substring(search.indexOf('=')+1)
          const searchKeys = searchField.replace(/[{}]/g, '').split(',')
          result += `"${localSearchKey}":[`
          searchKeys.forEach((searchKey, index) => {
            result += `"${searchKey}"`
            if (index !== searchKeys.length-1) {
              result += ','
            }
          })
          result += ']}'
          if (i !== searchFields.length-1) {
            result += ','
          }
        })
      } else {
        result += '{"textsearch":['
        inputs.split(',').forEach(item => {
          result += encodeURIComponent(`"${item.replace('=',':')}"`)
        })
        result += ']}'
      }
      return result
    }

    //diff than original updateBrowserURL in console-ui pageWithUrlQuery
    //this modified updateBrowserURL will keep flags other than text input filters
    updateBrowserURL(inputs) {
      const {history, location} = this.props
      let finalURL = location.pathname, otherFilters = ''
      const paraURL = queryString.parse(location.search)
      if(paraURL.filters) {
        delete paraURL.filters
      }
      otherFilters = queryString.stringify(paraURL)
      if (inputs.query !== undefined) {
        if (inputs.query === '') {
          if(otherFilters){
            finalURL = `${finalURL}?${otherFilters}`}
        } else {
          if (otherFilters){
            finalURL = `${finalURL}?${otherFilters}&filters={"textsearch":${encodeURIComponent(JSON.stringify(inputs.query))}}`
          }
          else {
            finalURL = `${finalURL}?filters={"textsearch":${encodeURIComponent(JSON.stringify(inputs.query))}}`
          }
        }
      } else if (Array.isArray(inputs)) {
        const paramString = this.createLocationSearch(inputs)
        if (history && paramString) {
          // update the URL with filter tags
          if (otherFilters){
            finalURL = `${finalURL}?${otherFilters}&tags=${paramString}`
          }
          else {
            finalURL = `${finalURL}?tags=${paramString}`
          }
        } else if (history && otherFilters) {
          finalURL = `${finalURL}?${otherFilters}`
        }
      } else if (typeof inputs === 'string') {
        if (inputs !== '') {
          const filters = this.createURLFilters(inputs)
          if (otherFilters){
            finalURL = `${finalURL}?${otherFilters}&filters=${filters}`
          }
          else {
            finalURL = `${finalURL}?filters=${filters}`
          }
        } else {
          if(otherFilters){
            finalURL = `${finalURL}?${otherFilters}`}
        }
      }

      history.push(finalURL)
    }

    constructor(props) {
      super(props)
      this.updateBrowserURL = this.updateBrowserURL.bind(this)
      this.state = {
        firstTimeLoad: true
      }
    }

    componentWillReceiveProps() {
      this.setState({firstTimeLoad: false})
    }

    convertObjectToFilterArray(object) {
      const tempArray = []
      for (const [type, value] of Object.entries(object)) {
        if ( Array.isArray(value) ) {
          value.forEach(element => {
            if (element && element.includes(STRING_SPLITTER)) {
              const [key, value] = element.split(STRING_SPLITTER)
              tempArray.push({
                type,
                key,
                value,
                name: element,
                id: element,
              })
            }
          })
        }
      }
      return tempArray
    }

    convertClientSideFiltersToString(input) {
      let result = ''
      try {
        const filterJson = JSON.parse(input)
        if (!filterJson.textsearch) {
          Object.entries(filterJson).forEach(([key,value]) => {
            if (result !== '') {
              result += ','
            }
            if (Array.isArray(value)) {
              result += (key + '={')
              value.forEach((item, index) => result += (item.replace(':', '=') + (index !== value.length-1 ? ',' : '')))
              result += '}'
            }
          })
        } else {
          result += filterJson.textsearch
        }
      } catch(err) {
        if (!input.includes('{') && !input.includes('}')) {
          return input
        }
      }
      return result
    }

    convertQueryParams() {
      const { location, putParamsFiltersIntoStore } = this.props
      const paramString = queryString.parse(location.search)
      let filters = {}
      try {
        if (paramString.tags) {
          const tags = paramString.tags
          const tagsJson = JSON.parse(tags)
          if (tagsJson && this.state.firstTimeLoad) {
            putParamsFiltersIntoStore(this.convertObjectToFilterArray(tagsJson))
          }
        }
        // for client side filtering
        if (paramString.filters) {
          const clientSideFilters = this.convertClientSideFiltersToString(paramString.filters)
          if (clientSideFilters) {
            filters = {...filters, clientSideFilters}
          }
        }
      // eslint-disable-next-line no-empty
      } catch(e) {}
      return filters
    }

    render() {
      // handle multi-purpose query parsing below
      const filters = this.convertQueryParams()
      return (
        <ChildComponent
          {...this.props}
          clientSideFilters={filters.clientSideFilters}
          updateBrowserURL={this.updateBrowserURL}
        />
      )
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return {
      putParamsFiltersIntoStore: (selectedFilters) => {
        dispatch(updateResourceFilters(resourceType, selectedFilters))
      }
    }
  }

  return connect(() => ({}), mapDispatchToProps)(PageWithUrlQuery)
}

export default pageWithUrlQuery
