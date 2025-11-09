import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const countries = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
];

interface CountrySelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function CountrySelector({ value, onValueChange }: CountrySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[200px]" data-testid="select-country">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code} data-testid={`option-country-${country.code}`}>
            <span className="mr-2">{country.flag}</span>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
