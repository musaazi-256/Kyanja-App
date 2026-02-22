// Next.js requires the middleware to be in a file named `middleware.ts` and
// the function to be exported as `middleware`. The actual logic lives in
// proxy.ts so it can be tested and imported independently.
export { proxy as middleware, config } from './proxy'