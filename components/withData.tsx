"use client";

import { useState } from "react";
import { BusEtaApi } from "@/scripts/apis/busEta";
import { BusEtaApiProvider } from "@/scripts/contexts/busEtaApi";
import { UserSwitchesProvider } from "@/scripts/contexts/userSwitches";
import { Switch } from "@/types/transwitch";
import { TEMPLATE_UserSwitches } from "@/scripts/contexts/userSwitches";

interface WithDataProps {
  children: React.ReactNode;
}

export function WithData({ children }: WithDataProps) {
  const [busEtaApi] = useState(() => new BusEtaApi());
  const [userSwitches] = useState<Switch[]>(() => TEMPLATE_UserSwitches);

  return (
    <BusEtaApiProvider api={busEtaApi}>
      <UserSwitchesProvider switches={userSwitches}>
        {children}
      </UserSwitchesProvider>
    </BusEtaApiProvider>
  );
}
