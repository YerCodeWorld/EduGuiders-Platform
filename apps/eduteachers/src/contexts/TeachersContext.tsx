// src/contexts/TeachersContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Teacher, Booking, TimeSlot, BookingRequest } from '@/types';
import { mockTeachers, mockBookings } from '../data/mockData';

interface TeachersContextProps {
    teachers: Teacher[];
    getTeacher: (id: string) => Teacher | undefined;
    loading: boolean;
    updateTeacher: (teacher: Teacher) => void;
    createBooking: (bookingRequest: BookingRequest) => Promise<boolean>;
    updateTimeSlot: (teacherId: string, weekStartDate: string, slotId: string, updatedSlot: Partial<TimeSlot>) => void;
    getTeacherBookings: (teacherId: string) => Booking[];
    updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
}

const TeachersContext = createContext<TeachersContextProps | undefined>(undefined);

interface TeachersProviderProps {
    children: ReactNode;
}

export const TeachersProvider = ({ children }: TeachersProviderProps) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        // Simulate API call - in the future, this will call the real API
        setLoading(true);
        setTimeout(() => {
            setTeachers(mockTeachers);
            setBookings(mockBookings);
            setLoading(false);
        }, 500);
    }, []);

    // Get a specific teacher by ID
    const getTeacher = (id: string): Teacher | undefined => {
        return teachers.find(teacher => teacher.id === id);
    };

    // Update teacher information
    const updateTeacher = (updatedTeacher: Teacher) => {
        setTeachers(prevTeachers =>
            prevTeachers.map(teacher =>
                teacher.id === updatedTeacher.id ? updatedTeacher : teacher
            )
        );
    };

    // Create a new booking
    const createBooking = async (bookingRequest: BookingRequest): Promise<boolean> => {
        try {
            // In a real app, this would be an API call
            const newBooking: Booking = {
                id: `booking-${Date.now()}`,
                teacherId: bookingRequest.teacherId,
                studentId: bookingRequest.studentId,
                slotId: bookingRequest.slotId,
                status: 'pending',
                date: bookingRequest.date,
                time: bookingRequest.time,
                topic: bookingRequest.topic,
                notes: bookingRequest.notes,
                createDate: new Date().toISOString()
            };

            // Add to bookings
            setBookings(prev => [...prev, newBooking]);

            // Update the time slot status
            updateTimeSlot(
                bookingRequest.teacherId,
                // Extract week start date from slotId (assuming format: teacherId-weekStartDate-day-time)
                bookingRequest.slotId.split('-')[1],
                bookingRequest.slotId,
                { status: 'booked', studentId: bookingRequest.studentId }
            );

            return true;
        } catch (error) {
            console.error('Failed to create booking:', error);
            return false;
        }
    };

    // Update a time slot for a teacher
    const updateTimeSlot = (
        teacherId: string,
        weekStartDate: string,
        slotId: string,
        updatedSlot: Partial<TimeSlot>
    ) => {
        setTeachers(prevTeachers =>
            prevTeachers.map(teacher => {
                if (teacher.id !== teacherId) return teacher;

                const updatedAvailability = teacher.availability.map(week => {
                    if (week.weekStartDate !== weekStartDate) return week;

                    const updatedSlots = week.slots.map(slot =>
                        slot.id === slotId ? { ...slot, ...updatedSlot } : slot
                    );

                    return { ...week, slots: updatedSlots };
                });

                return { ...teacher, availability: updatedAvailability };
            })
        );
    };

    // Get all bookings for a specific teacher
    const getTeacherBookings = (teacherId: string): Booking[] => {
        return bookings.filter(booking => booking.teacherId === teacherId);
    };

    // Update booking status (confirm, reject, complete)
    const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
        setBookings(prevBookings =>
            prevBookings.map(booking => {
                if (booking.id !== bookingId) return booking;
                return { ...booking, status };
            })
        );
    };

    return (
        <TeachersContext.Provider
            value={{
                teachers,
                getTeacher,
                loading,
                updateTeacher,
                createBooking,
                updateTimeSlot,
                getTeacherBookings,
                updateBookingStatus
            }}
        >
            {children}
        </TeachersContext.Provider>
    );
};

export const useTeachers = () => {
    const context = useContext(TeachersContext);
    if (context === undefined) {
        throw new Error('useTeachers must be used within a TeachersProvider');
    }
    return context;
};