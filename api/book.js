// api/book.js

export default async function handler(req, res) {
    // Only allow POST requests (since we are sending sensitive checkout data)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // 1. Grab the data sent from the checkout.html form
        const { 
            firstName, lastName, email, phone, 
            hotel, room, checkin, checkout, 
            cardNumber // In production, Stripe tokenizes this so your server never touches it!
        } = req.body;

        // 2. Basic Validation
        if (!firstName || !email || !hotel) {
            return res.status(400).json({ error: 'Missing required booking details' });
        }

        console.log(`Processing booking for ${firstName} ${lastName} at ${hotel}...`);

        /* 
        =========================================================
        LIVE BED BANK & STRIPE CALLS GO HERE
        In production, we will:
        A. Send the credit card token to Stripe to charge the card.
        B. If successful, ping the Bed Bank API to lock in the room.
        =========================================================
        */

        // 3. Generate a secure Booking Reference Number (Mock logic)
        const generateRef = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let ref = 'HB-';
            for (let i = 0; i < 6; i++) {
                ref += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return ref;
        };

        const bookingReference = generateRef();

        // 4. Return the Success Response
        // We send back the booking reference so the frontend can display the receipt
        return res.status(200).json({
            status: "success",
            booking_reference: bookingReference,
            message: "Payment processed and room secured.",
            guest: { name: `${firstName} ${lastName}`, email: email },
            itinerary: { hotel, room, checkin, checkout }
        });

    } catch (error) {
        console.error("Booking Error:", error);
        return res.status(500).json({ error: 'Failed to process booking.' });
    }
}
