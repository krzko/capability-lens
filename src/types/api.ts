import { NextRequest } from 'next/server';

export type RouteContext<T> = {
  params: T;
};

export type RouteHandler<T = unknown> = (
  request: NextRequest,
  context: RouteContext<T>
) => Promise<Response>;
