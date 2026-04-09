import { HeartPulse } from 'lucide-react';
import ProfileField from './ProfileField';
import { User } from '@/context/authContext';
import { Dispatch, SetStateAction } from 'react';

export default function EmergencySection({ isEditing, data, setData }: { isEditing: boolean, data: User, setData: Dispatch<SetStateAction<User>> }) {
    return (
        <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                    <HeartPulse size={20} />
                </div>
                <h2 className="font-bold text-slate-800 text-lg">Emergency Contact</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <ProfileField label="Guardian Name" value={data?.emergencyContact?.name || ""} isEditing={isEditing} placeholder='Guradinan Name' change={(val) => {
                    setData((prev) => ({
                        ...prev,
                        emergencyContact: {
                            relationship: "",
                            phone: "",
                            ...prev.emergencyContact,
                            name: val,
                        },
                    }))
                }} />
                <ProfileField label="Relationship" value={data?.emergencyContact?.relationship || ""} isEditing={isEditing} placeholder='Guardian Relation' change={(val) => {
                    setData((prev) => ({
                        ...prev,
                        emergencyContact: {
                            name: "",
                            phone: "",
                            ...prev.emergencyContact,
                            relationship: val,
                        },
                    }))
                }} />
                <ProfileField label="Emergency Phone" value={data?.emergencyContact?.phone || ""} isEditing={isEditing} placeholder='Guardians Phone No.' change={(val) => {
                    setData((prev) => ({
                        ...prev,
                        emergencyContact: {
                            name: "",
                            relationship: "",
                            ...prev.emergencyContact,
                            phone: val,
                        },
                    }))
                }}/>
            </div>
        </section>
    );
}