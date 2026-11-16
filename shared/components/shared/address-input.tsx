'use client';

import React from 'react';
import { Input } from '@/shared/components/ui';
import { ClearButton } from './clear-button';
import { cn } from '@/shared/lib/utils';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const AdressInput = ({ value = '', onChange, className }: Props) => {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Живий пошук із затримкою (debounce)
  React.useEffect(() => {
    if (!value || value.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/address?query=${encodeURIComponent(value)}`);
        const data = await res.json();
        setSuggestions(data);
        setIsOpen(data.length > 0);
      } catch (e) {
        console.error(e);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value]);

  // Закриваємо випадайку при кліку за межі інпуту
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (address: string) => {
    onChange?.(address);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Введіть адресу доставки..."
          className="h-12 pl-4 pr-10 text-base"
        />
        {value && <ClearButton onClick={() => onChange?.('')} />}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-border bg-white p-1 shadow-lg z-50">
          {suggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSelect(item)}
              className="cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};