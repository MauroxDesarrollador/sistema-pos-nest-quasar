function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radio de la Tierra en metros

    // Asegurarse de que los valores sean números
    lat1 = parseFloat(lat1);
    lon1 = parseFloat(lon1);
    lat2 = parseFloat(lat2);
    lon2 = parseFloat(lon2);

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distancia en metros
}

function isWithinRange(lat1, lon1, lat2, lon2, metros) {
    const distance = haversine(lat1, lon1, lat2, lon2);
    return distance <= metros;
}

export default isWithinRange;
