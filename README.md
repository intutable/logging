# Overview

This plugin adds a logging interface for `xTable`.

This plugin automatically logs notifications from all notificationchannels and currently logs it into a file and to the console.

# Setup

Installation:

```
npm install @intutable/logging
```

External dependencies used by this package:

* [ring-buffer-ts](https://www.npmjs.com/package/ring-buffer-ts), MIT License

# Development

To add the logging plugin to your own plugin or software based on xTable, you need to do the following:

* Install logging: ```npm install @intutable/logging```
* Configure PLUGINPATH accordingly. (i.e ```node_modules/@intutable/logging```)

Further settings are not required.

## Sample Code

```typescript

import { Core } from "@intutable/core"
import { getEventsLog } from "@intutable/logging/dist/requests"
import path from "path"

let PLUGINPATH = [
    path.join(__dirname, "..", "node_modules/@intutable", "logging")
]


async function main() {
    const core = await Core.create(PLUGINPATH)
    await core.events.notify({channel:"test", method:"hello", test: true})
    console.log(await core.events.request(getEventsLog(1)))
    await core.plugins.closeAll()
}

main()
```

## Repository Structure

This repository heavily uses branch based development. There are always at least two branches: main and develop. Main consists of the latest stable release, whereas develop consists of - as the name implies - code in development. Usually, the code on develop should be able to run, but there may be bugs, and/or incomplete features. If you want to contribute, please open a MR against develop, but try to be as concise as possible. Don't do a million line MR, but instead try to be more atomic in regards to your MRs. Please write unit tests for your code :)

Also please prepend your commit messages with the kind of work you have done:

* feat: for feature
* fix: for bug fix
* chore: for refactor/documentation
* test: for tests

# License

The repository is Licensed under the Apache 2.0 License.