import type { RequestHandler } from './$types';
export const prerender = false;

export const GET: RequestHandler = async () => {
  return new Response();
};