export type RpcMethod<TRequest, TResponse> = (
  req: TRequest,
) => Promise<TResponse>;

/**
 * An array of the types of all arguments from a function
 */
export type FunctionArguments<F> = F extends (...args: infer A) => unknown ? A
  : never;

export type FunctionResponse<F> = F extends (...args: unknown[]) => infer R ? R
  : never;
