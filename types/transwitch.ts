export type Switch = {
  id: string;
  name: string;
  combinations: SwitchOption[];
};

export type SwitchOption = {
  name: string;
  segments: RouteSegment[];
};

export type RouteSegment = {
  routeId: string;
  fromSeq: number;
  toSeq: number;
  baseDuration: number;
};

export type SegmentSetter = <HasIndex extends "True" | "False">(
  segment: HasIndex extends "True" ? RouteSegment | null : RouteSegment,
  index: HasIndex extends "True" ? number : undefined
) => boolean;
