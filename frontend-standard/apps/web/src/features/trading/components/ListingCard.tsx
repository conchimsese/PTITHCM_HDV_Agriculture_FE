import type { ListingFeedItem } from '@agri/contracts';
export function ListingCard({ listing }: { listing: ListingFeedItem }) {
  return (
    <article className="card listing">
      <div className="listing-top">
        <span className="badge">{listing.seedType}</span>
        <span>{listing.distanceKm.toFixed(1)} km</span>
      </div>
      <h2>{listing.farmer.fullName}</h2>
      <p>
        Ruộng lúa · {listing.plotLat.toFixed(3)}, {listing.plotLng.toFixed(3)}
      </p>
    </article>
  );
}
