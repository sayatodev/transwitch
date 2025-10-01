import type { Switch, SwitchOption } from "@/types/transwitch";
import { toHHMM } from "../utils/strings";
import type { Moment } from "moment";
import moment from "moment";

type ControllerEta = {
  displayString: string;
  time: Moment;
  isTarget: boolean;
};

export class SwitchOptionController {
  private option: SwitchOption;
  private segments: {
    routeId: string;
    fromSeq: number;
    fromEtas: ControllerEta[];
    toSeq: number;
    toEtas: ControllerEta[];
    baseDuration: number;
  }[];
  private timeout: ReturnType<typeof setInterval> | null = null;
  private triggerUIUpdate: () => void = () => {};

  constructor(option: SwitchOption, triggerUIUpdate: () => void) {
    this.option = option;
    this.segments = option.segments.map((sgmt) => ({
      routeId: sgmt.routeId,
      fromSeq: sgmt.fromSeq,
      fromEtas: [],
      toSeq: sgmt.toSeq,
      toEtas: [],
      baseDuration: sgmt.baseDuration,
    }));
    this.triggerUIUpdate = () => {
      triggerUIUpdate();
      console.log("UI update triggered");
    };
  }

  setEtas(routeId: string, stopSeq: number, etas: string[]) {
    if (this.timeout) clearTimeout(this.timeout);

    console.log(`Setting etas for`, {
      routeId,
      stopSeq,
      etas,
    });
    const segmentIndex = this.segments.findIndex(
      (seg) =>
        seg.routeId === routeId &&
        (seg.fromSeq === stopSeq || seg.toSeq === stopSeq)
    );

    if (segmentIndex >= 0) {
      const newEtas = etas.map((etaStr) => {
        let etaMoment = moment(etaStr);
        console.log("Parsed eta moment:", etaMoment.format("HH:mm"), "from", etaStr);
        if (etaMoment.diff(moment(), "hour") > 22) {
          // suppose this is a past eta, and not a eta of the next day
          etaMoment = etaMoment.subtract(1, "day");
        }
        return {
          displayString: etaMoment.format("HH:mm"),
          time: etaMoment,
          isTarget: false,
        };
      });

      // Create a new segment object to preserve immutability
      const updatedSegment = { ...this.segments[segmentIndex] };

      let dataupdated = false;
      if (updatedSegment.fromSeq === stopSeq) {
        if (
          JSON.stringify(updatedSegment.fromEtas) !== JSON.stringify(newEtas)
        ) {
          dataupdated = true;
        }
        updatedSegment.fromEtas = newEtas;
      } else {
        if (JSON.stringify(updatedSegment.toEtas) !== JSON.stringify(newEtas)) {
          dataupdated = true;
        }
        updatedSegment.toEtas = newEtas;
      }

      // Create a new segments array with the updated segment
      this.segments = [
        ...this.segments.slice(0, segmentIndex),
        updatedSegment,
        ...this.segments.slice(segmentIndex + 1),
      ];

      if (dataupdated) this.timeout = setTimeout(this.triggerUIUpdate, 1000);
    }

    console.log("Updated segments:", this.segments);

    this.processEtas();
  }

  private processSegmentEtas(
    startTime: Moment,
    baseDuration: number,
    fromEtas: ControllerEta[],
    toEtas: ControllerEta[]
  ): {
    fromTarget: number;
    toTarget: number;
    endtime: Moment;
  } {
    const fromTarget = fromEtas.findIndex((eta) => eta.time.isAfter(startTime));
    if (fromTarget < 0)
      return { fromTarget: -1, toTarget: -1, endtime: moment() };

    const toTarget = toEtas.findIndex((eta) => {
      console.log("Comparing eta times:", {
        etaTime: eta.time.format("HH:mm"),
        thresholdTime: fromEtas[fromTarget].time
          .add(baseDuration, "minutes")
          .format("HH:mm"),
        baseDuration,
        origThresholdTime: fromEtas[fromTarget].time.format("HH:mm"),
      });
      return eta.time.isAfter(
        fromEtas[fromTarget].time.add(baseDuration, "minutes")
      );
    });
    if (toTarget < 0) return { fromTarget, toTarget: -1, endtime: moment() };

    const endtime = toEtas[toTarget].time;
    console.log("Processed segment etas:", {
      fromTarget,
      toTarget,
      endtime,
    });
    return { fromTarget, toTarget, endtime };
  }

  processEtas() {
    let startTime = moment();
    this.segments = this.segments.map((sgmt) => {
      const { fromTarget, toTarget, endtime } = this.processSegmentEtas(
        startTime,
        sgmt.baseDuration,
        sgmt.fromEtas,
        sgmt.toEtas
      );
      startTime = endtime;
      const newFromEtas = sgmt.fromEtas.map((eta, idx) => ({
        ...eta,
        isTarget: idx === fromTarget,
      }));
      const newToEtas = sgmt.toEtas.map((eta, idx) => ({
        ...eta,
        isTarget: idx === toTarget,
      }));
      return {
        ...sgmt,
        fromEtas: newFromEtas,
        toEtas: newToEtas,
      };
    });
    console.log("Processed segments:", this.segments);
  }

  resetEtas() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = null;
    this.segments.forEach((sgmt) => {
      sgmt.fromEtas = [];
      sgmt.toEtas = [];
    });
  }

  getHighlightState(
    routeId: string,
    seqIdx: 0 | 1 /* 0 = fromSeq, 1 = toSeq */
  ): { target: number } {
    const segment = this.segments.find((seg) => seg.routeId === routeId);
    if (!segment) return { target: -1 };
    const etas = seqIdx === 0 ? segment.fromEtas : segment.toEtas;
    if (!etas.length) return { target: -1 };

    const targetIdx = etas.findIndex((eta) => eta.isTarget);
    return { target: targetIdx };
  }
}
