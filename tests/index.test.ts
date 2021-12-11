import path from "path"
import {Core, CoreNotification} from "@intutable/core"
import {getEventsLog} from "../src/requests"

const PLUGIN_PATH = path.join(__dirname, "../")

const notification1: CoreNotification = { 
    channel: "channel1", method: "method1", param: "this is param"
}

const notification2: CoreNotification = { 
    channel: "channel2", method: "method2", param1: "this is param1",  param2: "this is param2"
}

let core: Core

beforeAll(async () => {
    core = await Core.create([PLUGIN_PATH])

    // dummy handler to avoid undefinded-notification-handler exception
    core.events.listenForNotifications(notification1.channel, notification1.method, 
        (notification: CoreNotification) => {})
    core.events.listenForNotifications(notification2.channel, notification2.method, 
        (notification: CoreNotification) => {})
})

afterAll(async () => {
    await core.plugins.closeAll()
})

function loggedMassageValid(massage: string, notification: CoreNotification) {
    const loggedJSON = JSON.parse(massage)
    expect(Date.parse(loggedJSON.date)).not.toBeNaN()
    expect(loggedJSON.notification).toEqual(notification)
}

describe("log console", () => {
    
    test("notifications logged on console", async () => {
        const consoleSpy = jest.spyOn(console, 'log')

        await core.events.notify(notification1)
        await core.events.notify(notification2)
        
        expect(consoleSpy).toHaveBeenCalledTimes(2)

        const loggedMessage1 = consoleSpy.mock.calls[0][0]
        const loggedMessage2 = consoleSpy.mock.calls[1][0]
        loggedMassageValid(loggedMessage1, notification1)
        loggedMassageValid(loggedMessage2, notification2)
    })

})

describe("getEventsLog endpoint", () => {

    test("single notification-event requested", async () => {
        await core.events.notify(notification1)
        await core.events.notify(notification2)
        await core.events.notify(notification1)
        
        const coreResponse: any = await core.events.request(getEventsLog(1));
        const events: CoreNotification[] = coreResponse.events
        expect(events).toEqual([notification1])
    })

    test("multiple notification-events requested", async () => {
        await core.events.notify(notification1)
        await core.events.notify(notification2)
        await core.events.notify(notification1)
        
        const coreResponse: any = await core.events.request(getEventsLog(3));
        const events: CoreNotification[] = coreResponse.events
        expect(events).toEqual([notification1, notification2, notification1])
    })

    test("too many notification-events requested", async () => {
        await core.events.notify(notification1)
        
        const coreResponse: any = await core.events.request(getEventsLog(500));
        const events: CoreNotification[] = coreResponse.events
        expect(events.length).toBeLessThan(500)
        expect(events[events.length - 1]).toEqual(notification1)
    })

})