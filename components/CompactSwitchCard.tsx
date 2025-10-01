"use client";

import { Switch } from "@/types/transwitch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChevronRight, Trash2 } from "lucide-react";
import { useUserSwitches } from "@/scripts/contexts/userSwitches";
import { useRouter } from "next/navigation";

interface CompactSwitchCardProps {
  switch: Switch;
}

export function CompactSwitchCard({ switch: switchData }: CompactSwitchCardProps) {
  const { deleteSwitch } = useUserSwitches();
  const router = useRouter();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to delete "${switchData.name}"?`)) {
      deleteSwitch(switchData.id);
    }
  };

  return (
    <Link href={`/switch/${switchData.id}/view`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {switchData.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium">
              {switchData.combinations.length} option{switchData.combinations.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}