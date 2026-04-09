import { MapPin } from 'lucide-react';
import ProfileField from './ProfileField';
import { User } from '@/context/authContext';
import { Dispatch, SetStateAction } from 'react';

export default function HostelSection({ isEditing, data, setData }: { isEditing: boolean, data: User, setData: Dispatch<SetStateAction<User>> }) {
    return (
        <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                    <MapPin size={20} />
                </div>
                <h2 className="font-bold text-slate-800 text-lg">Hostel Info</h2>
            </div>

            <div className="flex flex-col gap-6">
                <ProfileField label="Block" value={data?.hostelBlock || ""} isEditing={isEditing} placeholder='Block Number/Name' change={(val) => setData(prev => ({ ...prev, hostelBlock: val }))} />
                <div className="grid grid-cols-2 gap-4">
                    <ProfileField label="Room" value={data?.roomNumber || ""} isEditing={isEditing} placeholder='Room number' change={(val) => setData(prev => ({ ...prev, roomNumber: val }))} />
                    <ProfileField label="Bed" value={data?.bedNumber || ""} isEditing={isEditing} placeholder='Bed number' change={(val) => setData(prev => ({ ...prev, bedNumber: val }))} />
                </div>
            </div>
        </section>
    );
}