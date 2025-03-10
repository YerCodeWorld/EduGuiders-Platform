// src/contexts/TeachersContext.tsx
// get em react hooks
import {createContext, useContext, useState, ReactNode, useEffect, useCallback} from 'react';

// our beautiful types
import {
    Teacher,
    Booking,
    TimeSlot,
    BookingRequest,
    Post,
    // TeachingStyle,
    // PersonalRules
} from '@/types';
// yeah mockdata bro. Wondering if I will use them in production for marketing purposes
import { mockTeachers, mockBookings } from '../data/mockData';

// export type TeachersError = ...
// This above for when we implement errors logic

type ValidationResult = {
    valid: boolean;
    // errors?: string[];
}


// So, to efficiently create a context we need all the available teachers, a function to get one in specific,
// normal architecture stuff like loading variable, functions for updating a teacher in case of editing, etc.
// Among the etc you have creating a booking function and derivative stuff.
interface TeachersContextProps {
    teachers: Teacher[];
    getTeacher: (id: string) => Teacher | undefined;
    loading: boolean;
    // error: string | null;
    updateTeacher: (teacher: Teacher) => Promise<boolean>;
    // Can someone even start to explain to me what on earth is this witchcraft below? Chronics of a newbie
    updateTeacherSection: <K extends keyof Teacher>(teacherId: string, sectionName: K, sectionData: Teacher[K]) => Promise<boolean>;
    createBooking: (bookingRequest: BookingRequest) => Promise<boolean>;
    updateTimeSlot: (teacherId: string, weekStartDate: string, slotId: string, updatedSlot: Partial<TimeSlot>) => Promise<boolean>;
    getTeacherBookings: (teacherId: string) => Booking[];
    updateBookingStatus: (bookingId: string, status: Booking['status']) => Promise<boolean>;

    createPost: (teacherId: string, post: Omit<Post, 'id'>) => Promise<boolean>;
    updatePost: (teacherId: string, postId: string, updatedPost: Partial<Post>) => Promise<boolean>;
    deletePost: (teacherId: string, postId: string) => Promise<boolean>;

    // New teaching style and personal rules methods
}

const TeachersContext = createContext<TeachersContextProps | undefined>(undefined);

// Remember this is what allows us to properly use it in a TSX file.
interface TeachersProviderProps {
    children: ReactNode;
}

