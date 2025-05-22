import { getAllUsers } from '@/lib/db/queries';

export async function GET() {
  const users = await getAllUsers();
  return Response.json(users);
}
