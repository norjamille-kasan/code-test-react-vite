import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="p-2 h-14 items-center flex gap-2">
          <span className="text-xl">r/SpaceX | Launches</span>
        </div>
        <hr />
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
});
