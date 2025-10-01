import { fetchEtaDb, fetchEtas } from "hk-bus-eta";
import type { Company, Eta, EtaDb, RouteListEntry } from "hk-bus-eta";
import type { RouteSearchOptions } from "./busEta_types";
import { toNormalCase } from "../utils/strings";

export class BusEtaApi<
  initialized extends "initialized" | "uninitialized" = "uninitialized"
> {
  private etaDb: initialized extends "initialized" ? EtaDb : null;

  constructor() {
    const value = null as initialized extends "initialized" ? EtaDb : null;
    this.etaDb = value;
  }

  isInitialized(): this is BusEtaApi<"initialized"> {
    return this.etaDb !== null;
  }

  init(etaDb: EtaDb): asserts this is BusEtaApi<"initialized"> {
    (this as BusEtaApi<any>).etaDb = etaDb;
  }

  searchRoutes(options: RouteSearchOptions): RouteListEntry[] {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }

    const routeList = this.etaDb.routeList;

    const matchedRoutes = Object.values(routeList).filter((route) => {
      const matchesValue = route.route.includes(options.value);
      return matchesValue;
    });

    return matchedRoutes;
  }

  getRouteEntries(): [string, RouteListEntry][] {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }
    return Object.entries(this.etaDb?.routeList);
  }

  searchRouteIds(options: RouteSearchOptions): string[] {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }

    const routeList = this.etaDb.routeList;

    const matchedRoutes = Object.entries(routeList).filter(([, route]) => {
      const matchesValue = route.route.includes(options.value);
      return matchesValue;
    });

    return matchedRoutes.map(([id]) => id);
  }

  getRouteId(route: RouteListEntry): string | null {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }

    return this.getRouteEntries().find(([, r]) => r === route)?.[0] ?? null;
  }

  getRoute(routeId: string): RouteListEntry {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }

    if (!(routeId in this.etaDb.routeList)) {
      throw new Error(`Route ID ${routeId} not found`);
    }

    return this.etaDb.routeList[routeId];
  }

  tryGetRoute(routeId: string): RouteListEntry | null {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }

    const route = this.etaDb.routeList[routeId];
    if (!route) {
      return null;
    }

    return route;
  }

  async getEta(
    routeResolvable: string | RouteListEntry,
    stopSeq: number,
  ): Promise<Eta[]> {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }

    let route: RouteListEntry;
    if (typeof routeResolvable === "string") {
      route = this.getRoute(routeResolvable);
    } else {
      route = routeResolvable;
    }

    const etas = await fetchEtas({
      ...route,
      seq: stopSeq,
      language: "en",
      holidays: this.etaDb.holidays,
      serviceDayMap: this.etaDb.serviceDayMap,
      stopList: this.etaDb.stopList,
    });

    return etas;
  }

  getRouteStopId(
    route: RouteListEntry,
    stopSeq: number,
    company: Company
  ): string {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }
    const stop = route.stops[company][stopSeq];
    if (!stop) {
      throw new Error(
        `Stop sequence ${stopSeq} not found in route ${route.route}`
      );
    }
    return stop;
  }

  getRouteStopNameById(stopId: string, language: "en" | "zh"): string {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }
    const stop = this.etaDb.stopList[stopId];
    if (!stop) {
      throw new Error(`Stop ID ${stopId} not found`);
    }
    return stop.name[language];
  }

  getRouteStopNameBySeq(
    routeResolvable: string | RouteListEntry,
    stopSeq: number,
    language: "en" | "zh",
    company: Company
  ): string {
    if (!this.isInitialized()) {
      throw new Error("BusEtaApi not initialized");
    }

    let route: RouteListEntry;
    if (typeof routeResolvable === "string") {
      route = this.getRoute(routeResolvable);
    } else {
      route = routeResolvable;
    }

    const stopId = this.getRouteStopId(route, stopSeq, company);
    if (language == "en") {
      if (
        this.getRouteStopNameById(stopId, "en") ===
        this.getRouteStopNameById(stopId, "zh")
      ) {
        // If names are the same in both languages, return as-is
        // so that we don't convert to camel case unnecessarily
        return this.getRouteStopNameById(stopId, language);
      }
      // Else, convert to camel case
      return toNormalCase(this.getRouteStopNameById(stopId, language));
    }
    // Chinese, return as-is
    return this.getRouteStopNameById(stopId, language);
  }
}
