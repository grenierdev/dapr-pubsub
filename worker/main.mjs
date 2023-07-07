import { DaprServer, DaprPubSubStatusEnum } from "@dapr/dapr";

const daprHost = "127.0.0.1";
const daprPort = 3500;

const server = new DaprServer({
	daprHost,
	daprPort,
});

//const stream = await client.pubsub.subscribe("pubsub", "topic-a", async (data, headers) => {
await server.pubsub.subscribe("pubsub", "topic-a", async (data, headers) => {
	console.log("Received message from topic-a: ", data, headers);
	return DaprPubSubStatusEnum.SUCCESS;
});

await server.start();