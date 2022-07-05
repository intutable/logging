/**
 * This module is the core of the plugin.
 * It contains almost all logic of this plugin.
 * 
 * Every loggable event should be broadcast as a notification. The plugin automatically catches and logs the events.
 * 
 * This plugin exposes the following endpoints:
 *  * getEventsLog(n): returns an array of the last n logged events.
 * 
 * To learn about the xTable plugin interface, have a look at https://intutable.gitlab.io/documentation/
 * @module
 */
import { appendFileSync, existsSync, mkdirSync } from "fs"
import { CoreNotification, CoreRequest, CoreResponse, PluginLoader } from "@intutable/core"
import { RingBuffer } from 'ring-buffer-ts'
import path from "path"

const MAX_LOG_HISTORY = 1024
let logHistory: RingBuffer<CoreNotification>

const LOGFILE_PATH = "log/intutable.log"

let pluginLoader: PluginLoader

export async function init(plugin: PluginLoader) {
    logHistory = new RingBuffer<CoreNotification>(MAX_LOG_HISTORY)
    pluginLoader = plugin

    plugin.listenForAllNotifications(receiveNotification)
    plugin.listenForRequests("logging").on("getEventsLog", getEventsLog)
}

async function receiveNotification(notification: CoreNotification) {
    const logString: String = createLogString(notification);
    if (notification.channel != "logging" || notification.method != "logFile") { // Prevent loop
        logFile(logString)
    }
    logConsole(logString)
    logHistory.add(notification)
}

async function getEventsLog(request: CoreRequest): Promise<CoreResponse> {
    const numberOfEvents2Return = 
        request.numberOfEvents <= MAX_LOG_HISTORY ? 
        request.numberOfEvents : MAX_LOG_HISTORY
    
    const logHistoryArray = logHistory.toArray()
    return { events: logHistoryArray.slice(logHistoryArray.length - numberOfEvents2Return) }

}

function createLogString(notification: CoreNotification): String {
    let date:String = new Date().toISOString()
    return JSON.stringify({date,notification})
}

function logConsole(logString: String) {
    console.log(logString)
}

function logFile(logString: String) {
    if(!existsSync(path.dirname(LOGFILE_PATH))) {
        mkdirSync(path.dirname(LOGFILE_PATH))
    }
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
