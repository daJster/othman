import { useState } from 'react';

import { EditableAvatar } from '@/components/ui/editable-avatar';
import {
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldContent,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { DeferredButton } from '@/components/ui/deferred-button';
import type { AccountData } from '@/firebase/auth/type';

export interface EditAccountDrawerRef {
    open: () => void
    close: () => void
}

interface FormData {
    displayName: string
    photoURL: string
}

interface EditAccountDrawerProps {
    account: AccountData
}

export const EditAccountDrawer = ({ account }: EditAccountDrawerProps) => {
    const [formData, setFormData] = useState<FormData>({
        displayName: account.displayName ?? '',
        photoURL: account.photoURL ?? '',
    });

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        console.log('Saving:', formData);
    };

    return (
        <DrawerContent className='mx-auto max-w-3xl'>
            <DrawerHeader>
                <DrawerTitle>Edit Profile</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 flex flex-col items-center overflow-hidden">
                <div className="w-40 h-40">
                    <EditableAvatar
                        src={formData.photoURL}
                        alt={formData.displayName}
                        onUpload={(url) => handleChange('photoURL', url)}
                    />
                </div>
                <FieldGroup className="mt-6 w-full max-w-sm">
                    <Field>
                        <FieldLabel htmlFor="displayName">
                            Full Name
                        </FieldLabel>
                        <FieldContent>
                            <Input
                                id="displayName"
                                value={formData.displayName}
                                onChange={(e) =>
                                    handleChange('displayName', e.target.value)
                                }
                                placeholder="Enter your full name"
                            />
                        </FieldContent>
                    </Field>
                </FieldGroup>
                <DrawerFooter className="flex flex-row p-0 justify-between items-center w-full mt-10">
                    <DrawerClose asChild>
                        <Button variant="outline" className='h-10'>Cancel</Button>
                    </DrawerClose>
                    <DeferredButton
                        asyncFn={handleSave}
                        className="flex items-center gap-2 h-10"
                    >
                        <span>Save</span>
                        <Save />
                    </DeferredButton>
                </DrawerFooter>
            </div>
        </DrawerContent>
    );
}