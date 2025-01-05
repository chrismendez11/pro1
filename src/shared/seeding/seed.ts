import { PrismaClient } from '@prisma/client';
import companies from './data/companies.json';
import companySettings from './data/company-settings.json';
import countries from './data/countries.json';
import courtStatus from './data/court-status.json';
import currency from './data/currency.json';
import reservationStatus from './data/reservation-status.json';
import roles from './data/roles.json';
import sportCategories from './data/sport-categories.json';
import sportCourtTypes from './data/sport-court-types.json';
import users from './data/users.json';

const prisma = new PrismaClient();

async function main() {
  // Constants
  await Promise.all(
    countries.map(async (country) => {
      const { countryId } = country;
      return prisma.country.upsert({
        where: { countryId },
        create: country,
        update: country,
      });
    }),
  );

  await Promise.all(
    courtStatus.map(async (courtStatus) => {
      const { courtStatusId } = courtStatus;
      return prisma.courtStatus.upsert({
        where: { courtStatusId },
        create: courtStatus,
        update: courtStatus,
      });
    }),
  );

  await Promise.all(
    currency.map(async (currency) => {
      const { currencyId } = currency;
      return prisma.currency.upsert({
        where: { currencyId },
        create: currency,
        update: currency,
      });
    }),
  );

  await Promise.all(
    reservationStatus.map(async (reservationStatus) => {
      const { reservationStatusId } = reservationStatus;
      return prisma.reservationStatus.upsert({
        where: { reservationStatusId },
        create: reservationStatus,
        update: reservationStatus,
      });
    }),
  );

  await Promise.all(
    roles.map(async (role) => {
      const { roleId } = role;
      return prisma.role.upsert({
        where: { roleId },
        create: role,
        update: role,
      });
    }),
  );

  await Promise.all(
    sportCategories.map(async (sportCategory) => {
      const { sportCategoryId } = sportCategory;
      return prisma.sportCategory.upsert({
        where: { sportCategoryId },
        create: sportCategory,
        update: sportCategory,
      });
    }),
  );

  await Promise.all(
    sportCourtTypes.map(async (sportCourtType) => {
      const { sportCourtTypeId } = sportCourtType;
      return prisma.sportCourtType.upsert({
        where: { sportCourtTypeId },
        create: sportCourtType,
        update: sportCourtType,
      });
    }),
  );

  // QuickStart Data
  await Promise.all(
    companies.map(async (company) => {
      const { companyId } = company;
      return prisma.company.upsert({
        where: { companyId },
        create: company,
        update: company,
      });
    }),
  );

  await Promise.all(
    companySettings.map(async (companySetting) => {
      const { companySettingId } = companySetting;
      return prisma.companySetting.upsert({
        where: { companySettingId },
        create: companySetting,
        update: companySetting,
      });
    }),
  );

  await Promise.all(
    users.map(async (user) => {
      const { userId } = user;
      return prisma.user.upsert({
        where: { userId },
        create: user,
        update: user,
      });
    }),
  );
}

main()
  .then(() => {
    console.log('Seeding completed!');
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
