export const AddressStyle = ['single-line', 'multi-line'] as const

export function formatProviderAddress(
  address: ClinicAddress,
  style: (typeof AddressStyle)[0],
): string
export function formatProviderAddress(
  address: ClinicAddress,
  style: (typeof AddressStyle)[1],
): string[]
export function formatProviderAddress(
  address: ClinicAddress,
  style: (typeof AddressStyle)[number],
): string | string[] {
  const { line1, line2, city, province, postalCode } = address

  switch (style) {
    case 'single-line':
      return line2
        ? `${line1}, ${line2}, ${city}, ${province}, ${postalCode}`
        : `${line1}, ${city}, ${province}, ${postalCode}`
    case 'multi-line':
      return line2
        ? [`${line1} (${line2})`, `${city}, ${province}`, postalCode]
        : [line1, `${city}, ${province}`, postalCode]
  }
}

export function formatGoogleMapsAddress(
  addressComponents: google.maps.places.AddressComponent[],
): ClinicAddress {
  const getComponent = (types: string[]) =>
    addressComponents.find((comp) => types.every((t) => comp.types.includes(t)))?.longText ?? ''

  return {
    line1: getComponent(['street_number']) + ' ' + getComponent(['route']),
    line2: '',
    city: getComponent(['locality']),
    province: getComponent(['administrative_area_level_1']),
    postalCode: getComponent(['postal_code']),
  }
}
