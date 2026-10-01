// api/search.js

export default async function handler(req, res) {
    // 1. Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 2. Extract the search parameters sent from index.html
    const { destination, checkin, checkout, guests } = req.query;

    if (!destination || !checkin || !checkout) {
        return res.status(400).json({ error: 'Missing required search parameters' });
    }

    // 3. SECURE API KEY INJECTION
    // In production, this pulls from Vercel's secure environment variables
    // so it is NEVER exposed to the public browser.
    const BED_BANK_API_KEY = process.env.BED_BANK_API_KEY || "dummy_sandbox_key_123";

    try {
        /* 
        =========================================================
        LIVE API CALL GOES HERE
        When you sign your contract, we replace the dummy data below
        with an actual fetch() request to RateHawk or Hotelbeds.
        =========================================================
        */
        
        console.log(`Searching API for: ${destination} | Dates: ${checkin} to ${checkout}`);

        // SIMULATED BED BANK JSON RESPONSE
        const mockApiResponse = {
            status: "success",
            search_id: "REQ-982374923",
            total_found: 3,
            data: [
                { 
                    id: "HOTEL-001",
                    name: "Sandman Hotel Hamilton", 
                    location: "Hamilton, ON",
                    stars: "⭐⭐⭐⭐",
                    score: "8.8",
                    price: 158.00, 
                    room: "Standard King",
                    badge: true,
                    amenities: ["Free Parking", "Pool", "Restaurant"],
                    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" 
                },
                { 
                    id: "HOTEL-002",
                    name: "The Pearle Hotel & Spa", 
                    location: "Burlington, ON",
                    stars: "⭐⭐⭐⭐⭐",
                    score: "9.6",
                    price: 285.00, 
                    room: "Lakeview Double",
                    badge: false,
                    amenities: ["Spa", "Lakefront", "Valet"],
                    img: "https://images.unsplash.com/photo-1542314831-c6a4d14cdce8?q=80&w=800&auto=format&fit=crop" 
                },
                { 
                    id: "HOTEL-003",
                    name: "Sheraton Hamilton", 
                    location: "Hamilton, ON",
                    stars: "⭐⭐⭐⭐",
                    score: "8.9",
                    price: 195.00, 
                    room: "Premium Queen",
                    badge: false,
                    amenities: ["Fitness Center", "Pet Friendly", "Bar"],
                    img: "https://images.unsplash.com/photo-1582719478250-c894e4dc24a2?q=80&w=800&auto=format&fit=crop" 
                }
            ]
        };

        // 4. Send the clean data back to your results.html page
        // We add cache-control headers to make the response lightning fast
        res.setHeader('Cache-Control', 's-maxage=60');
        return res.status(200).json(mockApiResponse);

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: 'Failed to fetch hotel data.' });
    }
}
