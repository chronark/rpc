import { Client, Server } from "./mod.ts";
type Service = {
  greet: (req: { name: string }) => Promise<string>;
};

const srv = new Server<Service>({
  greet: (req: { name: string }) => Promise.resolve(`Hello ${req.name}`),
});

srv.listen(3000);

console.log("Server up");

const client = new Client<Service>("http://localhost:3000");

const greeting = await client.call("greet", { name: "james" });
console.log(greeting);
