import { CoreRequest } from "@intutable/core"

export function getEventsLog(numberOfEvents: number): CoreRequest {
    return {
        channel: "logging",
        method: "getEventsLog",
        numberOfEvents
    }
}