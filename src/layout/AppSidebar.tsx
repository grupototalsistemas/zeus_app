'use client';
import { RootState } from '@/store/rootReducer';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSidebar } from '../context/SidebarContext';
import {
  BoxCubeIcon,
  CalenderIcon,
  Chamado,
  ChevronDownIcon,
  Empresa,
  HorizontaLDots,
  ListIcon,
  PieChartIcon,
  PlugInIcon,
  UserCircleIcon,
} from '../icons/index';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <CalenderIcon className="text-gray-900 dark:text-white" />,
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: <Chamado className="text-gray-900 dark:text-white" />,
    name: 'Chamados',
    subItems: [
      { name: 'Gerenciar Chamado', path: '/gerenciar-chamado', pro: false },
      { name: 'Listar Chamados', path: '/listar-chamado', pro: false },
      {
        name: 'Gerenciar tempo de execução',
        path: '/gerenciar-prioridade',
        pro: false,
      },
      {
        name: 'Gerenciar ocorrencias',
        path: '/gerenciar-ocorrencia',
        pro: false,
      },
      {
        name: 'Gerenciar tipos de ocorrencias',
        path: '/gerenciar-tipo-ocorrencia',
        pro: false,
      },
      {
        name: 'Gerenciar etapas de movimento',
        path: '/gerenciar-movimento-etapas',
        pro: false,
      },
    ],
  },
  {
    icon: <UserCircleIcon className="text-gray-900 dark:text-white" />,
    name: 'Pessoas',
    subItems: [
      { name: 'Gerenciar Pessoas', path: '/gerenciar-pessoa', pro: false },
      { name: 'Listar Pessoas', path: '/listar-pessoa', pro: false },
      { name: 'Gerenciar Usuarios', path: '/gerenciar-usuarios', pro: false },
      {
        name: 'Gerenciar Perfis',
        path: '/gerenciar-perfis',
        pro: false,
      },
      {
        name: 'Gerenciar Funções de Pessoas',
        path: '/gerenciar-tipo',
        pro: false,
      },
    ],
  },
  {
    icon: <Empresa className="text-gray-900 dark:text-white" />,
    name: 'Empresas',
    subItems: [
      { name: 'Gerenciar empresa', path: '/gerenciar-empresa', pro: false },
      { name: 'Listar empresas', path: '/listar-empresas', pro: false },
      {
        name: 'Gerenciar Categorias de Empresas',
        path: '/gerenciar-categoria',
        pro: false,
      },
      { name: 'Gerenciar Sistemas', path: '/gerenciar-sistema', pro: false },
      {
        name: 'Gerenciar Tipo de Empresa',
        path: '/gerenciar-tipo-empresa',
        pro: false,
      },
    ],
  },

  {
    name: 'Configurações',
    icon: <ListIcon className="text-gray-900 dark:text-white" />,
    subItems: [
      { name: 'Configurações gerais', path: '/config', pro: false },
      { name: 'Suporte Interno', path: '/suport', pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon className="text-gray-900 dark:text-white" />,
    name: 'Charts',
    subItems: [
      { name: 'Line Chart', path: '/line-chart', pro: false },
      { name: 'Bar Chart', path: '/bar-chart', pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon className="text-gray-900 dark:text-white" />,
    name: 'UI Elements',
    subItems: [
      { name: 'Alerts', path: '/alerts', pro: false },
      { name: 'Avatar', path: '/avatars', pro: false },
      { name: 'Badge', path: '/badge', pro: false },
      { name: 'Buttons', path: '/buttons', pro: false },
      { name: 'Images', path: '/images', pro: false },
      { name: 'Videos', path: '/videos', pro: false },
    ],
  },
  {
    icon: <PlugInIcon className="text-gray-900 dark:text-white" />,
    name: 'Authentication',
    subItems: [
      { name: 'Sign In', path: '/signin', pro: false },
      { name: 'Sign Up', path: '/signup', pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const pessoa = useSelector((state: RootState) => state.pessoa);
  const empresa = pessoa.pessoaLogada?.empresaId;
  const pathname = usePathname();

  // Função para fechar sidebar em mobile após clique
  const handleMobileNavigation = useCallback(() => {
    if (isMobileOpen && window.innerWidth < 1024) {
      // lg breakpoint
      toggleMobileSidebar();
    }
  }, [isMobileOpen, toggleMobileSidebar]);

  const renderMenuItems = (navItems: NavItem[], menuType: 'main') => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'lg:justify-start'
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto h-5 w-5 text-gray-900 transition-transform duration-200 dark:text-white ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? 'text-brand-500 rotate-180'
                      : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                onClick={handleMobileNavigation} // Fecha sidebar em mobile
                className={`menu-item group ${
                  isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px',
              }}
            >
              <ul className="mt-2 ml-9 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      onClick={handleMobileNavigation} // Fecha sidebar em mobile
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.name}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ['main'].forEach((menuType) => {
      const items = navItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main',
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: 'main') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen
          ? 'w-[290px]'
          : isHovered
            ? 'w-[290px]'
            : 'w-[90px]'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex py-8 ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link href="/" onClick={handleMobileNavigation}>
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <div className="flex flex-row items-center gap-1 dark:text-white">
                <h1 className="ml-2 text-4xl dark:text-white">Zeus</h1>
                <h3 className="ml-2 text-sm dark:text-white">{empresa}</h3>
              </div>
            </>
          ) : (
            <h1 className="ml-2 text-4xl dark:text-white">Z</h1>
          )}
        </Link>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HorizontaLDots className="text-gray-900 dark:text-white" />
                )}
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>

            <div className="">
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded ||
                  isHovered ||
                  (isMobileOpen && (
                    <HorizontaLDots className="text-gray-900 dark:text-white" />
                  ))}
              </h2>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
