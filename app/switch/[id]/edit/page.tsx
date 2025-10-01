"use client";

import { EditSegmentModalTrigger } from "@/components/modals/EditSegmentModal";
import { RouteChip } from "@/components/RouteChip";
import { Heading2 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { BusEtaApi } from "@/scripts/apis/busEta";
import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import {
  CombinationSchema,
  SegmentSchema,
  SwitchSchema,
  useUserSwitches,
} from "@/scripts/contexts/userSwitches";
import { toNormalCase } from "@/scripts/utils/strings";
import { RouteSegment, SegmentSetter, Switch } from "@/types/transwitch";
import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import SwitchNotFound from "@/app/switch/not-found";

type CombinationFormData = {
  name: string;
  segments: RouteSegment[];
};

export default function EditSwitchView() {
  const { switches, updateSwitch } = useUserSwitches();
  const { id } = useParams();
  const router = useRouter();
  const [switchName, setSwitchName] = useState("");
  const [combinations, setCombinations] = useState<CombinationFormData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!switches) return;
    
    const targetSwitch = switches.find((s) => s.id === id);
    if (targetSwitch) {
      setSwitchName(targetSwitch.name);
      setCombinations(targetSwitch.combinations);
      setIsLoaded(true);
    }
  }, [switches, id]);

  if (!switches) return <Skeleton className="h-6 w-32" />;
  
  const targetSwitch = switches.find((s) => s.id === id);
  if (!targetSwitch) return <SwitchNotFound />;

  if (!isLoaded) return <Skeleton className="h-6 w-32" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!switchName || switchName.trim() === "") {
      alert("Name is required");
      return;
    }
    
    const updatedSwitch = {
      id: id as string,
      name: switchName,
      combinations,
    };

    const parseResult = SwitchSchema.safeParse(updatedSwitch);
    if (!parseResult.success) {
      alert("Validation failed: " + JSON.stringify(parseResult.error.issues));
      return;
    }

    updateSwitch(id as string, updatedSwitch);
    alert("Switch updated!");
    router.push(`/switch/${id}/view`);
  };

  return (
    <div className="w-full flex flex-col">
      <form id="edit-switch-form" className="w-full" onSubmit={handleSubmit}>
        <Heading2>Edit Switch</Heading2>
        <div className="my-4 w-full flex justify-center">
          <div className="w-full flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                form="edit-switch-form"
                id="name"
                name="name"
                type="text"
                value={switchName}
                onChange={(e) => setSwitchName(e.target.value)}
                placeholder="My Morning Commute"
              />
            </div>
            <div className="grid gap-2 mb-2">
              <Label htmlFor="description">Combinations</Label>
              <div className="flex flex-col gap-4">
                {combinations.map((combination, index) => (
                  <CombinationFormCard
                    key={index}
                    combination={combination}
                    setCombination={(updatedCombination) => {
                      const newCombinations = [...combinations];
                      newCombinations[index] = updatedCombination;
                      setCombinations(newCombinations);
                    }}
                    deleteCombination={() => {
                      const newCombinations = combinations.filter((_, i) => i !== index);
                      setCombinations(newCombinations);
                    }}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCombinations([
                    ...combinations,
                    { name: "New Combination", segments: [] },
                  ]);
                }}
              >
                + Add Combination
              </Button>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/switch/${id}/view`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

function CombinationFormCard({
  combination,
  setCombination,
  deleteCombination,
}: {
  combination: CombinationFormData;
  setCombination: (combination: CombinationFormData) => void;
  deleteCombination?: () => void;
}) {
  const busEtaApi = useBusEtaApi();

  const handleNewSegment = (segment: RouteSegment, index?: number): boolean => {
    const route = busEtaApi.getRoute(segment.routeId);

    /* validations */
    if (
      segment.fromSeq >= route.stops[route.co[0]].length ||
      segment.toSeq >= route.stops[route.co[0]].length
    ) {
      alert(
        `From Stop number exceeds the number of stops in route ${
          route.route
        } (${route.stops[route.co[0]].length})`
      );
      return false;
    }
    if (segment.fromSeq >= segment.toSeq) {
      alert("From Stop number must be less than To Stop number");
      return false;
    }

    const parseResult = SegmentSchema.safeParse(segment);
    if (!parseResult.success) {
      alert("Validation failed: " + JSON.stringify(parseResult.error.issues));
      return false;
    }

    const newSegments = [...combination.segments];
    if (index !== undefined) {
      newSegments[index] = segment;
    } else {
      newSegments.push(segment);
    }
    setCombination({ ...combination, segments: newSegments });
    return true;
  };

  const deleteSegment = (index: number): boolean => {
    const newSegments = combination.segments.filter((_, i) => i !== index);
    setCombination({ ...combination, segments: newSegments });
    return true;
  };

  const setSegment: SegmentSetter = (segment, index): boolean => {
    if (segment === null) {
      if (index === undefined)
        throw new Error("Index is required to delete segment");
      return deleteSegment(index);
    } else {
      return handleNewSegment(segment, index);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Input
            value={combination.name}
            onChange={(e) => setCombination({ ...combination, name: e.target.value })}
            className="text-lg font-semibold border-2 px-2 py-1 focus-visible:ring-2 focus-visible:ring-offset-2"
          />
          {deleteCombination && (
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={deleteCombination}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 mb-2">
          {combination.segments.map((segment, index) => (
            <SegmentInputCard
              key={index}
              combinationName={combination.name}
              index={index}
              segment={segment}
              setSegment={setSegment}
              busEtaApi={busEtaApi}
            />
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            const newSegments = [...combination.segments];
            newSegments.push({
              fromSeq: 0,
              toSeq: 0,
              routeId: busEtaApi.searchRouteIds({ value: "1" })[0],
              baseDuration: 0,
            });
            setCombination({ ...combination, segments: newSegments });
          }}
        >
          + Add Segment
        </Button>
      </CardContent>
    </Card>
  );
}

function SegmentInputCard({
  combinationName,
  index,
  segment,
  setSegment,
  busEtaApi,
}: {
  combinationName: string;
  index: number;
  segment: RouteSegment;
  setSegment: SegmentSetter;
  busEtaApi: BusEtaApi<"initialized">;
}) {
  const route = busEtaApi.getRoute(segment.routeId);
  return (
    <Card className="gap-1 min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 leading-5 my-1">
          <RouteChip {...route} />
          <div>{toNormalCase(route.dest.en)}</div>
        </CardTitle>
        <CardAction>
          <EditSegmentModalTrigger
            className="text-gray-800"
            combinationName={combinationName}
            segmentIndex={index}
            segment={segment}
            setSegment={setSegment}
          />
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => {
              setSegment(null, index);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="min-w-0">
        <div className="flex flex-col gap-2 overflow-hidden max-w-full">
          <div className="whitespace-nowrap flex">
            <ArrowUpRight className="inline mr-2 text-green-600" />
            <div className="inline min-w-0 overflow-hidden text-ellipsis flex-1">
              {busEtaApi.getRouteStopNameBySeq(
                route,
                segment.fromSeq,
                "en",
                route.co[0]
              )}
            </div>
          </div>
          <div className="whitespace-nowrap flex">
            <ArrowDownLeft className="inline mr-2 text-red-600" />
            <div className="inline min-w-0 overflow-hidden text-ellipsis flex-1">
              {busEtaApi.getRouteStopNameBySeq(
                route,
                segment.toSeq,
                "en",
                route.co[0]
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
