import React, { createContext, useState, useContext } from 'react';
import { X } from 'lucide-react';

// Create context for sidebar
const SidebarContext = createContext(null);

// Sidebar Provider Component
export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// Custom hook to use sidebar context
export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

// Sidebar Trigger Component
export function SidebarTrigger({ children }) {
  const { toggleSidebar } = useSidebar();
  
  if (children) {
    return React.cloneElement(children, { onClick: toggleSidebar });
  }
  
  return (
    <button onClick={toggleSidebar} className="sidebar-trigger">
      Toggle Sidebar
    </button>
  );
}

// Main Sidebar Components
export function Sidebar({ children, className = '' }) {
    const { isOpen, toggleSidebar } = useSidebar();
    return (
      <aside 
        className={`fixed top-0 left-0 h-full w-75 bg-gray-700 text-white shadow-lg transform transition-transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
      >
        <button 
          onClick={toggleSidebar} 
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition duration-300"
        >
          <X className="w-6 h-6 cursor-pointer" />
        </button>
        {children}
      </aside>
    );
  }

export function SidebarContent({ children }) {
  return <div className="p-4">{children}</div>
}

export function SidebarGroup({ children }) {
  return <div className="mb-4">{children}</div>
}

export function SidebarGroupLabel({ children }) {
  return <h3 className="text-xs uppercase text-gray-500 mb-2">{children}</h3>
}

export function SidebarGroupContent({ children }) {
  return <div>{children}</div>
}

export function SidebarMenu({ children }) {
  return <nav>{children}</nav>
}

export function SidebarMenuItem({ children }) {
  return <div className="mb-2">{children}</div>
}

export function SidebarMenuButton({ children, asChild, ...props }) {
    // If asChild is true, just render children with additional props
    if (asChild) {
      return React.cloneElement(children, {
        className: 'flex items-center space-x-2 p-2 hover:bg-neutral-900 rounded transition duration-300 ease-in-out',
        ...props
      });
    }
    
    // Otherwise, render a standard button
    return (
      <button 
        className="flex items-center space-x-2 w-full text-left p-2 hover:bg-neutral-900 rounded transition duration-300 ease-in-out"
        {...props}
      >
        {children}
      </button>
    );
  }