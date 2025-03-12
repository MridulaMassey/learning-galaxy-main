
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User, Heart, Award, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: 'student' | 'teacher' | 'admin';
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn = false, userType, userName }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary animate-float" />
            <span className="font-bold text-xl tracking-tight">Kind Hearts</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              {userType === 'teacher' && <Link to="/students" className="nav-link">Students</Link>}
              {userType === 'admin' && <Link to="/admin" className="nav-link">Admin Panel</Link>}
              <Link to="/activities" className="nav-link">Activities</Link>
              <Link to="/achievements" className="nav-link">Achievements</Link>
              
              <div className="flex items-center gap-2 ml-4">
                <Link to="/profile" className="flex items-center gap-1.5 text-sm font-medium">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{userName || 'User'}</span>
                </Link>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/logout">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Log out</span>
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/about" className="nav-link">About Us</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <Button asChild className="ml-4 rounded-full btn-bounce">
                <Link to="/login">Log In</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-sm md:hidden transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container py-8 flex flex-col gap-4">
          {isLoggedIn ? (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                  <User className="h-10 w-10" />
                </div>
                <span className="text-lg font-medium">{userName || 'User'}</span>
                <span className="text-sm text-muted-foreground capitalize">{userType}</span>
              </div>
              
              <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                <Heart className="h-5 w-5 text-primary" />
                <span>Dashboard</span>
              </Link>
              
              {userType === 'teacher' && (
                <Link to="/students" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                  <User className="h-5 w-5 text-primary" />
                  <span>Students</span>
                </Link>
              )}
              
              {userType === 'admin' && (
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                  <Settings className="h-5 w-5 text-primary" />
                  <span>Admin Panel</span>
                </Link>
              )}
              
              <Link to="/activities" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                <Heart className="h-5 w-5 text-primary" />
                <span>Activities</span>
              </Link>
              
              <Link to="/achievements" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                <Award className="h-5 w-5 text-primary" />
                <span>Achievements</span>
              </Link>
              
              <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                <User className="h-5 w-5 text-primary" />
                <span>Profile</span>
              </Link>
              
              <Link to="/logout" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted mt-4 text-destructive" onClick={toggleMenu}>
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                <Heart className="h-5 w-5 text-primary" />
                <span>Home</span>
              </Link>
              
              <Link to="/about" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                <Heart className="h-5 w-5 text-primary" />
                <span>About Us</span>
              </Link>
              
              <Link to="/contact" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted" onClick={toggleMenu}>
                <Heart className="h-5 w-5 text-primary" />
                <span>Contact</span>
              </Link>
              
              <div className="mt-8">
                <Button className="w-full rounded-full" asChild onClick={toggleMenu}>
                  <Link to="/login">Log In</Link>
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
