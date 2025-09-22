import { Switch } from "@/types/transwitch";
import { createContext, useContext } from "react";

export const UserSwitchesContext = createContext<Switch[] | null>(null);
export function useUserSwitches() {
  const context = useContext(UserSwitchesContext);
  if (!context) {
    throw new Error(
      "useUserSwitches must be used within a UserSwitchesProvider"
    );
  }
  return context;
}

export function UserSwitchesProvider({
  children,
  switches,
}: {
  children: React.ReactNode;
  switches: Switch[];
}) {
  return (
    <UserSwitchesContext.Provider value={switches}>
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
