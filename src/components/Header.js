import Image from 'next/image';
import {
	MenuIcon,
	SearchIcon,
	ShoppingCartIcon,
	shoppingIcon,
} from '@heroicons/react/outline';
import { signIn, signOut, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectItems } from '../slices/basketSlice';

function Header() {
	const [session] = useSession();
	const router = useRouter();
	const items = useSelector(selectItems);

	return (
		<header className="">
			{/* top nav */}
			<div className="flex items-center bg-amazon_blue p-1 flex-grow py-3">
				<MenuIcon className="h-10 mx-2 mt-2 text-white" />
				<div className="flex items-center flex-grow -mt-1 mr-2 sm:flex-grow-0">
					<Image
						onClick={() => router.push('/')}
						src="/../public/logo.png"
						width={150}
						height={40}
						objectFit="contain"
						className="cursor-pointer py-3"
					/>
				</div>
				{/* search */}
				<div className="hidden sm:flex items-center h-10 rounded-md flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-300 ">
					<input
						type="text"
						className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:none px-4"
					/>
					<SearchIcon className="h-12 p-4" />
				</div>
				<div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
					<div onClick={!session ? signIn : signOut} className="link">
						<p> {session ? `Hello, ${session.user.name}` : 'SignIn'} </p>
						<p className="font-extrabold md:text-sm">Account</p>
					</div>
					<div className="link">
						<p className="font-extrabold md:text-sm">Orders</p>
					</div>
					<div
						onClick={() => router.push('/checkout')}
						className="relative link flex items-center ">
						<span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full text-black font-bold">{/*  */}
							{items.length}
						</span>
						<ShoppingCartIcon className="h-10" />
						<p className="hidden md:inline mt-2 font-extrabold md:text-sm ">
							Cart
						</p>
					</div>
				</div>
			</div>
			<div className=" flex flex-auto items-center space-x-3 pl-5 bg-amazon_blue-light text-white text-small">
				<p className="link flex items-center">All</p>
				<p className="link">Hot Picks</p>
				<p className="link">Kuttys business</p>
				<p className="link">todays Deals</p>

				<p className="link hidden lg:inline-flex">Electronics</p>
				<p className="link hidden lg:inline-flex">Food & Delivery</p>
				<p className="link hidden lg:inline-flex">Selected Items</p>
				<p className="link hidden lg:inline-flex">Shopper Toolkit</p>
			</div>
		</header>
	);
}

export default Header;
