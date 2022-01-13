import { FunctionArguments, FunctionResponse, RpcMethod } from "./types.ts";
import { RequestMessage, ResponseMessage } from "./message.ts";
export class Client<TService extends Record<string, RpcMethod<any, any>>> {
  private serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
  }
  public async call(
    method: keyof TService,
    request: FunctionArguments<TService[keyof TService]>[0],
  ): Promise<FunctionResponse<TService[keyof TService]>> {
    const msg = new RequestMessage<TService>({
      method: method.toString(),
      request,
    });

    const res = await fetch(`${this.serverUrl}/rpc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: msg.serialize(),
    });
    if (!res.ok) {
      throw new Error(`RPC unsuccessful: ${await res.text()}`);
    }
    const body = await res.text();
    return ResponseMessage.deserialize<TService>(body).content.response;
  }
}
