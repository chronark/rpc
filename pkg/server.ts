import { FunctionArguments, FunctionResponse, RpcMethod } from "./types.ts";
import { RequestMessage, ResponseMessage } from "./message.ts";
export class Server<TService extends { [name: string]: RpcMethod<any, any> }> {
  private methods: TService;
  constructor(methods: TService) {
    this.methods = methods;
  }

  public async listen(port: number) {
    const srv = Deno.listen({ port });

    for await (const conn of srv) {
      const httpConn = Deno.serveHttp(conn);

      for await (const event of httpConn) {
        const rpcMatch = new URLPattern({ pathname: "/rpc" });
        if (!rpcMatch.exec(event.request.url)) {
          return event.respondWith(new Response("Not found", { status: 404 }));
        }

        const { method, request } = RequestMessage.deserialize<{
          method: keyof TService;
          request: FunctionArguments<TService[keyof TService]>[0];
        }>(await event.request.text()).content;

        await this.methods[method](request)
          .then(
            (response: Awaited<FunctionResponse<TService[keyof TService]>>) => {
              return event.respondWith(
                new Response(
                  new ResponseMessage<TService>({ response }).serialize(),
                  {
                    status: 200,
                  },
                ),
              );
            },
          )
          .catch((err) => {
            return event.respondWith(
              new Response(err.message, { status: 500 }),
            );
          });
      }
    }
  }
}
