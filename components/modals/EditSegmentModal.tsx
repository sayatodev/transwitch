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

  return (
    <Dialog>
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
        <Input
          value={formData.routeId}
          onChange={(e) => {
            setFormData({ ...formData, routeId: e.target.value });
          }}
        />
        <Label className="mt-4">From Stop number</Label>
        <Input
          type="number"
          defaultValue={formData.fromSeq + 1}
          onChange={(e) => {
            setFormData({ ...formData, fromSeq: Number(e.target.value) - 1 });
          }}
        />
        <Label className="mt-4">To Stop number</Label>
        <Input
          type="number"
          defaultValue={formData.toSeq + 1}
          min={1}
          onChange={(e) => {
            setFormData({ ...formData, toSeq: Number(e.target.value) - 1 });
          }}
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
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                setSegment(formData, segmentIndex);
              }}
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
