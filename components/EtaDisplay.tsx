"use client";

import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { toHHMM } from "@/scripts/utils/strings";
import { RouteListEntry } from "hk-bus-eta";
import { Skeleton } from "./ui/skeleton";
import { useEffect } from "react";
import { useSWRGetEta } from "@/scripts/swrHelper";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  CrossPlatformTooltip,
} from "./ui/tooltip";
import { AlertCircle } from "lucide-react";

interface IEtaDisplayProps {
  routeId: string;
  route: RouteListEntry;
  stopName?: string;
  stopSeq: number;
  highlightTarget: number;
  setEtas: (etas: string[]) => void;
}

export function EtaDisplay(props: IEtaDisplayProps) {
  const { etas, error, isLoading } = useSWRGetEta(
    useBusEtaApi(),
    props.routeId,
    props.stopSeq
  );

  useEffect(() => {
    props.setEtas(etas?.map((e) => e.eta || "") || []);
  }, [etas]);

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
        etas.map((eta, index) => {
          const hasEta = eta.eta && eta.eta.length;
          const remark = eta.remark.en;
          const isTargetClass =
            props.highlightTarget === index ? "font-bold text-blue-600" : "";
          return (
            <div
              key={`eta-text-${index}`}
              className={`text-end ml-auto ${isTargetClass} flex items-center justify-end gap-1`}
            >
              {hasEta ? (
                remark ? (
                  <CrossPlatformTooltip
                    content={remark}
                    className="translate-y-2 max-w-[80vw]"
                  >
                    <span className="underline decoration-dotted underline-offset-2">
                      {toHHMM(new Date(eta.eta))}
                    </span>
                  </CrossPlatformTooltip>
                ) : (
                  <span>{toHHMM(new Date(eta.eta))}</span>
                )
              ) : remark ? (
                <CrossPlatformTooltip
                  content={remark}
                  className="translate-y-2 max-w-[80vw]"
                >
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CrossPlatformTooltip>
              ) : (
                <span>N/A</span>
              )}
            </div>
          );
        })
      ) : (
        <div className="text-end ml-auto">N/A</div>
      )}
    </div>
  );
}
