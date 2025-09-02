export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-US").format(number);
};

export const formatSquareFeet = (sqft) => {
  return `${formatNumber(sqft)} sqft`;
};

export const formatBedBath = (beds, baths) => {
  return `${beds}bd • ${baths}ba`;
};

export const formatAddress = (address, city, state) => {
  return `${address}, ${city}, ${state}`;
};

export const formatPropertyType = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};