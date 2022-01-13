import { FunctionArguments, FunctionResponse } from "./types.ts";

export class RequestMessage<TService> {
  public readonly content: {
    method: keyof TService;
    request: FunctionArguments<TService[keyof TService]>[0];
  };
  constructor(content: {
    method: keyof TService;
    request: FunctionArguments<TService[keyof TService]>[0];
  }) {
    this.content = content;
  }

  public serialize(): string {
    return JSON.stringify(this.content);
  }

  static deserialize<TService>(s: string): RequestMessage<TService> {
    const content = JSON.parse(s) as {
      method: keyof TService;
      request: FunctionArguments<TService[keyof TService]>[0];
    };

    return new RequestMessage<TService>(content);
  }
}

export class ResponseMessage<TService> {
  public readonly content: {
    response: Awaited<FunctionResponse<TService[keyof TService]>>;
  };
  constructor(content: {
    response: Awaited<FunctionResponse<TService[keyof TService]>>;
  }) {
    this.content = content;
  }

  public serialize(): string {
    return JSON.stringify(this.content);
  }

  static deserialize<TService>(s: string): ResponseMessage<TService> {
    const content = JSON.parse(s) as {
      response: Awaited<FunctionResponse<TService[keyof TService]>>;
    };

    return new ResponseMessage<TService>(content);
  }
}
