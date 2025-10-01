"use client";
import {
  ComboboxCommandOption,
  VirtualizedCombobox,
} from "../customUi/VirtualizedCombobox";
import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { Skeleton } from "@/components/ui/skeleton";

type StopInputProps = {
  routeId: string;
  value?: number;
  onChange: (sequence: number) => void;
};

export function StopInput({ routeId, value, onChange }: StopInputProps) {
  const busEtaApi = useBusEtaApi();
  
  if (!routeId) {
    return (
      <div className="w-full min-w-0 text-sm text-muted-foreground">
        Please select a route first
      </div>
    );
  }

  const route = busEtaApi.tryGetRoute(routeId);
  
  if (!route) {
    return (
      <div className="w-full min-w-0 text-sm text-destructive">
        Route not found
      </div>
    );
  }

  // Get the primary company for this route
  const primaryCompany = route.co[0];
  const stops = route.stops[primaryCompany];

  const options = stops.map<ComboboxCommandOption>((stopId, index) => {
    const stopName = busEtaApi.getRouteStopNameById(stopId, "en");
    return {
      value: index.toString(),
      label: `${index + 1}. ${stopName}`,
    };
  });

  const handleChange = (value: string) => {
    const sequence = parseInt(value, 10);
    if (!isNaN(sequence)) {
      onChange(sequence);
    }
  };

  return (
    <div className="w-full min-w-0">
      <VirtualizedCombobox
        options={options}
        value={value !== undefined ? value.toString() : undefined}
        className="w-full min-w-0 [&>*]:min-w-0"
        searchPlaceholder="Search stop..."
        onChange={handleChange}
      />
    </div>
  );
}
