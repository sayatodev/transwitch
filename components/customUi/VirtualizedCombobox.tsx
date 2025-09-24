// Modified based on oaarnikoivu/shadcn-virtualized-combobox
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { clamp } from "@/scripts/utils/general";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export type ComboboxCommandOption = {
  value: string;
  label: string;
};

interface VirtualizedCommandProps {
  options: ComboboxCommandOption[];
  placeholder: string;
  selectedOption: string;
  onSelectOption?: (option: string) => void;
}

const VirtualizedCommand = ({
  options,
  placeholder,
  selectedOption,
  onSelectOption,
}: VirtualizedCommandProps) => {
  const [filteredOptions, setFilteredOptions] =
    React.useState<ComboboxCommandOption[]>(options);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [isKeyboardNavActive, setIsKeyboardNavActive] = React.useState(false);

  const parentRef = React.useRef(null);
  const touchStartY = React.useRef<number | null>(null);

  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  const virtualOptions = virtualizer.getVirtualItems();

  const scrollToIndex = (index: number) => {
    virtualizer.scrollToIndex(index, {
      align: "center",
    });
  };

  const handleSearch = (search: string) => {
    setIsKeyboardNavActive(false);
    setFilteredOptions(
      options.filter((option) =>
        option.value.toLowerCase().includes(search.toLowerCase() ?? [])
      )
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex =
            prev === -1 ? 0 : Math.min(prev + 1, filteredOptions.length - 1);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        setIsKeyboardNavActive(true);
        setFocusedIndex((prev) => {
          const newIndex =
            prev === -1 ? filteredOptions.length - 1 : Math.max(prev - 1, 0);
          scrollToIndex(newIndex);
          return newIndex;
        });
        break;
      }
      case "Enter": {
        event.preventDefault();
        if (filteredOptions[focusedIndex]) {
          onSelectOption?.(filteredOptions[focusedIndex].value);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleWheel = (event: React.UIEvent) => {
    setIsKeyboardNavActive(false);
    console.log("wheel event", event);

    const dY = (event as React.WheelEvent).deltaY;
    const dY_squared = dY * dY;

    const deltaModeRanges: [number, number][] = [[-400, 400]];
    const deltaModeRange = deltaModeRanges[0];
    const dY1 = clamp(dY, deltaModeRange) / deltaModeRange[1]; // Normalize to -1 to 1

    const deltaModeCoefficients = [25];
    const deltaModeCoefficient = deltaModeCoefficients[0];

    //\frac{x^{2}}{2\cdot\left(x^{2}-x\right)+1}
    const smoothCoefficient = clamp(Math.abs(dY1) ** 2.5, [0, 1]);
    const smoothedDeltaY = smoothCoefficient * dY * deltaModeCoefficient;
    console.log({ dY, dY_squared, smoothCoefficient, smoothedDeltaY });
    virtualizer.scrollToOffset(
      (virtualizer.scrollOffset ?? 0) + smoothedDeltaY,
      { behavior: "auto" }
    );
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    setIsKeyboardNavActive(false);
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    setIsKeyboardNavActive(false);

    if (touchStartY.current === null) return;

    const currentY = event.touches[0].clientY;
    const dY = touchStartY.current - currentY; // Inverted to match wheel behavior

    console.log("touchmove event", event);

    const screenHeight = window.innerHeight;
    let coefficient = screenHeight / 300;
    if (Math.abs(dY) >= 30) {
      coefficient = coefficient * (Math.abs(dY) / 30) ** 2;
    }

    virtualizer.scrollToOffset(
      (virtualizer.scrollOffset ?? 0) + dY * coefficient,
      {
        behavior: "auto",
      }
    );
    console.log({ dY, coefficient });

    // Update touch start position for continuous scrolling
    touchStartY.current = currentY;
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  React.useEffect(() => {
    if (selectedOption) {
      const option = filteredOptions.find(
        (option) => option.value === selectedOption
      );
      if (option) {
        const index = filteredOptions.indexOf(option);
        setFocusedIndex(index);
        virtualizer.scrollToIndex(index, {
          align: "center",
        });
      }
    }
  }, [selectedOption, filteredOptions, virtualizer]);

  return (
    <Command shouldFilter={false} onKeyDown={handleKeyDown}>
      <CommandInput onValueChange={handleSearch} placeholder={placeholder} />
      <CommandList
        ref={parentRef}
        style={{
          width: "100%",
          overflow: "auto",
        }}
        onMouseDown={() => setIsKeyboardNavActive(false)}
        onMouseMove={() => setIsKeyboardNavActive(false)}
      >
        <CommandEmpty>No item found.</CommandEmpty>
        <CommandGroup>
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {virtualOptions.map((virtualOption) => (
              <CommandItem
                key={filteredOptions[virtualOption.index].value}
                disabled={isKeyboardNavActive}
                className={cn(
                  "absolute left-0 top-0 w-full bg-transparent",
                  focusedIndex === virtualOption.index &&
                    "bg-accent text-accent-foreground",
                  isKeyboardNavActive &&
                    focusedIndex !== virtualOption.index &&
                    "aria-selected:bg-transparent aria-selected:text-primary"
                )}
                style={{
                  height: `${virtualOption.size}px`,
                  transform: `translateY(${virtualOption.start}px)`,
                }}
                value={filteredOptions[virtualOption.index].value}
                onMouseEnter={() =>
                  !isKeyboardNavActive && setFocusedIndex(virtualOption.index)
                }
                onMouseLeave={() => !isKeyboardNavActive && setFocusedIndex(-1)}
                onSelect={onSelectOption}
              >
                {filteredOptions[virtualOption.index].label}
              </CommandItem>
            ))}
          </div>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

interface VirtualizedComboboxProps {
  options: ComboboxCommandOption[];
  searchPlaceholder?: string;
  className?: string;
  onChange: (value: string) => void;
}

export function VirtualizedCombobox({
  options,
  searchPlaceholder = "Search items...",
  className = undefined,
  onChange,
}: VirtualizedComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {selectedOption
            ? options.find((option) => option.value === selectedOption)?.label
            : searchPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <VirtualizedCommand
          options={options}
          placeholder={searchPlaceholder}
          selectedOption={selectedOption}
          onSelectOption={(currentValue) => {
            setSelectedOption(
              currentValue === selectedOption ? "" : currentValue
            );
            onChange(currentValue);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
