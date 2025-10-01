"use client";
import {
  ComboboxCommandOption,
  VirtualizedCombobox,
} from "../customUi/VirtualizedCombobox";
import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { RouteListEntry } from "hk-bus-eta";
import { Skeleton } from "@/components/ui/skeleton";

type RouteInputProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function RouteInput({ value, onChange }: RouteInputProps) {
  const busEtaApi = useBusEtaApi();
  
  const options = busEtaApi.getRouteEntries().map<ComboboxCommandOption>(([id, route]: [string, RouteListEntry]) => {
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
        value={value}
        className="w-full min-w-0 [&>*]:min-w-0"
        searchPlaceholder="Search route..."
        onChange={onChange}
      />
    </div>
  );
}
