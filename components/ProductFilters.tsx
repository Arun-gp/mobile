
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider" // Note: need to install slider if not present, checking package.json
import { Checkbox } from "@/components/ui/checkbox" // Note: need to install checkbox
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"

// Assuming ShadCN Slider and Checkbox are available or similar
// If not installed, I might need to install them. @radix-ui/react-slider and checkbox are in package.json!

interface ProductFiltersProps {
    categories: string[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    priceRange: number;
    setPriceRange: (price: number) => void;
    minPrice: number;
    maxPrice: number;
}

export function ProductFilters({
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice
}: ProductFiltersProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filters
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                        Refine your product search
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 py-6">
                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Categories</h3>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={category}
                                        checked={selectedCategory === category}
                                        onCheckedChange={(checked: boolean | "indeterminate") => setSelectedCategory(checked === true ? category : "")}
                                    />
                                    <Label htmlFor={category} className="capitalize">{category}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">Price Range</h3>
                        <Slider
                            defaultValue={[0]}
                            max={maxPrice}
                            step={1}
                            value={[priceRange]}
                            onValueChange={(val: number[]) => setPriceRange(val[0] ?? 0)}
                            className="py-4"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>${minPrice}</span>
                            <span>${priceRange}</span>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
