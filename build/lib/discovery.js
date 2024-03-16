"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discoverGateway = void 0;
const bonjour_service_1 = require("bonjour-service");
/**
 * Auto-discover a tradfri gateway on the network.
 * @param timeout (optional) Time in milliseconds to wait for a response. Default 10000.
 * Pass false or a negative number to explicitly wait forever.
 */
function discoverGateway(timeout = 10000) {
    const bonjour = new bonjour_service_1.default();
    let timer;
    return new Promise((resolve) => {
        bonjour.find({ type: 'coap', protocol: 'udp' }, function (service) {
            console.log('Found a COAP endpoint:', service);
            // extract the data
            const name = service.name;
            const host = service.host;
            const version = service.txt.version;
            const addresses = service.addresses;
            clearTimeout(timer);
            resolve({
                name, host, version, addresses,
            });
        });
        if (typeof timeout === "number" && timeout > 0) {
            timer = setTimeout(() => {
                resolve(null);
            }, timeout);
        }
    });
}
exports.discoverGateway = discoverGateway;
