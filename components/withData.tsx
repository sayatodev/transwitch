"use client";

import { useEffect, useState } from "react";
import { BusEtaApi } from "@/scripts/apis/busEta";
import { BusEtaApiProvider } from "@/scripts/contexts/busEtaApi";
import {
  loadUserSwitches,
  saveUserSwitches,
  UserSwitchesProvider,
} from "@/scripts/contexts/userSwitches";
import { Switch } from "@/types/transwitch";
import { TEMPLATE_UserSwitches } from "@/scripts/contexts/userSwitches";

interface WithDataProps {
  children: React.ReactNode;
}

export function WithData({ children }: WithDataProps) {
  const [busEtaApi] = useState(() => new BusEtaApi());
  const [userSwitches, setUserSwitches] = useState<Switch[]>([]);

  useEffect(() => {
    const switches = loadUserSwitches();
    setUserSwitches(switches);
  }, []);

  return (
    <BusEtaApiProvider api={busEtaApi}>
      <UserSwitchesProvider
        switches={userSwitches}
        setSwitches={setUserSwitches}
      >
        {children}
      </UserSwitchesProvider>
    </BusEtaApiProvider>
  );
}
