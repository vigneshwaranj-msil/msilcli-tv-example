import { MessageRequest } from "@msf/msf-charts-helper/dist/device-interface";

/**
 * @method responseFromExternalInterfaces
 * @description This will handle all the different types of event response from Interfaces like JSInterface, Webkit.MessageHanlders or Iframe Message Channel
 * @param {MessageRequest} request
 */
export default function responseFromExternalInterfaces(request: MessageRequest) {
    switch (request.type) {
        default:
            console.log(`Event ${request.type} received from Interface`)
    }
}