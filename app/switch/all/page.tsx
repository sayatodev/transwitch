"use client";

import { CompactSwitchCard } from "@/components/CompactSwitchCard";
import { Heading1 } from "@/components/Typography";
import { useUserSwitches } from "@/scripts/contexts/userSwitches";
import { useEffect } from "react";

export default function AllSwitchesPage() {
  const { switches } = useUserSwitches();

  useEffect(() => {
    console.log("All UserSwitches:", switches);
  }, [switches]);

  return (
    <div className="m-2">
      <Heading1 className="mb-6">All Switches</Heading1>
        {switches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No switches found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create your first switch to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {switches.map((switchData) => (
              <CompactSwitchCard key={switchData.id} switch={switchData} />
            ))}
          </div>
        )}
    </div>
  );
}
