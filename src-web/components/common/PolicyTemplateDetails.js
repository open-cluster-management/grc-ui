/* Copyright (c) 2020 Red Hat, Inc. */
'use strict'

import React from 'react'
// import PropTypes from 'prop-types'

import {
  Button,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription
} from '@patternfly/react-core'

import { PlusCircleIcon } from '@patternfly/react-icons'


/**
 * Functional React component that serves as a base
 * for all pages and renders the header
 */
const PolicyTemplateDetails = () => {
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Name</DescriptionListTerm>
        <DescriptionListDescription>Example</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Namespace</DescriptionListTerm>
        <DescriptionListDescription>
          <a href="#">mary-test</a>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Labels</DescriptionListTerm>
        <DescriptionListDescription>example</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Pod selector</DescriptionListTerm>
        <DescriptionListDescription>
          <Button variant="link" isInline icon={<PlusCircleIcon />}>
            app=MyApp
          </Button>
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Annotation</DescriptionListTerm>
        <DescriptionListDescription>2 Annotations</DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  )
}


// PolicyTemplateDetails.propTypes = {
//   children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
// }

export default PolicyTemplateDetails
