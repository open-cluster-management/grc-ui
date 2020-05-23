/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { WebClient } = require('@slack/web-api')
const { SLACK_TOKEN, USER, TRAVIS_BUILD_WEB_URL } = process.env

const web = new WebClient(SLACK_TOKEN)

async function reportFailure() {
  if (!process.env.SLACK_TOKEN) {
    return console.error('Missing SLACK_TOKEN environment variable; skipping slack reporting...')
  }

  try {
    const screenshotDir = path.join(__dirname, '../..', 'test-output', 'e2e', 'screenshots')
    const folders = fs.readdirSync(screenshotDir)
    // const userId = await mapSlackUserByGitEmail()
    const userId = 'GUS1VB8P3'
    folders.forEach(folder => {
      const folderDir = path.join(screenshotDir, folder)
      const screenshots = fs.readdirSync(folderDir, { withFileTypes: true })
      screenshots.forEach(({ name }) => {
        const ssPath = path.join(folderDir, name)
        const comment = buildComment(name)
        postScreenshot(name, ssPath, comment, userId)
      })
    })
  } catch(e) {
    console.error(e)
  }
}

function buildComment(fileName) {
  const searchIndex = fileName.indexOf('_')
  const string = fileName.slice(0, searchIndex)
  const testName = string.replace(/-/g, ' ')
  return `:failed: *FAILED: ${testName}.* \n ${TRAVIS_BUILD_WEB_URL}`
}

async function mapSlackUserByGitEmail() {
  try {
    const userProfile = await web.users.lookupByEmail({ email: USER })
    return userProfile.user.id
  } catch (e) {
    console.log('Failed to map user\'s git e-mail to Slack')
  }
}

async function postScreenshot(fileName, filePath, comment, userId) {
  await web.files.upload({
    channels: userId,
    filename: fileName,
    file: fs.createReadStream(filePath),
    initial_comment: comment
  })
}

reportFailure()
