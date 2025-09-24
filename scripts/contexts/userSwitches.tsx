import type { Switch } from "@/types/transwitch";
import {
  createContext,
  useContext,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { z } from "zod";

type UserSwitchesContextType = {
  switches: Switch[];
  setSwitches: Dispatch<SetStateAction<Switch[]>>;
};

export const UserSwitchesContext =
  createContext<UserSwitchesContextType | null>(null);
export function useUserSwitches() {
  const context = useContext(UserSwitchesContext);
  if (!context) {
    throw new Error(
      "useUserSwitches must be used within a UserSwitchesProvider"
    );
  }
  return context;
}

/* Zod schema for validation */
export const SegmentSchema: z.ZodType<
  Switch["combinations"][number]["segments"][number]
> = z.object({
  routeId: z.string(),
  fromSeq: z.int().min(0),
  toSeq: z.int().min(0),
  baseDuration: z.number().min(0),
});

export const CombinationSchema: z.ZodType<Switch["combinations"][number]> =
  z.object({
    name: z.string(),
    segments: z.array(SegmentSchema),
  });

export const SwitchSchema: z.ZodType<Switch> = z.object({
  id: z.string(),
  name: z.string(),
  combinations: z.array(CombinationSchema),
});

const SwitchArraySchema = z.array(SwitchSchema);

export function saveUserSwitches(switches: Switch[]) {
  localStorage.setItem(
    "userSwitches",
    Buffer.from(JSON.stringify(switches)).toString("base64")
  );
}

export function loadUserSwitches(): Switch[] {
  const item = localStorage.getItem("userSwitches");
  if (!item) return [];
  const json = Buffer.from(item, "base64").toString();
  const data = JSON.parse(json);
  const result = SwitchArraySchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    console.error(
      "Failed to load user switches from localStorage",
      result.error
    );
    return [];
  }
}

export function UserSwitchesProvider({
  children,
  switches,
  setSwitches,
}: {
  children: React.ReactNode;
  switches: Switch[];
  setSwitches: Dispatch<SetStateAction<Switch[]>>;
}) {
  const onSetSwitch = (param: Switch[] | ((prev: Switch[]) => Switch[])) => {
    setSwitches(param);
    const newSwitches = typeof param === "function" ? param(switches) : param;
    saveUserSwitches(newSwitches);
  };

  return (
    <UserSwitchesContext.Provider
      value={{ switches, setSwitches: onSetSwitch }}
    >
      {children}
    </UserSwitchesContext.Provider>
  );
}

// fake data for development

export const TEMPLATE_UserSwitches: Switch[] = [
  {
    id: "example-switch",
    name: "Example Switch: Chun Shek to HKUST",
    combinations: [
      {
        name: "Combination 1",
        segments: [
          {
            routeId: "80X+1+CHUN SHEK+KWUN TONG FERRY",
            fromSeq: 1,
            toSeq: 7,
            baseDuration: 20,
          },
          {
            routeId: "91M+1+DIAMOND HILL STATION+PO LAM",
            fromSeq: 3,
            toSeq: 16,
            baseDuration: 15,
          },
        ],
      },
      {
        name: "Combination 2",
        segments: [
          {
            routeId: "80X+1+CHUN SHEK+KWUN TONG FERRY",
            fromSeq: 1,
            toSeq: 7,
            baseDuration: 20,
          },
          {
            routeId: "91+1+DIAMOND HILL STATION+CLEAR WATER BAY",
            fromSeq: 2,
            toSeq: 15,
            baseDuration: 15,
          },
        ],
      },
    ],
  },
];
