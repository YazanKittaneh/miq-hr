import { stripe } from '../payments/stripe';
import { db } from './drizzle';
import { users, teams, teamMembers } from './schema';
import { hashPassword } from '@/lib/auth/session';

async function createTeams() {
  console.log('Creating regional teams...');
  
  const regions = [
    {
      name: 'North America',
      key: 'north_america',
      cities: ['Atlanta', 'Chicago', 'Dallas', 'Denver', 'Los Angeles', 'New York', 'Toronto', 'Washington D.C.', 'Vancouver']
    },
    {
      name: 'EMEA',
      key: 'emea', 
      cities: ['Dubai', 'London', 'Manchester']
    },
    {
      name: 'Asia Pacific',
      key: 'asia_pacific',
      cities: ['Shanghai', 'Beijing', 'Singapore', 'Brisbane', 'Melbourne', 'Perth', 'Sydney']
    },
    {
      name: 'India',
      key: 'india',
      cities: ['Bengaluru', 'Mumbai', 'Gurugram']
    }
  ];

  for (const region of regions) {
    for (const city of region.cities) {
      await db.insert(teams).values({
        name: city,
        region: region.key,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }
}

async function createStripeProducts() {
  console.log('Creating Stripe products and prices...');

  const baseProduct = await stripe.products.create({
    name: 'Base',
    description: 'Base subscription plan',
  });

  await stripe.prices.create({
    product: baseProduct.id,
    unit_amount: 800, // $8 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  const plusProduct = await stripe.products.create({
    name: 'Plus',
    description: 'Plus subscription plan',
  });

  await stripe.prices.create({
    product: plusProduct.id,
    unit_amount: 1200, // $12 in cents
    currency: 'usd',
    recurring: {
      interval: 'month',
      trial_period_days: 7,
    },
  });

  console.log('Stripe products and prices created successfully.');
}

async function seed() {
  const email = 'test@test.com';
  const password = 'admin123';
  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values([
      {
        email: email,
        passwordHash: passwordHash,
        role: "super_manager",
      },
    ])
    .returning();

  console.log('Initial user created.');

  const [team] = await db
    .insert(teams)
    .values({
      name: 'Test Team',
      region: 'north_america',
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: 'owner',
  });

  await createTeams();
  await createStripeProducts();
}

seed()
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed process finished. Exiting...');
    process.exit(0);
  });
