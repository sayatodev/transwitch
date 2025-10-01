"use client";

import { useEffect, useState } from "react";
import { BusEtaApi } from "@/scripts/apis/busEta";
import { BusEtaApiProvider } from "@/scripts/contexts/busEtaApi";
import {
  loadUserSwitches,
  UserSwitchesProvider,
} from "@/scripts/contexts/userSwitches";
import { Switch } from "@/types/transwitch";
import type { EtaDb } from "hk-bus-eta";

interface WithDataProps {
  etaDb: EtaDb;
  children: React.ReactNode;
}

const busEtaApi: BusEtaApi = new BusEtaApi<"uninitialized">();

export function WithData({ etaDb, children }: WithDataProps) {
  const [userSwitches, setUserSwitches] = useState<Switch[]>([]);

  useEffect(() => {
    const switches = loadUserSwitches();
    setUserSwitches(switches);
  }, []);

  busEtaApi.init(etaDb);

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
