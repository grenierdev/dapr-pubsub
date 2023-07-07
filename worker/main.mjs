import { DaprServer, DaprPubSubStatusEnum } from "@dapr/dapr";

const daprHost = "127.0.0.1";
const daprPort = process.env.DAPR_HTTP_PORT ?? 3500;

const server = new DaprServer({
	daprHost,
	daprPort,
});

await server.pubsub.subscribe("pubsub", "topic-a", async (data, headers) => {
	console.log("Received message from topic-a: ", data, headers);
	return DaprPubSubStatusEnum.SUCCESS;
});

console.log("Subscribed to topic-a");

await server.start();