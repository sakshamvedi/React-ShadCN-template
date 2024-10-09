import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UserPlus, LogIn, User, CreditCard, CarFrontIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

const NavItem = ({ to, icon: Icon, label }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
            )}
        >
            <Icon className="mr-3 h-6 w-6" />
            {label}
        </Link>
    );
};

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-white text-xl font-bold">Events</span>
                    </div>
                    <div className="flex space-x-4">
                        <NavItem to="/" icon={Home} label="Home" />
                        <NavItem to="/signin" icon={LogIn} label="Sign In" />
                        <NavItem to="/signup" icon={UserPlus} label="Sign Up" />
                        <NavItem to="/payments" icon={User} label="Profile" />
                        <NavItem to="/events" icon={CreditCard} label="Events" />
                        <NavItem to="/eventlist" icon={CarFrontIcon} label="All Events" />
                        <NavItem to="/eventspart" icon={CarFrontIcon} label="Participating Events" />

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;