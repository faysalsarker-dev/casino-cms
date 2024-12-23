import { User, DollarSign, CreditCard, Sliders, LogOut, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import useAuth from './../../hooks/useAuth/useAuth';

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Users",
    url: "/users",
    icon: User,
  },
  {
    title: "Deposit Requests",
    url: "/deposit-requests",
    icon: DollarSign,
  },
  {
    title: "Withdrawal Requests",
    url: "/withdrawal-requests",
    icon: CreditCard,
  },
  {
    title: "Slider Management",
    url: "/slider-management",
    icon: Sliders,
  },
];

export function AppSidebar() {
  const location = useLocation();
const {logOut}=useAuth()
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-gray-800 mb-4">
            Casino Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      asChild
                    >
                      <Link to={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button */}
        <div className="mt-auto px-4 py-3 border-t border-gray-300">
          <SidebarMenuButton
            className="flex items-center gap-3 w-full text-gray-700 px-4 py-3 rounded-md hover:bg-red-500 hover:text-white transition-all"
            asChild
          >
            <button onClick={() => logOut()}>
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
