import { GraduationCap } from 'lucide-react';
import ProfileField from './ProfileField';
import { User } from '@/context/authContext';
import { Dispatch, SetStateAction } from 'react';

export default function AcademicSection({ isEditing, data, setData }: { isEditing: boolean, data: User, setData: Dispatch<SetStateAction<User>> }) {
    return (
        <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 space-y-8">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                    <GraduationCap size={20} />
                </div>
                <h2 className="font-bold text-slate-800 text-lg">Academic Info</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <ProfileField label="Registration No." value={data?.registrationNumber || ""} isEditing={isEditing} placeholder='Registeration/Roll No.' change={(val)=> setData(prev => ({...prev, registrationNumber: val}))}/>
                <ProfileField label="Department" value={data?.department || ""} isEditing={isEditing} placeholder='Department' change={(val)=> setData(prev => ({...prev, department: val}))} />
                <ProfileField label="Academic Year" value={data?.academicYear || ""} isEditing={isEditing} placeholder='Accedmic year (eg: 2023-2026)' change={(val)=> setData(prev => ({...prev, academicYear: val}))}/>
            </div>
        </section>
    );
}