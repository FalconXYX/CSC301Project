import type { ClinicAddress } from "./types";

export const AddressStyle = ["single-line", "multi-line"] as const;

export function formatClinicAddress(
  address: ClinicAddress,
  style: (typeof AddressStyle)[0],
): string;
export function formatClinicAddress(
  address: ClinicAddress,
  style: (typeof AddressStyle)[1],
): string[];
export function formatClinicAddress(
  address: ClinicAddress,
  style: (typeof AddressStyle)[number],
): string | string[] {
  const { line1, line2, city, province, postalCode } = address;

  switch (style) {
    case "single-line":
      return line2
        ? `${line1}, ${line2}, ${city}, ${province}, ${postalCode}`
        : `${line1}, ${city}, ${province}, ${postalCode}`;
    case "multi-line":
      return line2
        ? [`${line1} (${line2})`, `${city}, ${province}`, postalCode]
        : [line1, `${city}, ${province}`, postalCode];
  }
}
