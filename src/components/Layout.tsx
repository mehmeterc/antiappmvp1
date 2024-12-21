import { SearchBar } from "./SearchBar";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const hideSearchBar = location.pathname === '/messages';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {!hideSearchBar && <SearchBar />}
        {children}
      </div>
    </div>
  );
};