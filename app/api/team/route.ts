import { getUserWithTeam } from '@/lib/db/queries';

export async function GET(id: number) {
  const team = await getUserWithTeam();
  return Response.json(team);
}
