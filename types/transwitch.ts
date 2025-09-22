export type Switch = {
  id: string;
  name: string;
  combinations: SwitchOption[];
}

export type SwitchOption = {
  name: string;
  segments: RouteSegment[];
}

export type RouteSegment = {
  routeId: string;
  fromSeq: number;
  toSeq: number;
  baseDuration: number;
}