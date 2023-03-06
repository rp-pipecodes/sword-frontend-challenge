import { beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import "whatwg-fetch";

export const restHandlers = [];
export const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen());

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
