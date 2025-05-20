'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X } from 'lucide-react';
import { getTeamMembers, getUserRole } from '@/lib/db/queries';
import { useEffect, useState } from 'react';
import { User } from '@/lib/db/schema';

export default function TeamMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [membersData, role] = await Promise.all([
          getTeamMembers(),
          getUserRole()
        ]);
        setMembers(membersData);
        setUserRole(role);
      } catch (error) {
        console.error('Failed to load team members:', error);
      }
    };
    loadData();
  }, []);

  const isEditable = userRole === 'hr';

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Team Members
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Current Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                isEditable={isEditable}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function MemberRow({ member, isEditable }: { member: User; isEditable: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/team/members/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edits)
      });

      if (!response.ok) throw new Error('Update failed');
      
      setIsEditing(false);
      setEdits({});
      window.location.reload(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  };

  return (
    <div className="border-b pb-4 last:border-b-0">
      <div className="flex items-center justify-between gap-4">
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="col-span-2">
            <h3 className="font-medium">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.email}</p>
          </div>
          
          <EditableField
            label="Job Title"
            value={edits.jobTitle ?? member.jobTitle ?? 'N/A'}
            isEditing={isEditing}
            onChange={(v) => setEdits({ ...edits, jobTitle: v })}
          />
          
          <EditableField
            label="Department"
            value={edits.department ?? member.department ?? 'N/A'}
            isEditing={isEditing}
            onChange={(v) => setEdits({ ...edits, department: v })}
          />
          
          <EditableField
            label="Phone"
            value={edits.phone ?? member.phone ?? 'N/A'}
            isEditing={isEditing}
            onChange={(v) => setEdits({ ...edits, phone: v })}
          />
          
          <EditableField
            label="Address"
            value={edits.address ?? member.address ?? 'N/A'}
            isEditing={isEditing}
            onChange={(v) => setEdits({ ...edits, address: v })}
          />
        </div>

        {isEditable && (
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEdits({});
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}

function EditableField({
  label,
  value,
  isEditing,
  onChange
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-1 border rounded focus:ring-2 focus:ring-orange-500 text-sm"
        />
      ) : (
        <p className="text-sm">{value}</p>
      )}
    </div>
  );
}
