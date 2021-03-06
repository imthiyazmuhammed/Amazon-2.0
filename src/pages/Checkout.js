import { useSession } from 'next-auth/client';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import { selectItems, selectTotal } from '../slices/basketSlice';
import Currency from 'react-currency-formatter';
import CheckoutProduct from '../components/CheckoutProduct';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
const stripePromise = loadStripe(process.env.stripe_public_key);

function Checkout() {
	const items = useSelector(selectItems);
	const [session] = useSession();
	const total = useSelector(selectTotal);

	const createCheckOutSession = async () => {
		const stripe = await stripePromise;
		//call backend to create a checkout session
		const checkoutSession = await axios.post('/api/create-checkout-session', {
			items: items,
			email: session.user.email,
		});
		//redirect the customer to stripe checkout
		const result = await stripe.redirectToCheckout({
			sessionId: checkoutSession.data.id,
		});
		if (result.error) {
			alert(result.error.message);
		}
	};
	return (
		<div className="bg-grey-100">
			<Header />
			<main className="lg:flex max-w-screen-2xl mx-auto">
				{/* left */}
				<div className="flex-grow m-5 shadow-sm">
					<Image
						src="https://links.papareact.com/ikj"
						width={1020}
						height={250}
						objectFit="contain"
					/>
					<div className="flex flex-col p-5 space-y-10 bg-white">
						<h1 className="text-3xl border-b pb-4">
							{items.length === 0
								? 'Your Amazon basket.'
								: 'Your basket is empty'}
						</h1>
						{items.map(
							(
								{ id, title, price, description, category, image, hasPrime },
								i
							) => (
								<CheckoutProduct
									key={i}
									id={id}
									title={title}
									price={price}
									description={description}
									category={category}
									image={image}
									hasPrime={hasPrime}
								/>
							)
						)}
					</div>
				</div>
				<div className="flex flex-col bg-white p-10 shadow-md">
					{items.length > 0 && (
						<>
							<h2 className="whitespace-nowrap">
								Subtotal ({items.length} items) :
								<span className="font-bold mx-2">
									<Currency quantity={total} currency="INR" />
								</span>
							</h2>

							<button
								role="link"
								onClick={createCheckOutSession}
								disabled={!session}
								className={`button mt-2 ${
									!session &&
									'from-gray-300 to-gray-500 border-gray-200 text-gray-300 cursor-not-allowed'
								}`}>
								{!session ? 'Sign in to Checkout ' : 'checkout'}
							</button>
						</>
					)}
				</div>
			</main>
		</div>
	);
}

export default Checkout;
