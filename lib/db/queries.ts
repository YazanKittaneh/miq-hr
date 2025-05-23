import { desc, and, eq, isNull } from 'drizzle-orm';
import { db } from './drizzle';
import { activityLogs, departments, teamMembers, teams, users } from './schema';
import type { User, userRole } from './schema';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth/session';

export async function getUser() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== 'number'
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      jobTitle: users.jobTitle,
      department: users.department,
      phone: users.phone,
      address: users.address,
      createdAt: users.createdAt,
      passwordHash: users.passwordHash
    })
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    stripeProductId: string | null;
    planName: string | null;
    subscriptionStatus: string;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date()
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam() {
  const gotUser = await getUser()
  const userId = gotUser?.id;
  const userTeamId = gotUser?.department
  const result = await db
    .select({
      user: users,
      department: departments
    })
    .from(users)
    .where(eq(users.department, userTeamId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const result = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        }
      }
    }
  });

  return result?.team || null;
}

export async function getUserRole() {
  const user = await getUser();
  return user?.role ?? null;
}

export async function validateUserRole(requiredRole: User['role']) {
  const user = await getUser();
  if (!user) return false;
  
  // Define role hierarchy
  const roleHierarchy: Record<User['role'], number> = {
    employee: 1,
    hr: 2,
    manager: 3,
    super_manager: 4
  };
  

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

export async function getTeamMembers() {
  const user = await getUser();
  if (!user) throw new Error('Unauthorized');

  const team = await getTeamForUser();
  if (!team) throw new Error('User not part of a team');

  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      jobTitle: users.jobTitle,
      department: users.department,
      phone: users.phone,
      address: users.address
    })
    .from(users)
    .innerJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(teamMembers.teamId, team.id));
}

export async function getAllUsers() {
  // Require at least HR-level permissions
  const isAuthorized = await validateUserRole('hr');
  if (!isAuthorized) throw new Error('Unauthorized');

  return await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      jobTitle: users.jobTitle,
      department: users.department,
      phone: users.phone,
      address: users.address,
      createdAt: users.createdAt
    })
    .from(users)
    .where(isNull(users.deletedAt))  // Exclude soft-deleted users
    .orderBy(desc(users.createdAt)); // Newest users first
}

// export async function sendInvitationEmail(email: string, name: string, role: typeof userRole){}
//   const user = await getUser();
//   if (!user) return false;

//   const { data, error } = await supabase.auth.admin.inviteUserByEmail('email@example.com')

// }
