'use client';

import { useActionState } from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { updateAccount } from '@/app/(login)/actions';
import { User } from '@/lib/db/schema';
import useSWR from 'swr';
import { Suspense } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ActionState = {
  name?: string;
  jobTitle?: string;
  department?: string;
  phone?: string;
  address?: string;
  error?: string;
  success?: string;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
  jobTitleValue?: string;
  departmentValue?: string;
  phoneValue?: string;
  addressValue?: string;
  onEditableChange: (field: string, editable: boolean) => void;
  editableFields: Record<string, boolean>;
};

function AccountForm({
  state,
  nameValue = '',
  emailValue = '',
  jobTitleValue = '',
  departmentValue = '',
  phoneValue = '',
  addressValue = '',
  onEditableChange,
  editableFields
}: AccountFormProps) {
  const [localEditable, setLocalEditable] = useState<Record<string, boolean>>({
    jobTitle: false,
    department: false,
    phone: false,
    address: false
  });

  const toggleEditable = (field: string) => {
    setLocalEditable(prev => ({ ...prev, [field]: !prev[field] }));
    onEditableChange(field, !localEditable[field]);
  };
  return (
    <>
      <div>
        <Label htmlFor="name" className="mb-2">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          defaultValue={state.name || nameValue}
          required
          disabled
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-2">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          defaultValue={emailValue}
          required
          disabled
        />
      </div>
      {['jobTitle', 'department', 'phone', 'address'].map((field) => (
        <div key={field} className="flex gap-2 items-end">
          <div className="flex-1">
            <Label htmlFor={field} className="mb-2 capitalize">
              {field === 'phone' ? 'Phone Number' : field.replace(/([A-Z])/g, ' $1').trim()}
            </Label>
            <Input
              id={field}
              name={field}
              placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
              defaultValue={
                (state as any)[field] || 
                (field === 'jobTitle' ? jobTitleValue :
                field === 'department' ? departmentValue :
                field === 'phone' ? phoneValue : addressValue)
              }
              disabled={!localEditable[field]}
            />
          </div>
          <Button
            type={localEditable[field] ? "submit" : "button"}
            variant="outline"
            size="sm"
            onClick={() => {
              if (!localEditable[field]) {
                toggleEditable(field);
              }
            }}
            className="mb-[0.3rem]"
          >
            {localEditable[field] ? 'Save' : 'Edit'}
          </Button>
        </div>
      ))}
    </>
  );
}

function AccountFormWithData({ 
  state, 
  onEditableChange,
  editableFields 
}: { 
  state: ActionState;
  onEditableChange: (field: string, editable: boolean) => void;
  editableFields: Record<string, boolean>;
}) {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  return (
    <AccountForm
      state={state}
      onEditableChange={onEditableChange}
      editableFields={editableFields}
      nameValue={user?.name ?? ''}
      emailValue={user?.email ?? ''}
      jobTitleValue={user?.jobTitle ?? ''}
      departmentValue={user?.department ?? ''}
      phoneValue={user?.phone ?? ''}
      addressValue={user?.address ?? ''}
    />
  );
}

export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );
  const [editableFields, setEditableFields] = useState({
    jobTitle: false,
    department: false,
    phone: false,
    address: false
  });

  const handleEditableChange = (field: string, editable: boolean) => {
    setEditableFields(prev => ({ ...prev, [field]: editable }));
  };

  const hasEditableFields = Object.values(editableFields).some(Boolean);

  useEffect(() => {
    if (!isPending) {
      setEditableFields({
        jobTitle: false,
        department: false,
        phone: false,
        address: false
      });
    }
  }, [isPending]);

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
          <form className="space-y-4" action={formAction}>
            <Suspense fallback={<AccountForm state={state} onEditableChange={handleEditableChange} editableFields={editableFields} />}>
              <AccountFormWithData 
                state={state} 
                onEditableChange={handleEditableChange}
                editableFields={editableFields}
              />
            </Suspense>
            {state.error && (
              <p className="text-red-500 text-sm">{state.error}</p>
            )}
            {state.success && (
              <p className="text-green-500 text-sm">{state.success}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
