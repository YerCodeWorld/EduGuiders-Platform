// src/components/profile/Availability.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { WeeklySchedule, TimeSlot, BookingRequest } from '@/types';
import { useAuth, UserRole } from '@repo/ui/contexts/AuthContext';
import { useTeachers } from '../../contexts';
import { formatTime } from '../../../../../packages/ui/src/methods';
import '../../styles/components/profile/availability.css';

interface AvailabilityProps {
    teacherId: string;
    availability: WeeklySchedule[];
    isEditable: boolean;
}

const Availability: React.FC<AvailabilityProps> = ({
                                                       teacherId,
                                                       availability,
                                                       isEditable
                                                   }) => {
    const { user, hasRole } = useAuth();
    const { updateTimeSlot, createBooking } = useTeachers();

    // State for the current week being viewed
    const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);
    const [currentWeek, setCurrentWeek] = useState<WeeklySchedule | null>(null);

    // State for the booking form
    const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    // Form state
    const [fullName, setFullName] = useState<string>(user?.name || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [topic, setTopic] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    // Booking success message
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    // Update current week when index or availability changes
    useEffect(() => {
        if (availability && availability.length > 0) {
            setCurrentWeek(availability[currentWeekIndex] || null);
        } else {
            setCurrentWeek(null);
        }
    }, [availability, currentWeekIndex]);

    // Update form values when user changes
    useEffect(() => {
        if (user) {
            setFullName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    // Format the display date for the week
    const formatWeekDisplay = useCallback((dateString: string): string => {
        if (!dateString) return 'No availability';

        const startDate = new Date(dateString);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);

        const startMonth = startDate.toLocaleString('default', { month: 'long' });
        const endMonth = endDate.toLocaleString('default', { month: 'long' });

        const startDay = startDate.getDate();
        const endDay = endDate.getDate();

        if (startMonth === endMonth) {
            return `${startMonth} ${startDay} - ${endDay}, ${startDate.getFullYear()}`;
        } else {
            return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startDate.getFullYear()}`;
        }
    }, []);

    // Handle navigation between weeks
    const goToPreviousWeek = () => {
        if (currentWeekIndex > 0) {
            setCurrentWeekIndex(currentWeekIndex - 1);
        }
    };

    const goToNextWeek = () => {
        if (currentWeekIndex < availability.length - 1) {
            setCurrentWeekIndex(currentWeekIndex + 1);
        }
    };

    // Handle slot click for booking
    const handleSlotClick = (slot: TimeSlot) => {
        if (slot.status === 'available' && hasRole(UserRole.STUDENT)) {
            setSelectedSlot(slot);
            setShowBookingForm(true);
            setError(null);
        }
    };

    // Handle slot status change (for teachers)
    const handleSlotStatusChange = async (slot: TimeSlot, newStatus: 'available' | 'unavailable') => {
        if (!isEditable) return;

        setIsProcessing(true);
        setError(null);

        try {
            if (!currentWeek) throw new Error('No week data available');

            const success = await updateTimeSlot(
                teacherId,
                currentWeek.weekStartDate,
                slot.id,
                { status: newStatus }
            );

            if (!success) {
                setError('Failed to update slot status. Please try again.');
            }
        } catch (err) {
            console.error('Error updating slot status:', err);
            setError('An error occurred while updating slot status.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Validate booking form
    const validateBookingForm = (): boolean => {
        if (!fullName.trim()) {
            setError('Full name is required');
            return false;
        }

        if (!email.trim()) {
            setError('Email is required');
            return false;
        }

        if (!topic.trim()) {
            setError('Topic is required');
            return false;
        }

        return true;
    };

    // Handle booking form submission
    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateBookingForm() || !selectedSlot || !user?.id) {
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Create booking request
            const bookingRequest: BookingRequest = {
                teacherId,
                studentId: user.id,
                slotId: selectedSlot.id,
                date: getDateFromSlot(selectedSlot),
                time: selectedSlot.time,
                topic,
                notes: notes.trim() || undefined
            };

            const success = await createBooking(bookingRequest);

            if (success) {
                // Reset form and show success message
                setShowBookingForm(false);
                setSelectedSlot(null);
                setTopic('');
                setNotes('');
                setShowSuccessMessage(true);

                // Hide success message after 5 seconds
                setTimeout(() => {
                    setShowSuccessMessage(false);
                }, 5000);
            } else {
                setError('Failed to create booking. Please try again.');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            setError('An error occurred while creating the booking.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Helper to get the full date from a slot
    const getDateFromSlot = (slot: TimeSlot): string => {
        if (!currentWeek) return '';

        const weekStart = new Date(currentWeek.weekStartDate);
        const dayIndex = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(slot.day);
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayIndex);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    // Format slot info for display
    const formatSlotInfo = (slot: TimeSlot): string => {
        const dayNames: Record<string, string> = {
            mon: 'Monday',
            tue: 'Tuesday',
            wed: 'Wednesday',
            thu: 'Thursday',
            fri: 'Friday',
            sat: 'Saturday',
            sun: 'Sunday'
        };

        const date = getDateFromSlot(slot);
        return `${dayNames[slot.day]}, ${new Date(date).toLocaleDateString()} at ${formatTime(slot.time)}`;
    };

    // Prepare slots by day
    const prepareSlotsByDay = useCallback(() => {
        if (!currentWeek) return {};

        const slotsByDay: Record<string, TimeSlot[]> = {};

        currentWeek.slots.forEach(slot => {
            if (!slotsByDay[slot.day]) {
                slotsByDay[slot.day] = [];
            }
            slotsByDay[slot.day].push(slot);
        });

        // Sort slots by time in each day
        Object.keys(slotsByDay).forEach(day => {
            slotsByDay[day].sort((a, b) => {
                return a.time.localeCompare(b.time);
            });
        });

        return slotsByDay;
    }, [currentWeek]);

    // Get all unique times across all days
    const getAllTimes = useCallback(() => {
        if (!currentWeek) return [];

        return Array.from(new Set(currentWeek.slots.map(slot => slot.time)))
            .sort((a, b) => a.localeCompare(b));
    }, [currentWeek]);

    // Function to get slot for a specific day and time
    const getSlotForDayAndTime = useCallback((slotsByDay: Record<string, TimeSlot[]>, day: string, time: string): TimeSlot | undefined => {
        return slotsByDay[day]?.find(slot => slot.time === time);
    }, []);

    // Order of days for display
    const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    // If no availability data, show empty state
    if (!currentWeek) {
        return (
            <section id="availability" className="profile-section">
                <h2>Availability</h2>
                <p className="section-intro">
                    No availability information has been added yet.
                </p>
                {isEditable && (
                    <div className="empty-availability">
                        <button className="btn-primary">
                            <i className="fas fa-plus"></i> Add Availability
                        </button>
                    </div>
                )}
            </section>
        );
    }

    const slotsByDay = prepareSlotsByDay();
    const allTimes = getAllTimes();

    return (
        <section id="availability" className="profile-section">
            <h2>Availability</h2>
            <p className="section-intro">
                {hasRole(UserRole.STUDENT)
                    ? "Select your preferred day and time slot to schedule a session."
                    : "Manage your availability and view upcoming bookings."
                }
            </p>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="calendar-container">
                <div className="week-selector">
                    <button
                        className="week-nav"
                        onClick={goToPreviousWeek}
                        disabled={currentWeekIndex === 0 || isProcessing}
                        aria-label="Previous week"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="week-display">{formatWeekDisplay(currentWeek.weekStartDate)}</span>
                    <button
                        className="week-nav"
                        onClick={goToNextWeek}
                        disabled={currentWeekIndex === availability.length - 1 || isProcessing}
                        aria-label="Next week"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                <div className="timetable">
                    <div className="time-headers">
                        <div className="day-header"></div> {/* Empty corner cell */}
                        {dayOrder.map(day => (
                            <div
                                key={day}
                                className={`day-header ${day === 'sat' || day === 'sun' ? 'weekend' : ''}`}
                            >
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                            </div>
                        ))}
                    </div>

                    <div className="time-slots">
                        {/* Time labels column */}
                        <div className="time-labels">
                            {allTimes.map(time => (
                                <div key={time} className="time-label">
                                    {formatTime(time)}
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {dayOrder.map(day => (
                            <div
                                key={day}
                                className={`day-column ${day === 'sat' || day === 'sun' ? 'weekend' : ''}`}
                            >
                                {allTimes.map(time => {
                                    const slot = getSlotForDayAndTime(slotsByDay, day, time);
                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className={`slot ${slot?.status || 'unavailable'}`}
                                            onClick={() => slot && handleSlotClick(slot)}
                                            title={
                                                slot?.status === 'booked'
                                                    ? `Booked by ${slot.studentName || 'a student'}: ${slot.topic || 'No topic specified'}`
                                                    : slot?.status === 'available'
                                                        ? 'Available - Click to book'
                                                        : 'Unavailable'
                                            }
                                        >
                                            {isEditable && slot && (
                                                <div className="slot-controls">
                                                    {slot.status !== 'booked' && (
                                                        <>
                                                            <button
                                                                className={`status-toggle available ${slot.status === 'available' ? 'active' : ''}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSlotStatusChange(slot, 'available');
                                                                }}
                                                                title="Mark as available"
                                                                disabled={isProcessing}
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button
                                                                className={`status-toggle unavailable ${slot.status === 'unavailable' ? 'active' : ''}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSlotStatusChange(slot, 'unavailable');
                                                                }}
                                                                title="Mark as unavailable"
                                                                disabled={isProcessing}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    {slot.status === 'booked' && (
                                                        <div className="booked-info">
                                                            <span className="booked-student">{slot.studentName}</span>
                                                            <span className="booked-topic">{slot.topic}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="legend">
                    <div className="legend-item">
                        <div className="legend-color available"></div>
                        <span>Available</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color booked"></div>
                        <span>Booked</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color unavailable"></div>
                        <span>Unavailable</span>
                    </div>
                </div>

                {/* Booking Form */}
                {showBookingForm && selectedSlot && (
                    <div className="booking-form">
                        <h3>Book a Session</h3>
                        <p className="selected-slot-info">{formatSlotInfo(selectedSlot)}</p>

                        <form onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label htmlFor="full-name">Full Name</label>
                                <input
                                    type="text"
                                    id="full-name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    disabled={isProcessing}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isProcessing}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="topic">Topic</label>
                                <select
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    required
                                    disabled={isProcessing}
                                >
                                    <option value="">Select a topic</option>
                                    <option value="Algebra">Algebra</option>
                                    <option value="Calculus">Calculus</option>
                                    <option value="Statistics">Statistics</option>
                                    <option value="Geometry">Geometry</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Additional Notes (Optional)</label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    disabled={isProcessing}
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowBookingForm(false);
                                        setSelectedSlot(null);
                                        setError(null);
                                    }}
                                    disabled={isProcessing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Booking...' : 'Book Session'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Success message */}
                {showSuccessMessage && (
                    <div className="success-message">
                        <div className="success-icon"><i className="fas fa-check-circle"></i></div>
                        <h3>Booking Successful!</h3>
                        <p>Your session has been booked. Please check your email for confirmation.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Availability;