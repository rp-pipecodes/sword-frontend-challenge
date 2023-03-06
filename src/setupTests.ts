import { beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import "whatwg-fetch";
import { rest } from "msw";
import AUTH_MOCK from "./components/__tests__/mocks/auth.mock.json";

export const restHandlers = [
  rest.get(
    `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/${
      AUTH_MOCK.user.uid
    }/bookmarks.json`,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json([]));
    }
  ),
];
export const server = setupServer(...restHandlers);

// Start server before all tests
beforeAll(() => server.listen());

//  Close server after all tests
afterAll(() => server.close());

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers());
