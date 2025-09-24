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
import { RouteSegment } from "@/types/transwitch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface EditSegmentModalProps {
  className?: string;
  combinationName: string;
  segmentIndex: number;
  segment: RouteSegment;
  setSegment: (segment: RouteSegment) => void;
}

export function EditSegmentModalTrigger(props: EditSegmentModalProps) {
  const { className, combinationName, segmentIndex, segment, setSegment } =
    props;

  const formData = { ...segment };
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
            setSegment({ ...formData, routeId: e.target.value });
          }}
        />
        <Label className="mt-4">From Stop Seq</Label>
        <Input
          type="number"
          value={formData.fromSeq}
          onChange={(e) => {
            setSegment({ ...formData, fromSeq: Number(e.target.value) });
          }}
        />
        <Label className="mt-4">To Stop Seq</Label>
        <Input
          type="number"
          value={formData.toSeq}
          onChange={(e) => {
            setSegment({ ...formData, toSeq: Number(e.target.value) });
          }}
        />
        <Paragraph className="mb-2">
          <Label className="mt-4">Base Duration (minutes)</Label>
          <div className="mt-2 text-sm text-gray-600">
            Estimated time taken for this segment. This helps us identify the
            arrival time.
          </div>
        </Paragraph>
        <Input
          type="number"
          value={formData.baseDuration}
          onChange={(e) => {
            setSegment({ ...formData, baseDuration: Number(e.target.value) });
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              onClick={() => {
                setSegment(formData);
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
