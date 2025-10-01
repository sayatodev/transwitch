import useSWR, { SWRConfiguration, type Fetcher } from "swr";
import type { BusEtaApi } from "./apis/busEta";
import type { useBusEtaApi } from "./contexts/busEtaApi";
import type { Eta } from "hk-bus-eta";

export const jsonFetcher: Fetcher = (
  ...args: [input: RequestInfo, init?: RequestInit | undefined]
) => fetch(...args).then((res) => res.json());

// Helpers for BusEtaApi with SWR
export function useSWRGetEta(
  api: BusEtaApi<"initialized">,
  routeId: string,
  stopSeq: number,
  callback?: (etas: string[]) => void
) {
  const fetcher: Fetcher<
    Eta[],
    [BusEtaApi<"initialized">, string, number]
  > = async ([api, routeId, stopSeq]: [
    BusEtaApi<"initialized">,
    string,
    number
  ]) => {
    const etas = await api.getEta(routeId, stopSeq);
    if (callback) {
      callback(etas.map((e) => e.eta || ""));
    }
    return etas;
  };

  const { data, error, isLoading } = useSWR([api, routeId, stopSeq], fetcher, {
    focusThrottleInterval: 30000, // 30s
  });

  return { etas: data, error, isLoading };
}
