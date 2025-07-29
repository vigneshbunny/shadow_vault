import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home, Clock, Scan, Settings } from "lucide-react";

interface BottomNavigationProps {
  currentPage: string;
}

const BottomNavigation = ({ currentPage }: BottomNavigationProps) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/home' },
    { id: 'history', icon: Clock, label: 'History', path: '/history' },
    { id: 'scan', icon: Scan, label: 'Scan', path: '/scan' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => navigate(item.path)}
            variant="ghost"
            className={`flex-col space-y-1 h-auto py-2 px-3 ${
              currentPage === item.id 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;