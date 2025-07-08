'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from './label';

interface Option {
  value: string;
  label: string;
}

interface TransferListProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  className?: string;
  availableTitle?: string;
  selectedTitle?: string;
}

export function TransferList({
  options,
  selected,
  onChange,
  className,
  availableTitle = 'Available',
  selectedTitle = 'Selected',
}: TransferListProps) {
  const [highlightedAvailable, setHighlightedAvailable] = React.useState<string[]>([]);
  const [highlightedSelected, setHighlightedSelected] = React.useState<string[]>([]);

  const availableOptions = options.filter(opt => !selected.includes(opt.value));
  const selectedOptions = options.filter(opt => selected.includes(opt.value));

  const handleToggleHighlight = (list: 'available' | 'selected', value: string) => {
    const [highlighted, setHighlighted] = list === 'available'
      ? [highlightedAvailable, setHighlightedAvailable]
      : [highlightedSelected, setHighlightedSelected];

    const currentHighlighted = highlighted.includes(value)
      ? highlighted.filter(v => v !== value)
      : [...highlighted, value];
    
    setHighlighted(currentHighlighted);
  };

  const moveSelected = () => {
    onChange([...selected, ...highlightedAvailable]);
    setHighlightedAvailable([]);
  };

  const moveAll = () => {
    onChange(options.map(opt => opt.value));
    setHighlightedAvailable([]);
  };
  
  const removeSelected = () => {
    onChange(selected.filter(val => !highlightedSelected.includes(val)));
    setHighlightedSelected([]);
  };

  const removeAll = () => {
    onChange([]);
    setHighlightedSelected([]);
  };

  const ListBox = ({ title, items, highlighted, onToggle }: { title: string; items: Option[]; highlighted: string[]; onToggle: (value: string) => void }) => (
    <Card className="flex-1 flex flex-col">
      <div className="p-2 border-b"><Label>{title} ({items.length})</Label></div>
      <ScrollArea className="h-48">
        <CardContent className="p-1">
          {items.length > 0 ? (
            items.map(item => (
              <button
                type="button"
                key={item.value}
                onClick={() => onToggle(item.value)}
                className={cn(
                  'w-full text-left p-2 rounded-md text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary',
                  highlighted.includes(item.value) && 'bg-accent ring-2 ring-primary'
                )}
              >
                {item.label}
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground h-full flex items-center justify-center">No items</div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );

  return (
    <div className={cn('flex flex-col md:flex-row items-center gap-4', className)}>
      <ListBox
        title={availableTitle}
        items={availableOptions}
        highlighted={highlightedAvailable}
        onToggle={(value) => handleToggleHighlight('available', value)}
      />
      
      <div className="flex flex-row md:flex-col gap-2">
        <Button variant="outline" size="icon" onClick={moveAll} disabled={availableOptions.length === 0}><ChevronsRight /></Button>
        <Button variant="outline" size="icon" onClick={moveSelected} disabled={highlightedAvailable.length === 0}><ChevronRight /></Button>
        <Button variant="outline" size="icon" onClick={removeSelected} disabled={highlightedSelected.length === 0}><ChevronLeft /></Button>
        <Button variant="outline" size="icon" onClick={removeAll} disabled={selectedOptions.length === 0}><ChevronsLeft /></Button>
      </div>

      <ListBox
        title={selectedTitle}
        items={selectedOptions}
        highlighted={highlightedSelected}
        onToggle={(value) => handleToggleHighlight('selected', value)}
      />
    </div>
  );
}
