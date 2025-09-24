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
  const { busEtaApi, error, isLoading } = useSWRBusEtaApi(
    "initDb",
    useBusEtaApi()
  );

  const { option } = props;

  if (error) return <div>failed to load</div>;
  if (isLoading || !busEtaApi) return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            className="mb-2 flex gap-3 items-center"
          >
            <RouteChip {...route} />
            <div className="flex flex-col flex-1">
              {[segment.fromSeq, segment.toSeq].map((seq, i) => (
                <div key={`seq-${i}`} className="flex justify-between">
                  <div>
                    {busEtaApi.getRouteStopNameBySeq(
                      route,
                      seq,
                      "en",
                      route.co[0]
                    )}
                  </div>
                  <div className="flex-1 justify-end flex gap-2">
                    <EtaDisplay route={route} stopSeq={seq} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
