"use client";

import type { SwitchOption } from "@/types/transwitch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Paragraph } from "./Typography";
import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { useSWRBusEtaApi } from "@/scripts/swrHelper";
import { getCompanyColor } from "@/scripts/utils/styles";
import { EtaDisplay } from "./EtaDisplay";
import { RouteChip } from "./RouteChip";
import { Skeleton } from "./ui/skeleton";

interface ISwitchOptionCardProps {
  option: SwitchOption;
}
export function SwitchOptionCard(props: ISwitchOptionCardProps) {
  const busEtaApi = useBusEtaApi();

  const { option } = props;

  const segments = option.segments.map((sgmt) => ({
    segment: sgmt,
    route: busEtaApi.getRoute(sgmt.routeId),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{option.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {segments.map(({ route, segment }, index) => (
          <div
            key={`segment-${index}`}
            className="[&:not(:last-child)]:pb-3 [&:not(:first-child)]:pt-3 flex gap-3 items-center [&:not(:last-child)]:border-b-1"
          >
            <RouteChip {...route} />
            <div className="flex flex-col flex-1 min-w-0">
              {[segment.fromSeq, segment.toSeq].map((seq, i) => (
                <EtaDisplay
                  key={`seq-${i}`}
                  stopName={busEtaApi.getRouteStopNameBySeq(
                    route,
                    seq,
                    "en",
                    route.co[0]
                  )}
                  route={route}
                  stopSeq={seq}
                />
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
