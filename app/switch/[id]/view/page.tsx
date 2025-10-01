"use client";

import { SwitchOptionCard } from "@/components/SwitchOptionCard";
import { Heading2 } from "@/components/Typography";
import { useUserSwitches } from "@/scripts/contexts/userSwitches";
import { useParams, useRouter } from "next/navigation";
import SwitchNotFound from "@/app/switch/not-found";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SwitchView() {
  const { switches, deleteSwitch } = useUserSwitches();
  const { id } = useParams();
  const router = useRouter();
  
  if (!switches) return <Skeleton className="h-6 w-32" />;

  const targetSwitch = switches.find((s) => s.id === id);
  if (!targetSwitch) return <SwitchNotFound />;

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${targetSwitch.name}"?`)) {
      deleteSwitch(id as string);
      router.push("/switch/all");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Heading2>{targetSwitch.name}</Heading2>
        <div className="flex gap-2">
          <Link href={`/switch/${id}/edit`}>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {targetSwitch.combinations.map((option, index) => (
          <SwitchOptionCard key={`option-${index}`} option={option} />
        ))}
      </div>
    </div>
  );
}
