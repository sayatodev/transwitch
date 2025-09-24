import { getCompanyColor } from "@/scripts/utils/styles";
import { RouteListEntry } from "hk-bus-eta";

export function RouteChip(route: RouteListEntry) {
  return (
    <div
      className={`${getCompanyColor(
        route.co[0]
      )} font-bold w-12 text-center py-0.5 rounded-sm min-h-0`}
    >
      {route.route}
    </div>
  );
}
