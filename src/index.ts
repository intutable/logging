import { CoreNotification, CoreRequest, CoreResponse, PluginLoader } from "../../core";

export async function init(plugin: PluginLoader) {
    plugin.listenForAllNotifications(receiveNotification)
}

async function receiveNotification(notification: CoreNotification) {
    const logString: String = createLogString(notification);
    logConsole(logString)
}

function createLogString({ channel, method, ...parameters }: CoreNotification): String {
    let logString: String = new Date().toISOString()
    logString += `\tchannel: "${channel}", method: "${method}",`
    for (const key in parameters) {
        logString += ` ${key}: "${parameters[key]}",`
    }
    return logString.slice(0, -1) // remove last comma
}

function logConsole(logString: String) {
    console.log(logString)
}
