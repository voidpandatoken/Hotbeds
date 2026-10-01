// api/hotel.js

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Missing hotel ID' });
    }

    try {
        // SIMULATED BED BANK DATA 
        // In production, this will use your real API key to fetch live property details
        
        const mockDatabase = {
            "HOTEL-001": {
                name: "Sandman Hotel Hamilton",
                address: "560 Centennial Pkwy N, Hamilton, ON L8E 0G2",
                stars: "⭐⭐⭐⭐",
                score: "8.8",
                reviews: "1,245 reviews",
                description: "Experience exceptional comfort and modern design at the Sandman Hotel Hamilton. Located perfectly between Niagara Falls and Toronto, this premium property offers spacious, beautifully appointed guest rooms featuring free high-speed Wi-Fi, flat-screen TVs, and luxurious bedding.",
                amenities: ["Free High-Speed WiFi", "Heated Indoor Pool", "Fitness Center", "Chop Steakhouse", "Pet Friendly", "Free Parking"],
                images: [
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1582719478250-c894e4dc24a2?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1551882547-ff40eb0d1b73?q=80&w=600&auto=format&fit=crop"
                ],
                rooms: [
                    { name: "Standard King Room", beds: "1 King Bed", sleeps: 2, sqft: 300, price: 158.00, non_refundable: true },
                    { name: "Premium Double Queen", beds: "2 Queen Beds", sleeps: 4, sqft: 350, price: 179.00, non_refundable: false }
                ]
            },
            "HOTEL-002": {
                name: "The Pearle Hotel & Spa",
                address: "3 Elizabeth St, Burlington, ON L7R 0G3",
                stars: "⭐⭐⭐⭐⭐",
                score: "9.6",
                reviews: "892 reviews",
                description: "Discover ultimate luxury on the waterfront at The Pearle Hotel & Spa. Featuring breathtaking views of Lake Ontario, world-class dining, and a serene wellness spa designed to rejuvenate the mind and body.",
                amenities: ["Waterfront Views", "Luxury Spa", "Isabelle Restaurant", "Valet Parking", "Indoor Pool", "Premium WiFi"],
                images: [
                    "https://images.unsplash.com/photo-1542314831-c6a4d14cdce8?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=600&auto=format&fit=crop"
                ],
                rooms: [
                    { name: "Lakeview King Suite", beds: "1 King Bed", sleeps: 2, sqft: 450, price: 285.00, non_refundable: true },
                    { name: "Executive Suite", beds: "1 King, 1 Sofa Bed", sleeps: 4, sqft: 600, price: 415.00, non_refundable: false }
                ]
            },
            "HOTEL-003": {
                name: "Sheraton Hamilton",
                address: "116 King St W, Hamilton, ON L8P 4V3",
                stars: "⭐⭐⭐⭐",
                score: "8.9",
                reviews: "2,104 reviews",
                description: "Centrally located in the heart of downtown Hamilton, the Sheraton is connected to Jackson Square and FirstOntario Centre. Enjoy unmatched convenience for business or events, with premium amenities and incredible city views.",
                amenities: ["Downtown Location", "Indoor Pool", "Fitness Center", "Club Lounge", "Pet Friendly", "Restaurant"],
                images: [
                    "https://images.unsplash.com/photo-1551882547-ff40eb0d1b73?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1582719478250-c894e4dc24a2?q=80&w=600&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"
                ],
                rooms: [
                    { name: "Traditional Guest Room", beds: "1 King Bed", sleeps: 2, sqft: 320, price: 195.00, non_refundable: false },
                    { name: "Club Level Double", beds: "2 Double Beds", sleeps: 4, sqft: 320, price: 245.00, non_refundable: false }
                ]
            }
        };

        const hotelData = mockDatabase[id];

        if (!hotelData) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        res.setHeader('Cache-Control', 's-maxage=60');
        return res.status(200).json({ status: "success", data: hotelData });

    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ error: 'Failed to fetch hotel details.' });
    }
}
