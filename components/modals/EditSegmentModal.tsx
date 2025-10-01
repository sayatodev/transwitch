import { Pencil } from "lucide-react";
import { Paragraph } from "../Typography";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RouteSegment, SegmentSetter } from "@/types/transwitch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { RouteInput } from "../inputs/RouteInput";
import { StopInput } from "../inputs/StopInput";

interface EditSegmentModalProps {
  className?: string;
  combinationName: string;
  segmentIndex: number;
  segment: RouteSegment;
  setSegment: SegmentSetter;
}

export function EditSegmentModalTrigger(props: EditSegmentModalProps) {
  const { className, combinationName, segmentIndex, segment, setSegment } =
    props;
  const [formData, setFormData] = useState({ ...segment });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" type="button">
          <Pencil className={className} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit {combinationName} - Segment #{segmentIndex + 1}
          </DialogTitle>
        </DialogHeader>
        <Label className="mt-4">Route</Label>
        <RouteInput
          onChange={(value) => setFormData({ ...formData, routeId: value })}
        />
        <Label className="mt-4">From Stop</Label>
        <StopInput
          routeId={formData.routeId}
          onChange={(seq) => setFormData({ ...formData, fromSeq: seq })}
        />
        <Label className="mt-4">To Stop</Label>
        <StopInput
          routeId={formData.routeId}
          onChange={(seq) => setFormData({ ...formData, toSeq: seq })}
        />
        <div className="mb-2">
          <Label className="mt-4">Base Duration (minutes)</Label>
          <p className="mt-2 text-sm text-gray-600">
            Estimated time taken for this segment. This helps us identify the
            arrival time.
          </p>
        </div>
        <Input
          type="number"
          value={formData.baseDuration}
          onChange={(e) => {
            setFormData({ ...formData, baseDuration: Number(e.target.value) });
          }}
        />
        <DialogFooter>
          <Button
            type="button"
            onClick={() => {
              const success = setSegment(formData, segmentIndex);
              if (success) setIsOpen(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
