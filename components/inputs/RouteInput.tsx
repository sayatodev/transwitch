"use client";
import { useSWRBusEtaApi } from "@/scripts/swrHelper";
import {
  ComboboxCommandOption,
  VirtualizedCombobox,
} from "../customUi/VirtualizedCombobox";
import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { RouteListEntry } from "hk-bus-eta";

type RouteInputProps = {
  onChange: (value: string) => void;
};

export function RouteInput({ onChange }: RouteInputProps) {
  const { busEtaApi, error, isLoading } = useSWRBusEtaApi(
    "initDb",
    useBusEtaApi()
  );
  if (error) return <div>failed to load</div>;
  if (isLoading || !busEtaApi) return <div>loading...</div>;

  const options = Object.entries(
    busEtaApi.etaDb?.routeList ?? {}
  ).map<ComboboxCommandOption>(([id, route]: [string, RouteListEntry]) => {
    return {
      value: id,
      label: `${route.route} - ${route.dest.en} ${
        route.serviceType.toString() !== "1" ? ` (特別班次${route.serviceType})` : ""
      }`,
    };
  });

  return (
    <div className="w-full min-w-0">
      <VirtualizedCombobox
        options={options}
        className="w-full min-w-0 [&>*]:min-w-0"
        searchPlaceholder="Search route..."
        onChange={onChange}
      />
    </div>
  );
}
