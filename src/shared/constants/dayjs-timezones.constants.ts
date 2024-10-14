/**
 * @description Dayjs Timezones based on the **countryId** property from the database table **Country**
 */
class DayjsTimezonesConstants {
  static readonly [68] = 'America/Guatemala';
}

/**
 * @description Get the timezone based on the countryId
 * @param countryId The countryId from the database table **Country**
 * @returns The timezone based on the countryId
 */
export function getTimezoneByCountryId(countryId: number): string {
  return DayjsTimezonesConstants[countryId];
}
