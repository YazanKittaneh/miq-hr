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


async function seed() {
  const passwordHash = await hashPassword('MiQSecure123!');

  // Create test users
  const testUsers = await db.insert(users).values([
    {
      email: 'hr.admin@miq.digital',
      passwordHash,
      role: 'hr',
      name: 'HR Administrator'
    },
    {
      email: 'dept.head@miq.digital',
      passwordHash,
      role: 'manager',
      name: 'Department Head'
    },
    {
      email: 'employee@miq.digital',
      passwordHash, 
      role: 'employee',
      name: 'Test Employee'
    }
  ]).returning();

  console.log('Created test users:');
  testUsers.forEach(user => console.log(`- ${user.email} (${user.role})`));

  // Create regional teams structure
  await createTeams();
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
