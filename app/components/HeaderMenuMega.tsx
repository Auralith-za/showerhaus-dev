import { Link, NavLink } from 'react-router';
import { MEGA_MENU_ITEMS } from '~/lib/navigation';

export function HeaderMenuMega() {
    return (
        <nav className="hidden lg:flex gap-12 items-center h-full" role="navigation">
            {MEGA_MENU_ITEMS.map((item) => (
                <div key={item.handle} className="group h-full flex items-center">
                    <NavLink
                        to={`/collections/${item.handle}`}
                        className={({ isActive }) =>
                            `font-sans text-[10px] font-bold tracking-[0.2em] uppercase transition-colors hover:text-primary py-2 ${
                                isActive ? 'text-primary' : 'text-gray-500'
                            }`
                        }
                    >
                        {item.title}
                    </NavLink>

                    {/* Mega Menu Dropdown */}
                    {item.categories && item.categories.length > 0 && (
                        <div className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50 p-12 translate-y-2 group-hover:translate-y-0">
                            <div className="container mx-auto max-w-7xl">
                                <div className="grid grid-cols-4 gap-12">
                                    {item.categories.map((cat) => (
                                        <div key={cat.handle} className="flex flex-col gap-6">
                                            <Link
                                                to={`/collections/${cat.handle}`}
                                                className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-primary border-b border-gray-100 pb-3 hover:text-secondary transition-colors"
                                            >
                                                {cat.title}
                                            </Link>
                                            {cat.items && (
                                                <ul className={`flex flex-col gap-2 ${cat.items.length > 5 ? 'grid grid-cols-2 gap-x-8 gap-y-2' : ''}`}>
                                                    {cat.items.map((sub) => (
                                                        <li key={sub.handle}>
                                                            <Link
                                                                to={`/collections/${sub.handle}`}
                                                                className="font-sans text-[11px] text-gray-500 hover:text-primary transition-colors font-light whitespace-nowrap"
                                                            >
                                                                {sub.title}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}

