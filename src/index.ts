import { CoreNotification, CoreRequest, CoreResponse, PluginLoader } from "@intutable/core"

export async function init(plugin: PluginLoader) {
    plugin.listenForNotifications("channel").on("method", receiveNotification)
    //plugin.listenForAllNotifications(receiveNotification)
}

async function receiveNotification(notification: CoreNotification) {
    const logString: String = createLogString(notification);
    logConsole(logString)
}

function createLogString(notification: CoreNotification): String {
    let date:String = new Date().toISOString()
    return JSON.stringify({date,notification})
}

function logConsole(logString: String) {
    console.log(logString)
}
