import { Link, NavLink } from 'react-router';
import { MEGA_MENU_ITEMS } from '~/lib/navigation';

export function HeaderMenuMega() {
    return (
        <nav className="hidden md:flex gap-8 items-center h-full" role="navigation">
            {MEGA_MENU_ITEMS.map((item) => (
                <div key={item.handle} className="group h-full flex items-center">
                    <NavLink
                        to={`/collections/${item.handle}`}
                        className={({ isActive }) =>
                            `font-sans text-sm tracking-widest uppercase hover:text-primary transition-colors border-b-2 py-1 ${isActive ? 'border-primary' : 'border-transparent'
                            }`
                        }
                    >
                        {item.title}
                    </NavLink>

                    {/* Mega Menu Dropdown */}
                    <div className="absolute left-0 top-full w-full bg-white border-t border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50">
                        <div className="container mx-auto px-12 py-12">
                            <div className="grid grid-cols-12 gap-8">
                                {/* Links Column */}
                                <div className="col-span-8 grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-display text-xl text-primary mb-6">{item.title}</h4>
                                        <ul className="space-y-4">
                                            {item.items?.map((subItem) => (
                                                <li key={subItem.handle}>
                                                    <Link
                                                        to={`/collections/${subItem.handle}`}
                                                        className="font-sans font-light text-gray-600 hover:text-primary transition-colors block"
                                                    >
                                                        {subItem.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Suggestion or specialized promo could go here if data existed */}
                                </div>

                                {/* Promotional Image Column */}
                                {item.image && (
                                    <div className="col-span-4 bg-gray-50 aspect-[4/3] overflow-hidden relative group/image">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        <div className="absolute bottom-6 left-6 text-white z-10">
                                            <span className="uppercase text-xs tracking-widest font-semibold mb-2 block">Featured</span>
                                            <h3 className="font-display text-2xl">{item.title}</h3>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <NavLink
                to="/pages/about"
                className={({ isActive }) =>
                    `font-sans text-sm tracking-widest uppercase hover:text-primary transition-colors border-b-2 py-1 ${isActive ? 'border-primary' : 'border-transparent'
                    }`
                }
            >
                About
            </NavLink>
            <NavLink
                to="/policies/shipping-policy"
                className={({ isActive }) =>
                    `font-sans text-sm tracking-widest uppercase hover:text-primary transition-colors border-b-2 py-1 ${isActive ? 'border-primary' : 'border-transparent'
                    }`
                }
            >
                Shipping
            </NavLink>
        </nav>
    );
}
