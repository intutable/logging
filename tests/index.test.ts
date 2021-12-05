import path from "path";
import {Core, CoreNotification} from "@intutable/core"

const PLUGIN_PATH = path.join(__dirname, "../")

const notification: CoreNotification = { 
    channel: "channel", method: "method", param1: "this is param1",  param2: "this is param2"
};

let core: Core

beforeAll(async () => {
    core = await Core.create([PLUGIN_PATH])

    // dummy handler to avoid undefinded-notification-handler exception
    core.events.listenForNotifications(notification.channel, notification.method, 
                                        (notification: CoreNotification) => {})
})

afterAll(async () => {
    await core.plugins.closeAll()
})

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("test logging", () => {
    
    test("log console", async () => {
        const consoleSpy = jest.spyOn(console, 'log')

        await core.events.notify(notification)
        
        expect(consoleSpy).toHaveBeenCalled()
        const loggedMessage = consoleSpy.mock.calls[0][0]
        const loggedJSON = JSON.parse(loggedMessage)
        expect(Date.parse(loggedJSON.date)).not.toBeNaN()
        expect(loggedJSON.notification).toEqual(notification)
    })

})