import path from "path";
import {Core, CoreNotification} from '../../core/'

const PLUGIN_PATH = path.join(__dirname, "../")

const notification: CoreNotification = { 
    channel: "channel", method: "method", param1: "this is param1",  param2: "this is param2"
};

let core: Core

beforeAll(async () => {
    core = await Core.create([PLUGIN_PATH]);

    // dummy handler to avoid undefinded-notification-handler exception
    core.events.listenForNotifications(notification.channel, notification.method, 
                                        (notification: CoreNotification) => {})
})

afterAll(async () => {
    await core.plugins.closeAll()
})

describe("test logging", () => {
    
    test("log console", async () => {
        console.log = jest.fn()

        await core.events.notify(notification)

        expect(console.log).toHaveBeenCalled()
    })

})