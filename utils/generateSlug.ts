export function generateVehicleSlug(vehicle: { brand: any; model: any; year: any; user: any; adId: any; }) {
  const { brand, model, year, user, adId } = vehicle;
  const city = user.userCity.toLowerCase().replace(/\s+/g, "-");
  const formattedBrand = brand.toLowerCase().replace(/\s+/g, "-");
  const formattedModel = model.toLowerCase().replace(/\s+/g, "-");

  return `${formattedBrand}-${formattedModel}-${year}-for-sale-${city}-${adId}`;
}
