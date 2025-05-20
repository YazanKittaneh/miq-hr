import { NextResponse } from 'next/server';
import { validateUserRole } from '@/lib/db/queries';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const isAuthorized = await validateUserRole('hr');
  if (!isAuthorized) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const allowedFields = ['jobTitle', 'department', 'phone', 'address'];
    const updates = Object.keys(body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key as keyof typeof updates] = body[key];
        return obj;
      }, {} as Record<string, any>);

    await db
      .update(users)
      .set(updates)
      .where(eq(users.id, parseInt(params.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating team member:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
