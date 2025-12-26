import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Button } from "@/components/ui/button";
  
  export default function SidebarCategoryFilter({ category, setCategory }) {
    return (
      <div className="sm:w-1/5 bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Category Filter</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {category || "All Categories"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={category}
              onValueChange={(value) => setCategory(value)}
            >
              <DropdownMenuRadioItem value="">All Categories</DropdownMenuRadioItem>
              
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  