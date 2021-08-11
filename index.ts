import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import FlexSearch from "flexsearch";

import cityList from "./data/cityList.json";

const index = FlexSearch.create({
  profile: "balance",
  doc: {
    id: "id",
    field: ["name", "state", "country"],
  },
});

index.add(cityList);

const app = express();

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
  //connection is up, let's add a simple simple event
  ws.on("message", (message: string) => {
    const results = index.search(message);
    ws.send(JSON.stringify(results));
  });
});

app.get("/country/:id", function (req, res) {
  res.send(req.params);
});

//start our server
const listener = server.listen(8999, () => {
  const address = listener.address() as WebSocket.AddressInfo;
  console.log(`Server started on port ${address.port}`);
});
