import { appendFileSync } from "fs"
import { CoreNotification, PluginLoader } from "@intutable/core"

const LOGFILE_PATH = "log/intutable.log"

export async function init(plugin: PluginLoader) {
    plugin.listenForAllNotifications(receiveNotification)
}

async function receiveNotification(notification: CoreNotification) {
    const logString: String = createLogString(notification);
    logConsole(logString)
    logFile(logString)
}

function createLogString(notification: CoreNotification): String {
    let date:String = new Date().toISOString()
    return JSON.stringify({date,notification})
}

function logConsole(logString: String) {
    console.log(logString)
}

function logFile(logString: String) {
    appendFileSync(LOGFILE_PATH, logString + '\n')
}
