import { buffer } from 'micro';
import * as admin from 'firebase-admin';

//secure a connection to firebase from the backend
const serviceAccount = require('../../../permission.json');
const app = !admin.apps.length
	? admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
	  })
	: admin.app();
//establish connection to stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
	//console.log('full filling order', session);
	return app
		.firestore()
		.collection('users')
		.doc(session.metadata.email)
		.collection('orders')
		.doc(session.id)
		.set({
			amount: session.amount_total / 100,
			amount_shipping: session.total_details.amount_shipping / 100,
			images: JSON.parse(session.metadata.images),
			timestamp: admin.firestore.FieldValue.serverTimestamp(),
		})
		.then(() => {
			console.log(`Success: order ${session.id} had been added to the DB`);
		})
		.catch((err) => res.status(400).send(`database : ${err.message}`));
};

export default async (req, res) => {
	if (req.method === 'POST') {
		const requestBuffer = await buffer(req);
		const payLoad = requestBuffer.toString();
		const sig = req.headers['stripe-signature'];

		let event;

		//verify that the event came from stripe
		try {
			event = stripe.webhooks.constructEvent(payLoad, sig, endpointSecret);
		} catch (err) {
			console.log('error : ', err.message);
			return res.status(400).send(`webhook error: ${err.message}`);
		}
		//handle checkout session completed event
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			//fullfill the order
			return fulfillOrder(session)
				.then(() => res.status(200).send('ok'))
				.catch((err) => res.status(400).send(`WebHook error : ${err.message}`));
		}
	}
};
export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};
/* 
import { buffer } from 'micro';
import * as admin from 'firebase-admin';

// Secure a connection to firebase
const serviceAccount = require('../../../permission.json');
const app = !admin.apps.length
	? admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
	  })
	: admin.app();

// Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
const fullfillOrder = async (session) => {
	console.log('Fullfilling Order!!!', session);
	app
		.firestore()
		.collection('users')
		.doc(session.metadata.email)
		.collection('orders')
		.doc(session.id)
		.set({
			amount: session.amount_total / 100,
			amount_shipping: session.total_details_amount_shipping / 100,
			images: JSON.parse(session.metadata.images),
			title: JSON.parse(session.metadata.titles),
			timestamp: admin.firestore.FieldValue.serverTimestamp(),
		})
		.then(() => {
			console.log(`SUCCESS: Order ${session.id} has been added to DB!`);
		});
};

export default async (req, res) => {
	if (req.method === 'POST') {
		const requestBuffer = await buffer(req);
		const payload = requestBuffer.toString();
		const sig = req.headers['stripe-signature'];
		let event;

		// Verify (came from stripe)
		try {
			event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
		} catch (err) {
			console.log('ERROR', err.message);
			return res.status(400).send({ message: 'Webhook error: ' + err.message });
		}
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;

			// Fullfill the order
			return fullfillOrder(session)
				.then(() => res.status(200))
				.catch((e) =>
					res.status(400).send({ message: 'WEBHOOK_ERROR: ' + e.message })
				);
		}
	}
};

export const config = {
	api: {
		bodyParser: false,
		externalResolver: true,
	},
};
 */
