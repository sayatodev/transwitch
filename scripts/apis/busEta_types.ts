import { EnsureKeySubset } from "@/types/util";
import { Company, EtaDb, RouteListEntry } from "hk-bus-eta";

export type RouteSearchOptions = {
  value: string;
  companyFilter?: Company[];
};

export type StopName = EtaDb["stopList"][number]["name"];
