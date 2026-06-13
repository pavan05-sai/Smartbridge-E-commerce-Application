import React from 'react';

export default function AddressForm({ address, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card-glass border border-borderBlue rounded-xl p-6 space-y-4 shadow-md">
      <h3 className="text-lg font-bold font-heading text-text-primary mb-2">Shipping Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Street Address */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Street Address
          </label>
          <input
            type="text"
            name="street"
            required
            value={address.street}
            onChange={handleChange}
            placeholder="e.g. 123 Neon Boulevard"
            className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
          />
        </div>

        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            City
          </label>
          <input
            type="text"
            name="city"
            required
            value={address.city}
            onChange={handleChange}
            placeholder="e.g. Metropolis"
            className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
          />
        </div>

        {/* State */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            State / Province
          </label>
          <input
            type="text"
            name="state"
            required
            value={address.state}
            onChange={handleChange}
            placeholder="e.g. California"
            className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
          />
        </div>

        {/* Postal Code (Pincode) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Postal Code / Pincode
          </label>
          <input
            type="text"
            name="pincode"
            required
            value={address.pincode}
            onChange={handleChange}
            placeholder="e.g. 90210"
            className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
          />
        </div>

        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Country
          </label>
          <input
            type="text"
            name="country"
            required
            value={address.country}
            onChange={handleChange}
            placeholder="e.g. United States"
            className="w-full bg-background-primary border border-borderBlue rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-bright focus:ring-1 focus:ring-accent-bright focus:shadow-glow transition-all"
          />
        </div>
      </div>
    </div>
  );
}
