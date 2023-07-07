import { DaprClient } from "@dapr/dapr";

const daprHost = "127.0.0.1";
const daprPort = process.env.DAPR_HTTP_PORT ?? 3500;

const client = new DaprClient({
	daprHost,
	daprPort,
});

setInterval(async () => {
	const resp = await client.pubsub.publish("pubsub", "topic-a", { message: "Hello World!" });
	console.log("Published message to topic-a: ", resp);
}, 2000);