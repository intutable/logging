/**
 * Contains the requests of the logging plugin.
 * @module
 */

import { CoreRequest } from "@intutable/core"

/**
 * Creates a prepared CoreRequest to access the event log.
 * @param numberOfEvents specifies the number of events to return.
 * @returns {CoreRequest} the prepared CoreRequest
 */
export function getEventsLog(numberOfEvents: number): CoreRequest {
    return {
        channel: "logging",
        method: "getEventsLog",
        numberOfEvents
    }
}