import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { useSWRBusEtaApi } from "@/scripts/swrHelper";
import { toHHMM } from "@/scripts/utils/strings";
import { RouteListEntry } from "hk-bus-eta";
import { Skeleton } from "./ui/skeleton";

interface IEtaDisplayProps {
  route: RouteListEntry;
  stopName?: string;
  stopSeq: number;
}

export function EtaDisplay(props: IEtaDisplayProps) {
  const { etas, error, isLoading } = useSWRBusEtaApi(
    "getEta",
    useBusEtaApi(),
    props.route,
    props.stopSeq
  );

  if (error) {
    console.error(error);
    return <div>failed to load</div>;
  }
  if (isLoading)
    return (
      <div className="flex space-y-1">
        <div className="flex-1 whitespace-nowrap w-full min-w-0 overflow-hidden text-ellipsis">
          {props.stopName}
        </div>
        <Skeleton className="h-4 w-10" />
      </div>
    );
  console.log("etas", props.route, etas);

  return (
    <div className="flex flex-wrap gap-1 leading-6 min-w-0 overflow-hidden">
      <div className="flex-1 whitespace-nowrap w-full min-w-0 overflow-hidden text-ellipsis">
        {props.stopName}
      </div>
      {etas && etas.length ? (
        etas.map((eta, index) => (
          <div key={`eta-text-${index}`} className="text-end ml-auto">
            {eta.eta && eta.eta.length
              ? toHHMM(new Date(eta.eta))
              : eta.remark.en || "N/A"}
          </div>
        ))
      ) : (
        <div className="text-end ml-auto">N/A</div>
      )}
    </div>
  );
}
