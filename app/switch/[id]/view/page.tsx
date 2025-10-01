"use client";

import { SwitchOptionCard } from "@/components/SwitchOptionCard";
import { Heading2 } from "@/components/Typography";
import { useUserSwitches } from "@/scripts/contexts/userSwitches";
import { useParams } from "next/navigation";
import SwitchNotFound from "@/app/switch/not-found";
import { Skeleton } from "@/components/ui/skeleton";

export default function SwitchView() {
  const { switches } = useUserSwitches();
  if (!switches) return <Skeleton className="h-6 w-32" />;

  const { id } = useParams();

  const targetSwitch = switches.find((s) => s.id === id);
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
