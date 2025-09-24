"use client";

import { Switch } from "@/types/transwitch";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface CompactSwitchCardProps {
  switch: Switch;
}

export function CompactSwitchCard({ switch: switchData }: CompactSwitchCardProps) {
  return (
    <Link href={`/switch/${switchData.id}/view`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              {switchData.name}
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
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