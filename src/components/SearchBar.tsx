import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addSearchKeyword } from "@/utils/searchHistory";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      addSearchKeyword(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onSearch(query);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
      <div className="flex-1">
        <Input 
          name="search"
          placeholder="Search jobs by title, skills, or description..." 
          className="w-full"
          onChange={handleChange}
        />
      </div>
      <Button type="submit" className="hover:bg-purple-600 hover:text-white transition-colors">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </form>
  );
};