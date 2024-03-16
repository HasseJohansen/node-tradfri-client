import Bonjour from "bonjour-service";

export interface DiscoveredGateway {
	name: string;
	host?: string;
	version: string;
	addresses?: string[];
}

/**
 * Auto-discover a tradfri gateway on the network.
 * @param timeout (optional) Time in milliseconds to wait for a response. Default 10000.
 * Pass false or a negative number to explicitly wait forever.
 */
export function discoverGateway(timeout: number | false = 10000): Promise<DiscoveredGateway | null> {
	const bonjour = new Bonjour()
	let timer: NodeJS.Timer;

	return new Promise((resolve) => {

                bonjour.find({ type: 'coap', protocol: 'udp' }, function (service) {
			console.log('Found a COAP endpoint:', service)
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
