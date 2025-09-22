import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { useSWRBusEtaApi } from "@/scripts/swrHelper";
import { toHHMM } from "@/scripts/utils/strings";
import { RouteListEntry } from "hk-bus-eta";

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
  if (isLoading || !etas) return <div>loading...</div>;
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