export const TeachersProvider = ({ children }: TeachersProviderProps) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<Error | null>(null);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // setError(null);

                // This will call our backend when we finally decide to make it
                await new Promise(resolve => setTimeout(resolve, 500));

                setTeachers(mockTeachers);
                setBookings(mockBookings);
            } catch (err) {
                // setError("Failed to load teacher data, sorry for that.")
                console.log('Error handling teachers data', err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // Let's get our teachers
    const getTeacher = useCallback((id: string): Teacher | undefined => {
        // find is a function here. cool
        return teachers.find(teacher => teacher.id === id);
    }, [teachers]);

    // Hmmm let's validate our data before updating
    const validateTeacher = (teacher: Teacher): ValidationResult => {
        const errors: string[] = [];

        if (!teacher.id) errors.push('Teacher ID is required');
        if (!teacher.name) errors.push('Teacher name is required');
        if (!teacher.title) errors.push('Teacher title is required');

        if (!teacher.bio?.introduction || teacher.bio.introduction.length === 0) {
            errors.push('Teacher biography is required');
        }

        if (!teacher.availability) {
            errors.push('Teacher availability is required');
        }

        // We must add a better system for error handling, there are too many edge cases
        // in here

        return {
          valid: errors.length === 0,
          errors: errors.length > 0 ? errors : undefined
        };
    };

    // Now we enter the CRUD Operations hell with error handling.

    // Now this is important for the editing stuff. We need to update the teacher
    // Let's keep doing async stuff despite still not having a real BackEnd.
    const updateTeacher = async (updatedTeacher: Teacher): Promise<boolean> => {
        try {
            const validationResult = validateTeacher(updatedTeacher);

            if (!validationResult.valid) {
                // setError(`Invalid teacher data: $(validateResult.errors?.join(', ')}`);
                return false;
            }

            // again, this is just a simulation
            await new Promise(resolve => setTimeout(resolve, 300));

            setTeachers(prevTeachers =>
                prevTeachers.map(teacher =>
                teacher.id === updatedTeacher.id ? updatedTeacher : teacher
                )
            )

            return true;
        } catch (err) {
            // setError('Failed to update teacher. Please try again.');
            console.error('Update teacher error:', err);
            return false;
        }
    }

    // Specific section

    const updateTeacherSection = async <K extends keyof Teacher>(
        teacherId: string,
        sectionName: K,
        sectionData: Teacher[K]
    ): Promise<boolean> => {

        try {
            /**
             * This commented out below was the previous state that was working fine
             * I changed this in order to fix issues with editing header stuff.
             * As doing this was discouraged, I'll keep the old version just in case.
             *
            const teacher = getTeacher(teacherId);

            if (!teacher) {
                // setError('Teacher not found...')
                return false;
            }

            // Updated teacher
            const updatedTeacher = {
                ...teacher,
                [sectionName]: sectionData,
            }

            // more simulations
            return await updateTeacher(updatedTeacher)
        } catch (err) {
            // setError(`Failed to update ${String(sectionName)}. Please try again.`);
            console.error(`Update ${String(sectionName)} error:`, err);
            return false;
        }
            */

            const teacher = getTeacher(teacherId);

            if (!teacher) {
                // setError('Teacher not found');
                return false;
            }

            let updatedTeacher: Teacher;

            // Special case for headerInfo
            if (sectionName === 'headerInfo') {
                // Type assertion to access the properties
                const headerData = sectionData as unknown as {
                    name: string;
                    title: string;
                    profilePicture: string;
                    landscapePicture: string;
                };

                updatedTeacher = {
                    ...teacher,
                    name: headerData.name,
                    title: headerData.title,
                    profilePicture: headerData.profilePicture,
                    landscapePicture: headerData.landscapePicture
                };
            } else {
                // Normal case for other sections
                updatedTeacher = {
                    ...teacher,
                    [sectionName]: sectionData
                };
            }

            return await updateTeacher(updatedTeacher);
        } catch (err) {
            // setError(`Failed to update ${String(sectionName)}. Please try again.`);
            console.error(`Update ${String(sectionName)} error:`, err);
            return false;
        }


    };

    // Create new booking logic
    const createBooking = async (bookingRequest: BookingRequest): Promise<boolean> => {
        try {

            // validating booking request
            if (!bookingRequest.teacherId || !bookingRequest.studentId|| !bookingRequest.slotId) {
                // setError('Invalid booking request...');
                console.log('There was an error, invalid booking request');
                return false;
            }

            // Now, the teacher exists?
            const teacher = getTeacher(bookingRequest.teacherId);
            if (!teacher) {
                // setError('Teacher requested does not exist');
                console.log('Teacher requested does not exist');
                return false;
            }

            // Does anybody else hate all these error cases ? I mean not the errors, but having to write
            // all the logic for them

            await new Promise(resolve => setTimeout(resolve, 300));

            const newBooking: Booking = {
                // look at this beauty, adding the date to the id
                id: `booking-${Date.now}`,
                teacherId: bookingRequest.teacherId,
                studentId: bookingRequest.studentId,
                slotId: bookingRequest.slotId,
                status: 'pending',
                date: bookingRequest.date,
                time: bookingRequest.time,
                topic: bookingRequest.topic,
                notes: bookingRequest.notes,
                createDate: new Date().toISOString()
            }

            setBookings(prev => [...prev, newBooking]);

            // The time slots need to be updated too
            await updateTimeSlot(
                bookingRequest.teacherId,
                bookingRequest.slotId.split('-')[1],
                // I just love the following syntax bro
                bookingRequest.studentId,
                { status: 'booked', studentId: bookingRequest.studentId }
            )

            return true;

        } catch (err) {
            // setError('Could not create proper booking...');
            console.log('Error trying to book a class', err);
            return false;
        }
    };

    const updateTimeSlot = async (
        teacherId: string,
        weekStartDate: string,
        slotId: string,
        updatedSlot: Partial<TimeSlot>
    ): Promise<boolean> => {

        try {

            if (!teacherId || !weekStartDate || !slotId) {
                // setError('Invalid time slot update: Missing required fields');
                return false;
            }

            await new Promise(resolve => setTimeout(resolve, 300));

            setTeachers(prevTeachers =>
                prevTeachers.map(teacher => {
                    if (teacher.id !== teacherId) return teacher;

                    const updatedAvailability = teacher.availability.map(week => {

                        if (week.weekStartDate !== weekStartDate) return week;

                        const updatedSlots = week.slots.map(slot => {
                            slot.id === slotId ? {...slot, ...updatedSlot} : slot
                        });

                        return {...week, slots: updatedSlots};
                    });


                    return {...teacher, slots: updatedAvailability};
                })
            );

            return true;
        } catch (err) {
            // setError('Failed to update time slot. Please try again.');
            console.error('Failed to update time slot:', err);
            return false;
        }

    };

    // Get all bookings for a specific teacher
    const getTeacherBookings = (teacherId: string): Booking[] => {
        return bookings.filter(booking => booking.teacherId === teacherId);
    };

    // Update booking status (confirm, reject, complete)
    const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<boolean> => {
        try {
            // Validate inputs
            if (!bookingId || !status) {
                // setError('Invalid booking status update: Missing required fields');
                return false;
            }

            await new Promise(resolve => setTimeout(resolve, 200));

            setBookings(prevBookings =>
                prevBookings.map(booking => {
                    if (booking.id !== bookingId) return booking;
                    return { ...booking, status };
                })
            );

            return true;
        } catch (error) {
            console.error('Failed to update booking status:', error);
            // setError('Failed to update booking status. Please try again.');
            return false;
        }
    };

    // Create a new post for a teacher
    const createPost = async (teacherId: string, post: Omit<Post, 'id'>): Promise<boolean> => {
        try {
            // Validate inputs
            if (!teacherId || !post.title || !post.content || !post.type) {
                // setError('Invalid post data: Missing required fields');
                return false;
            }

            const teacher = getTeacher(teacherId);
            if (!teacher) {
                // setError('Teacher not found');
                return false;
            }

            await new Promise(resolve => setTimeout(resolve, 300));

            // Create new post with a unique ID
            const newPost: Post = {
                id: `post-${Date.now()}`,
                ...post,
                date: post.date || new Date().toISOString()
            };

            // Update the teacher's posts
            const updatedTeacher = {
                ...teacher,
                posts: [...teacher.posts, newPost]
            };

            return await updateTeacher(updatedTeacher);
        } catch (error) {
            console.error('Failed to create post:', error);
            // setError('Failed to create post. Please try again.');
            return false;
        }
    };

    const updatePost = async (teacherId: string, postId: string, updatedPost: Partial<Post>): Promise<boolean> => {
        try {
            // Validate inputs
            if (!teacherId || !postId) {
                // setError('Invalid post update: Missing required fields');
                return false;
            }

            const teacher = getTeacher(teacherId);
            if (!teacher) {
                // setError('Teacher not found');
                return false;
            }

            // Find the post to update
            const postIndex = teacher.posts.findIndex(post => post.id === postId);
            if (postIndex === -1) {
                // setError('Post not found');
                return false;
            }

            // In a real app, this would be an API call
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            // Update the post
            const updatedPosts = [...teacher.posts];
            updatedPosts[postIndex] = {
                ...updatedPosts[postIndex],
                ...updatedPost
            };

            // Update the teacher with the updated posts
            const updatedTeacher = {
                ...teacher,
                posts: updatedPosts
            };

            return await updateTeacher(updatedTeacher);
        } catch (error) {
            console.error('Failed to update post:', error);
            // setError('Failed to update post. Please try again.');
            return false;
        }
    };

    // Delete a post
    const deletePost = async (teacherId: string, postId: string): Promise<boolean> => {
        try {
            // Validate inputs
            if (!teacherId || !postId) {
                // setError('Invalid post deletion: Missing required fields');
                return false;
            }

            const teacher = getTeacher(teacherId);
            if (!teacher) {
                // setError('Teacher not found');
                return false;
            }

            await new Promise(resolve => setTimeout(resolve, 300));

            // Filter out the post to delete
            const updatedPosts = teacher.posts.filter(post => post.id !== postId);

            // Update the teacher with the updated posts
            const updatedTeacher = {
                ...teacher,
                posts: updatedPosts
            };

            return await updateTeacher(updatedTeacher);
        } catch (error) {
            console.error('Failed to delete post:', error);
            // setError('Failed to delete post. Please try again.');
            return false;
        }
    };

    // Update teaching style logic

    // Update Personal rules logic

    return (
        <TeachersContext.Provider
            value={{
                teachers,
                getTeacher,
                loading,
                // error
                updateTeacher,
                updateTeacherSection,
                createBooking,
                updateTimeSlot,
                getTeacherBookings,
                updateBookingStatus,
                createPost,
                updatePost,
                deletePost
                // updateTeachingStyle
                // updatePersonalRules
            }}
        >
            {children}
        </TeachersContext.Provider>
    );
};

export const useTeachers = () => {
    const context = useContext(TeachersContext);
    if (context === undefined) {
        throw new Error("useTeachers must be used within TeachersProvider");
    }
    return context;
};


