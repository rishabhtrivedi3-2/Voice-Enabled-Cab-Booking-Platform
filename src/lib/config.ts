import { MockRideProvider } from "./providers/mockRideProvider";

export function getRideProvider() {
  // we always use mock for now
  return new MockRideProvider();
}
