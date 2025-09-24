"use client";

import { SwitchOptionCard } from "@/components/SwitchOptionCard";
import { Heading2 } from "@/components/Typography";
import { useUserSwitches } from "@/scripts/contexts/userSwitches";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import SwitchNotFound from "@/app/switch/not-found";

export default function SwitchView() {
  const { switches } = useUserSwitches();
  const { id } = useParams();
  console.log(switches);
  const targetSwitch = switches.find((s) => s.id === id);

  useEffect(() => {
    console.log("UserSwitches:", switches);
  }, [switches]);

  if (!targetSwitch) return <SwitchNotFound />;

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
