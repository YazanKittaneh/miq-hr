'use client';

import { useActionState, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { updateAccount } from '@/app/(login)/actions';
import useSWR from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  error?: string;
  success?: string;
};

function AccountForm({
  user,
  isEditing
}: {
  user?: User;
  isEditing: boolean;
}) {
  const fields = [
    { id: 'name', label: 'Name', value: user?.name, disabled: true },
    { id: 'email', label: 'Email', value: user?.email, disabled: true },
    { id: 'jobTitle', label: 'Job Title', value: user?.jobTitle },
    { id: 'department', label: 'Department', value: user?.department },
    { id: 'phone', label: 'Phone', value: user?.phone },
    { id: 'address', label: 'Address', value: user?.address }
  ];

  return (
    <>
      {fields.map((field) => (
        <div key={field.id} className="mb-4">
          <Label htmlFor={field.id} className="mb-2">
            {field.label}
          </Label>
          <Input
            id={field.id}
            name={field.id}
            placeholder={`Enter your ${field.label.toLowerCase()}`}
            defaultValue={field.value || ''}
            disabled={!isEditing || field.disabled}
          />
        </div>
      ))}
    </>
  );
}

export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formKey, setFormKey] = useState(0); // Add form version key
  const { data: user, isLoading, mutate } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (!isPending && state?.success) {
      setIsEditing(false);
      // Reset form state on success
      setFormKey(prev => prev + 1);
      mutate(state.user); // Update SWR cache with latest data
    }
  }, [isPending, state?.success, state?.user, mutate]);

  const handleEditClick = () => {
    setIsEditing(true);
    // Reset any previous success/error states
    setFormKey(prev => prev + 1);
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;

  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        General Settings
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form 
            key={formKey} // Add form version key
            className="space-y-4" 
            action={(formData) => {
              // Preserve read-only fields
              formData.set('name', user?.name || '');
              formData.set('email', user?.email || '');
              return formAction(formData);
            }}
          >
            <AccountForm user={user} isEditing={isEditing} />
            
            <div className="flex gap-2 justify-end pt-4">
              {isEditing ? (
                <Button 
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isPending}
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleEditClick} // Use new handler
                >
                  Edit Information
                </Button>
              )}
            </div>

            {state?.error && (
              <p className="text-red-500 text-sm mt-2">{state.error}</p>
            )}
            {state?.success && (
              <p className="text-green-500 text-sm mt-2">{state.success}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
