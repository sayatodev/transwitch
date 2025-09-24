"use client";

import { CompactSwitchCard } from "@/components/CompactSwitchCard";
import { Heading1 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { useUserSwitches } from "@/scripts/contexts/userSwitches";
import { useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AllSwitchesPage() {
  const { switches } = useUserSwitches();

  useEffect(() => {
    console.log("All UserSwitches:", switches);
  }, [switches]);

  return (
    <div className="m-2">
      <div className="flex items-center justify-between mb-6">
        <Heading1>All Switches</Heading1>
        {switches.length > 0 && (
          <Link href="/switch/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Switch
            </Button>
          </Link>
        )}
      </div>
        {switches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No switches found</p>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Create your first switch to get started
            </p>
            <Link href="/switch/create">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Switch
              </Button>
            </Link>
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
