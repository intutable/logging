import { CoreNotification, CoreRequest, CoreResponse, PluginLoader } from "@intutable/core"
import { RingBuffer } from 'ring-buffer-ts'

const MAX_LOG_HISTORY = 1024
let logHistory: RingBuffer<CoreNotification>

export async function init(plugin: PluginLoader) {
    logHistory = new RingBuffer<CoreNotification>(MAX_LOG_HISTORY)

    plugin.listenForAllNotifications(receiveNotification)
    plugin.listenForRequests("logging").on("getEventsLog", getEventsLog)
}

async function receiveNotification(notification: CoreNotification) {
    const logString: String = createLogString(notification);
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
