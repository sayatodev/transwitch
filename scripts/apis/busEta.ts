import { fetchEtaDb, fetchEtas } from "hk-bus-eta";
import type { Company, Eta, EtaDb, RouteListEntry } from "hk-bus-eta";
import type { RouteSearchOptions, StopName } from "./busEta_types";
import { toNormalCase } from "../utils/strings";

export class BusEtaApi {
  etaDb: EtaDb | null = null;

  constructor(onInit?: (api: BusEtaApi) => void) {
    this.init().then(onInit || (() => {}));
    return;
  }

  isInitialized(): this is { etaDb: EtaDb } {
    return this.etaDb !== null;
  }

  async init(): Promise<BusEtaApi> {
    this.etaDb = await fetchEtaDb();
    return this;
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
    stopSeq: number
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
