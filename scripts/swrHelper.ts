import useSWR, { SWRConfiguration, type Fetcher } from "swr";
import type { BusEtaApi } from "./apis/busEta";
import type { useBusEtaApi } from "./contexts/busEtaApi";
import type { Eta } from "hk-bus-eta";

export const jsonFetcher: Fetcher = (
  ...args: [input: RequestInfo, init?: RequestInit | undefined]
) => fetch(...args).then((res) => res.json());

// Helpers for BusEtaApi with SWR

type BusEtaApiFetchKey = "getEta";
type BusEtaApiFetchArgs<K extends BusEtaApiFetchKey> = K extends "getEta"
  ? Parameters<typeof BusEtaApi.prototype.getEta>
  : never;
type BusEtaApiReturnType<K extends BusEtaApiFetchKey> = K extends "getEta"
  ? ReturnType<typeof BusEtaApi.prototype.getEta>
  : never;

type BusEtaApiSWRFetcher<K extends BusEtaApiFetchKey> = Fetcher<
  BusEtaApiReturnType<K>,
  BusEtaApiSWRFetcherArgs<K>
>;
type BusEtaApiSWRFetcherArgs<K extends BusEtaApiFetchKey> = [
  BusEtaApi<"initialized">,
  ...BusEtaApiFetchArgs<K>
];

export const busEtaApiEtasFetcher: BusEtaApiSWRFetcher<"getEta"> = ([
  api,
  ...args
]) => api.getEta(...args);

/* === Generic SWR hook for BusEtaApi === */
type SWRBusEtaApiReturnBase = { error: Error | null; isLoading: boolean };

/* signature overloads */
export function useSWRBusEtaApi(
  key: "getEta",
  api: BusEtaApi<"initialized">,
  ...args: BusEtaApiFetchArgs<"getEta">
): { etas: Eta[] | null } & SWRBusEtaApiReturnBase;

/* function body */
export function useSWRBusEtaApi<K extends BusEtaApiFetchKey>(
  key: K,
  api: BusEtaApi<"initialized">,
  ...args: BusEtaApiFetchArgs<K>
): any & SWRBusEtaApiReturnBase {
  let fetcher: BusEtaApiSWRFetcher<K> | null = null;
  const config: SWRConfiguration = {};
  switch (key) {
    case "getEta":
      fetcher = busEtaApiEtasFetcher as BusEtaApiSWRFetcher<K>;
      config.focusThrottleInterval = 30000; // 30s
      break;
    default:
      fetcher = null;
  }
  if (!fetcher) throw new Error(`Unsupported key: ${key}`);

  const { data, error, isLoading } = useSWR(
    [api, ...args] as BusEtaApiSWRFetcherArgs<K>,
    fetcher,
    config
  );
  const resultsBase = {
    error,
    isLoading,
  };
  switch (key) {
    case "getEta":
      return { etas: data, ...resultsBase };
    default:
      throw new Error(`Unsupported key: ${key}`);
  }
}
