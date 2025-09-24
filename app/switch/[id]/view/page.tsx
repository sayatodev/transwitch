"use client";

import { SwitchOptionCard } from "@/components/SwitchOptionCard";
import { Heading2 } from "@/components/Typography";
import { useBusEtaApi } from "@/scripts/contexts/busEtaApi";
import { useUserSwitches } from "@/scripts/contexts/userSwitches";
import { useEffect } from "react";

export default function SwitchView() {
  const userSwitches = useUserSwitches();
  const targetSwitch = userSwitches[0]; // For demonstration, using the first switch

  useEffect(() => {
    console.log("UserSwitches:", userSwitches);
  }, [userSwitches]);

  return (
    <div>
      <Heading2 className="mb-3">{targetSwitch.name}</Heading2>
      <div className="flex flex-col gap-4">
        {targetSwitch.combinations.map((option, index) => (
          <SwitchOptionCard key={`option-${index}`} option={option} />
        ))}
      </div>
    </div>
  );
}
