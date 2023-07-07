import { DaprClient } from "@dapr/dapr";

const daprHost = "127.0.0.1";
const daprPort = 3500;

const client = new DaprClient({
	daprHost,
	daprPort,
});

setInterval(async () => {
	await client.pubsub.publish("pubsub", "topic-a", { message: "Hello World!" });
}, 2000);