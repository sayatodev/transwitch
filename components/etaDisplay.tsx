import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { useSWRBusEtaApi } from "@/scripts/swrHelper";
import { toHHMM } from "@/scripts/utils/strings";
import { RouteListEntry } from "hk-bus-eta";
import { Skeleton } from "./ui/skeleton";

interface IEtaDisplayProps {
  route: RouteListEntry;
  stopSeq: number;
}

export function EtaDisplay(props: IEtaDisplayProps) {
  const { etas, error, isLoading } = useSWRBusEtaApi(
    "getEta",
    useBusEtaApi(),
    props.route,
    props.stopSeq
  );

  if (error) return <div>failed to load</div>;
  if (isLoading || !etas) return (
    <div className="space-y-1">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-10" />
    </div>
  );
  return (
    <>
      {etas.map((eta, index) => (
        <div key={`eta-text-${index}`}>
          {eta.eta ? toHHMM(new Date(eta.eta)) : "No ETA"}
        </div>
      ))}
    </>
  );
}
