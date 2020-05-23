/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const { WebClient } = require('@slack/web-api')
const { SLACK_TOKEN, /*USER,*/ TRAVIS_BUILD_WEB_URL } = process.env

const web = new WebClient(SLACK_TOKEN)

async function reportFailure() {
  if (!process.env.SLACK_TOKEN) {
    return console.error('Missing SLACK_TOKEN environment variable; skipping slack reporting...')
  }

  try {
    const screenshotDir = path.join(process.cwd(), 'test-output', 'e2e', 'screenshots')
    // const userId = await mapSlackUserByGitEmail()
    const userId = 'GUS1VB8P3'
    const screenshots = recFindByExt(screenshotDir, 'png')
    screenshots.forEach(screenshot => {
      const pathArray = screenshot.split('/')
      const filename = pathArray[pathArray.length-1]
      const comment = buildComment(filename)
      postScreenshot(filename, screenshot, comment, userId)
    })
  } catch(e) {
    console.error(e)
  }
}


function recFindByExt(base,ext,files,result) {
  files = files || fs.readdirSync(base)
  result = result || []

  files.forEach(
    (file) => {
      var newbase = path.join(base,file)
      if ( fs.statSync(newbase).isDirectory() )
      {
        result = recFindByExt(newbase,ext,fs.readdirSync(newbase),result)
      }
      else
      {
        if ( file.substr(-1*(ext.length+1)) == '.' + ext )
        {
          result.push(newbase)
        }
      }
    }
  )
  return result
}

function buildComment(fileName) {
  const searchIndex = fileName.indexOf('_')
  const string = fileName.slice(0, searchIndex)
  const testName = string.replace(/-/g, ' ')
  return `:failed: *FAILED: ${testName}.* \n ${TRAVIS_BUILD_WEB_URL}`
}

// async function mapSlackUserByGitEmail() {
//   try {
//     const userProfile = await web.users.lookupByEmail({ email: USER })
//     return userProfile.user.id
//   } catch (e) {
//     console.log('Failed to map user\'s git e-mail to Slack')
//   }
// }

async function postScreenshot(fileName, filePath, comment, userId) {
  await web.files.upload({
    channels: userId,
    filename: fileName,
    file: fs.createReadStream(filePath),
    initial_comment: comment
  })
}

reportFailure()
