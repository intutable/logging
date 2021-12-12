import { appendFileSync } from "fs"
import { CoreNotification, PluginLoader } from "@intutable/core"

const LOGFILE_PATH = "log/intutable.log"

let pluginLoader: PluginLoader

export async function init(plugin: PluginLoader) {
    pluginLoader = plugin

    plugin.listenForAllNotifications(receiveNotification)
}

async function receiveNotification(notification: CoreNotification) {
    const logString: String = createLogString(notification);
    logConsole(logString)
    if (notification.channel != "logging" || notification.method != "logFile") { // Prevent loop
        logFile(logString)
    }
}

function createLogString(notification: CoreNotification): String {
    let date:String = new Date().toISOString()
    return JSON.stringify({date,notification})
}

function logConsole(logString: String) {
    console.log(logString)
}

function logFile(logString: String) {
    try {
        appendFileSync(LOGFILE_PATH, logString + '\n')
    } catch (err) {
        pluginLoader.notify({
            channel: "logging",
            method: "logFile",
            message: `Couldn't write to log-file: ${err}`
        })
    }
}
