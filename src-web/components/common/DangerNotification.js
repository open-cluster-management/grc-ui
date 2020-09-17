/* Copyright (c) 2020 Red Hat, Inc. */

import React from 'react'
import { NotificationDrawer, NotificationDrawerBody,
  NotificationDrawerList, NotificationDrawerListItem,
  NotificationDrawerListItemHeader } from '@patternfly/react-core'

export const DangerNotification = (error) => {
  return <NotificationDrawer>
    <NotificationDrawerBody>
      <NotificationDrawerList>
        <NotificationDrawerListItem variant="danger">
          <NotificationDrawerListItemHeader
            variant="danger"
            title={error.message}
            srTitle="Danger notification:"
          />
        </NotificationDrawerListItem>
      </NotificationDrawerList>
    </NotificationDrawerBody>
  </NotificationDrawer>
}
