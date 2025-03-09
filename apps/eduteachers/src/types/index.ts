// src/types/index.ts
// These types are adapted to be compatible with EduGuiders' data structures

export type TimeSlotStatus = 'available' | 'booked' | 'unavailable';

export interface TimeSlot {
    id: string;
    day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
    time: string; // Format: HH:MM (24-hour)
    status: TimeSlotStatus;
    studentId?: string; // If booked, which student booked it
    studentName?: string; // Student name if booked
    bookingDate?: string; // When it was booked
    topic?: string; // Topic of the session
}

export interface WeeklySchedule {
    weekStartDate: string; // ISO date string
    slots: TimeSlot[];
}

export interface ExpertiseArea {
    icon: string;
    name: string;
}

export interface Education {
    id: string;
    years: string;
    degree: string;
    institution: string;
    highlight?: string;
}

export interface Experience {
    id: string;
    years: string;
    position: string;
    company: string;
    achievements: string[];
}

export interface Certification {
    id: string;
    year: string;
    name: string;
    issuer: string;
}

export interface ContactInfo {
    email: string;
    videoCallAvailable: boolean;
    chatAvailable: boolean;
    phone?: string;
    website?: string;
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        instagram?: string;
    };
}

export type PostType = 'video' | 'article';

export interface Post {
    id: string;
    title: string;
    snippet: string;
    content?: string;
    image: string;
    date: string;
    type: PostType;
    link: string;
}

export interface Bio {
    introduction: string[];
    quote?: string;
    expertiseAreas: ExpertiseArea[];
    teacherId?: string;
}

export interface CV {
    education: Education[];
    experience: Experience[];
    certifications: Certification[];
    skills?: string[];
    languages?: string[];
}

export interface Teacher {
    id: string;
    name: string;
    title: string;
    profilePicture: string;
    landscapePicture: string;
    bio: Bio;
    cv: CV;
    contact: ContactInfo;
    availability: WeeklySchedule[];
    posts: Post[];
    rating?: number;
    reviewCount?: number;
}

export interface Booking {
    id: string;
    teacherId: string;
    studentId: string;
    slotId: string;
    status: 'pending' | 'confirmed' | 'rejected' | 'completed';
    date: string;
    time: string;
    topic: string;
    notes?: string;
    createDate: string;
}

export interface BookingRequest {
    teacherId: string;
    studentId: string;
    slotId: string;
    date: string;
    time: string;
    topic: string;
    notes?: string;
}