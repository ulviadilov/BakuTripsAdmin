import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
} from 'lucide-react';
import classNames from 'classnames';
import { useQuery } from '@tanstack/react-query';
import { navItems } from '../constants/path';
import Logo from '../assets/Logo.png'
import { authService } from '../services/auth';

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  isCollapsed,
  onToggleCollapse,
  onClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Fetch user profile using React Query
  const { data: userProfile, isLoading: isLoadingUser, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: authService.getUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Generate initials from user name
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleExpanded = (label: string) => {
    if (isCollapsed) return;

    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isItemExpanded = (label: string) => expandedItems.includes(label);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('accessToken');

    setShowLogoutPopup(false);

    navigate('/login');
  };

  const handleUserClick = () => {
    setShowLogoutPopup(!showLogoutPopup);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowLogoutPopup(false);
      }
    };

    if (showLogoutPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLogoutPopup]);

  // Handle user fetch error
  useEffect(() => {
    if (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }, [error]);

  const isAnyChildActive = (children: any[]): boolean => {
    if (!children) return false;

    return children.some((child: any) => {
      if (location.pathname === child.path) return true;
      if (child.children && child.children.length > 0) {
        return isAnyChildActive(child.children);
      }
      return false;
    });
  };

  const renderNestedChildren = (children: any[], level: number = 1) => {
    return children.map((child: any, childIndex: number) => {
      const isChildItemActive = location.pathname === child.path;
      const hasNestedChildren = child.children && child.children.length > 0;
      const isNestedExpanded = isItemExpanded(`${child.label}-${level}`);
      const isNestedChildActive = hasNestedChildren && isAnyChildActive(child.children);
      const ChildIcon = child.icon;
      const marginLeft = level === 1 ? 'ml-6' : 'ml-9';

      return (
        <div key={`${child.label}-${childIndex}-${level}`}>
          {hasNestedChildren ? (
            <>
              <button
                onClick={() => toggleExpanded(`${child.label}-${level}`)}
                className={classNames(
                  `group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium w-full ${marginLeft}`,
                  'transition-all duration-200 ease-in-out relative overflow-hidden max-w-[260px]',
                  {
                    'bg-gradient-to-r from-primary to-tab text-white shadow-md shadow-primary/20': isNestedChildActive,
                    'text-medium hover:bg-tag/50 hover:text-dark': !isNestedChildActive,
                  }
                )}
              >
                {isNestedChildActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-tab opacity-10" />
                )}

                <ChildIcon className={classNames(
                  'flex-shrink-0 transition-transform duration-200',
                  {
                    'w-4 h-4': true,
                    'group-hover:scale-110': !isNestedChildActive,
                    'text-white': isNestedChildActive,
                    'text-medium group-hover:text-dark': !isNestedChildActive,
                  }
                )} />

                <span className={classNames(
                  'ml-3 transition-all duration-200 group-hover:scale-105 flex-1 text-left'
                )}>
                  {child.label}
                </span>

                <div className={classNames(
                  'ml-2 transition-transform duration-200',
                  {
                    'text-white': isNestedChildActive,
                    'text-medium': !isNestedChildActive,
                  }
                )}>
                  {isNestedExpanded ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </div>

                {!isNestedChildActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-tag/30 to-packages/30 opacity-0 transition-opacity duration-200 rounded-lg" />
                )}
              </button>

              <div className={classNames(
                'overflow-hidden transition-all duration-300 ease-in-out',
                {
                  'max-h-96 opacity-100': isNestedExpanded,
                  'max-h-0 opacity-0': !isNestedExpanded,
                }
              )}>
                <div className="mt-1 space-y-1">
                  {renderNestedChildren(child.children, level + 1)}
                </div>
              </div>
            </>
          ) : (
            <Link
              to={child.path}
              onClick={onClose}
              className={classNames(
                `group flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${marginLeft}`,
                'transition-all duration-200 ease-in-out relative overflow-hidden max-w-[250px]',
                {
                  'bg-gradient-to-r from-primary to-tab text-white shadow-md shadow-primary/20': isChildItemActive,
                  'text-medium hover:bg-tag/50 hover:text-dark': !isChildItemActive,
                }
              )}
            >
              {isChildItemActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-tab opacity-10" />
              )}

              <ChildIcon className={classNames(
                'flex-shrink-0 transition-transform duration-200',
                {
                  'w-4 h-4': true,
                  'group-hover:scale-110': !isChildItemActive,
                  'text-white': isChildItemActive,
                  'text-medium group-hover:text-dark': !isChildItemActive,
                }
              )} />

              <span className={classNames(
                'ml-3 transition-all duration-200 group-hover:scale-105'
              )}>
                {child.label}
              </span>

              {!isChildItemActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-tag/30 to-packages/30 opacity-0 transition-opacity duration-200 rounded-lg" />
              )}
            </Link>
          )}
        </div>
      );
    });
  };

  const renderCollapsedDropdown = (children: any[], parentLabel: string,index:number) => {
    const renderDropdownItems = (items: any[], level: number = 0) => {
      return items.map((child: any, childIndex: number) => {
        const isChildItemActive = location.pathname === child.path;
        const hasNestedChildren = child.children && child.children.length > 0;
        const ChildIcon = child.icon;
        const paddingLeft = level === 0 ? 'pl-3' : `pl-${3 + level * 2}`;

        return (
          <div key={`${child.label}-${childIndex}-dropdown`}>
            {hasNestedChildren ? (
              <>
                <div className={`px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide ${paddingLeft}`}>
                  {child.label}
                </div>
                {renderDropdownItems(child.children, level + 1)}
              </>
            ) : (
              <Link
                to={child.path}
                onClick={onClose}
                className={classNames(
                  `flex items-center px-3 py-2.5 text-sm font-medium hover:bg-tag/50 transition-colors duration-200 ${paddingLeft}`,
                  {
                    'bg-gradient-to-r from-primary to-tab text-white': isChildItemActive,
                    'text-medium': !isChildItemActive,
                  }
                )}
              >
                <ChildIcon className="w-4 h-4 mr-3" />
                <span>{child.label}</span>
              </Link>
            )}
          </div>
        );
      });
    };

    return (
      <div className="fixed bottom-[70px] left-[5rem] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] pointer-events-none group-hover:pointer-events-auto"
        style={{ top: `calc(${index * 56}px + 100px)` }}>
        <div className="bg-white border border-line shadow-xl rounded-lg py-2 min-w-48 max-h-80 overflow-y-auto" style={{
            scrollbarWidth:"none"
        }}>
          <div className="px-3 py-2 border-b border-line">
            <span className="text-sm font-medium text-dark">{parentLabel}</span>
          </div>
          {renderDropdownItems(children)}
        </div>
        <div className="absolute right-full top-4 border-[8px] border-transparent border-r-white"></div>
        <div className="absolute right-full top-4 border-[8px] border-transparent border-r-line" style={{ marginRight: '1px' }}></div>
      </div>
    );
  };

  const renderNavItem = (item: any, index: number) => {
    const { label, icon: Icon, path, children } = item;
    const hasChildren = children && children.length > 0;
    const isExpanded = isItemExpanded(label);
    const isActive = location.pathname === path;
    const isChildActive = hasChildren && isAnyChildActive(children);

    return (
      <div key={`${label}-${index}`} className="relative group">
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpanded(label)}
              className={classNames(
                'group flex items-center px-4 py-3.5 rounded-xl text-sm font-medium w-full',
                'transition-all duration-200 ease-in-out relative overflow-hidden',
                {
                  'bg-gradient-to-r from-primary to-tab text-white shadow-lg shadow-primary/25': isChildActive,
                  'text-dark hover:bg-tag hover:text-dark': !isChildActive,
                }
              )}
            >
              {isChildActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-tab opacity-10" />
              )}

              <Icon className={classNames(
                'flex-shrink-0 transition-transform duration-200',
                {
                  'w-5 h-5': true,
                  'group-hover:scale-110': !isChildActive,
                  'text-white': isChildActive,
                  'text-medium group-hover:text-dark': !isChildActive,
                }
              )} />

              {!isCollapsed && (
                <>
                  <span className={classNames(
                    'ml-4 transition-all duration-200 group-hover:scale-105 flex-1 text-left',
                    { 'opacity-0': isCollapsed }
                  )}>
                    {label}
                  </span>

                  <div className="ml-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </>
              )}

              {!isChildActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-tag to-packages opacity-0 transition-opacity duration-200 rounded-xl" />
              )}
            </button>

            {!isCollapsed && (
              <div className={classNames(
                'overflow-hidden transition-all duration-300 ease-in-out',
                {
                  'max-h-[500px] opacity-100': isExpanded,
                  'max-h-0 opacity-0': !isExpanded,
                }
              )}>
                <div className="mt-2 space-y-1">
                  {renderNestedChildren(children)}
                </div>
              </div>
            )}

            {isCollapsed && hasChildren && renderCollapsedDropdown(children, label,index)}
          </>
        ) : (
          <>
            <Link
              to={path}
              onClick={onClose}
              className={classNames(
                'group flex items-center px-4 py-3.5 rounded-xl text-sm font-medium',
                'transition-all duration-200 ease-in-out relative overflow-hidden w-full',
                {
                  'bg-gradient-to-r from-primary to-tab text-white shadow-lg shadow-primary/25': isActive,
                  'text-dark hover:bg-tag hover:text-dark': !isActive,
                }
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-tab opacity-10" />
              )}

              <Icon className={classNames(
                'flex-shrink-0 transition-transform duration-200',
                {
                  'w-5 h-5': true,
                  'group-hover:scale-110': !isActive,
                  'text-white': isActive,
                  'text-medium group-hover:text-dark': !isActive,
                }
              )} />

              {!isCollapsed && (
                <span className={classNames(
                  'ml-4 transition-all duration-200 group-hover:scale-105',
                  { 'opacity-0': isCollapsed }
                )}>
                  {label}
                </span>
              )}

              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-tag to-packages opacity-0 transition-opacity duration-200 rounded-xl" />
              )}
            </Link>

            {isCollapsed && !hasChildren && (
              <div
                className="fixed left-[4.5rem] ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[400] pointer-events-none shadow-lg"
                style={{ top: `calc(${index * 56}px + 100px)` }}
              >
                {label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-800"></div>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Get user display data
  const getUserDisplayData = () => {
    if (isLoadingUser) {
      return {
        name: 'Loading...',
        email: 'Loading...',
        initials: 'L'
      };
    }

    if (error || !userProfile) {
      return {
        name: 'Admin User',
        email: 'admin@example.com',
        initials: 'A'
      };
    }

    return {
      name: userProfile?.data?.firstname || 'User',
      email: userProfile?.data?.email || 'user@example.com',
      initials: getUserInitials(userProfile?.data?.firstname || 'User')
    };
  };

  const userDisplayData = getUserDisplayData();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        style={{
            scrollbarWidth:"none"
        }}
        className={classNames(
          'sticky top-0 z-30 lg:static h-screen bg-gradient-to-b from-backg to-white',
          'border-r border-line shadow-xl lg:shadow-none',
          'transition-all duration-300 ease-in-out flex-col lg:flex',
          {
            'w-81': !isCollapsed,
            'w-21': isCollapsed,
            'translate-x-0': isOpen,
          },
          'lg:translate-x-0'
        )}
      >
        <div className="relative flex-shrink-0">
          <div className={classNames(
            'flex items-center p-6 border-b border-line justify-center',
          )}>
            {!isCollapsed && (
              <div className="flex items-end space-x-3 justify-center">
                  <img src={Logo} alt="" className='w-[90px]' />
              </div>
            )}

            {isCollapsed && (
            <div className="flex items-end space-x-3">
                  <img src={Logo} alt="" className='w-[90px]' />
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className={classNames(
              'absolute -right-3 top-8 w-6 h-6 bg-white border-2 border-line',
              'rounded-full flex items-center justify-center shadow-md z-10',
              'hover:bg-backg transition-colors duration-200',

            )}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-medium" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-medium" />
            )}
          </button>
        </div>

        <nav className="mt-6 px-4 flex-1 relative" style={{ overflow: 'visible' }}>
          <div className="space-y-2" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)',scrollbarWidth:"none" }}>
            {navItems.map((item, index) => renderNavItem(item, index))}
          </div>
        </nav>

        <div className="p-4 border-t border-line flex-shrink-0 relative">
          {!isCollapsed ? (
            <div className="relative">
              <button
                onClick={handleUserClick}
                className="flex items-center space-x-3 px-4 py-2 w-full hover:bg-tag/30 rounded-lg transition-colors duration-200"
                disabled={isLoadingUser}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-alert-green to-alert-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {userDisplayData.initials}
                  </span>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-dark truncate">
                    {userDisplayData.name}
                  </p>
                  <p className="text-xs text-medium truncate">
                    {userDisplayData.email}
                  </p>
                </div>
                <ChevronUp className={classNames(
                  "w-4 h-4 text-medium transition-transform duration-200",
                  { "rotate-180": !showLogoutPopup }
                )} />
              </button>

              {/* Logout Popup */}
              {showLogoutPopup && (
                <div
                  ref={popupRef}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-line shadow-xl rounded-lg py-2 z-50 animate-in slide-in-from-bottom-2 duration-200"
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2.5 w-full hover:bg-red-50 transition-colors duration-200 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center relative group">
              <button
                onClick={handleUserClick}
                className="w-8 h-8 bg-gradient-to-br from-alert-green to-alert-blue rounded-full flex items-center justify-center hover:scale-105 transition-transform duration-200"
                disabled={isLoadingUser}
              >
                <span className="text-white text-xs font-semibold">
                  {userDisplayData.initials}
                </span>
              </button>

              {/* Collapsed User Tooltip */}
              <div className="fixed left-[4.5rem] ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-[100] pointer-events-none shadow-lg">
                {userDisplayData.name}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-800"></div>
              </div>

              {/* Logout Popup for Collapsed Sidebar */}
              {showLogoutPopup && (
                <div
                  ref={popupRef}
                  className="fixed left-[4.5rem] ml-3 bg-white border border-line shadow-xl rounded-lg py-2 z-[200] min-w-[120px] bottom-16"
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 w-full hover:bg-red-50 transition-colors duration-200 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-white"></div>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-line" style={{ marginRight: '1px' }}></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
