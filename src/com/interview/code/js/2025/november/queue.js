const esc = (s = "") => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getSimilarApartments = async (req, res) => {
    try {
        const { id } = req.params;

        const base = await collection.findOne({ _id: new ObjectId(id) });
        if (!base) return res.status(404).json({ error: "Apartment not found" });

        const basePrice = Number(base.price || 0);
        const baseGuests = Number(base.maxGuests || 0);
        const baseAmenities = Array.isArray(base.amenities) ? base.amenities : [];

        const parts = String(base.address || "")
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
        const city = parts[1] || parts[0] || "";

        const or = [];
        if (city) or.push({ address: { $regex: esc(city), $options: "i" } });
        if (baseAmenities.length) or.push({ amenities: { $in: baseAmenities } });

        const priceMin = basePrice ? Math.max(0, basePrice * 0.5) : 0;
        const priceMax = basePrice ? basePrice * 1.5 : Number.MAX_SAFE_INTEGER;

        const candidates = await collection
            .find({
                _id: { $ne: new ObjectId(id) },
                price: { $gte: priceMin, $lte: priceMax },
                ...(or.length ? { $or: or } : {}),
            })
            .limit(50)
            .toArray();

        const score = (a) => {
            const p = Number(a.price || 0);
            const g = Number(a.maxGuests || 0);
            const am = Array.isArray(a.amenities) ? a.amenities : [];

            const amenityHit =
                baseAmenities.length && am.length
                    ? baseAmenities.filter((x) => am.includes(x)).length / Math.max(baseAmenities.length, am.length)
                    : 0;

            const priceSim =
                basePrice && p ? 1 - Math.min(1, Math.abs(basePrice - p) / Math.max(basePrice, p)) : 0;

            const guestSim =
                baseGuests || g ? 1 - Math.min(1, Math.abs(baseGuests - g) / Math.max(baseGuests || 1, g || 1)) : 0;

            const locSim = city && new RegExp(esc(city), "i").test(String(a.address || "")) ? 1 : 0;

            return Number((0.4 * locSim + 0.3 * amenityHit + 0.2 * priceSim + 0.1 * guestSim).toFixed(4));
        };

        const results = candidates
            .map((a) => ({ ...a, similarityScore: score(a) }))
            .sort((x, y) => y.similarityScore - x.similarityScore);

        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching similar apartments:", error);
        res.status(500).json({ error: "Failed to fetch similar apartments." });
    }
};
