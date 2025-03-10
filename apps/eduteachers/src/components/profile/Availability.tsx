// src/components/profile/Availability.tsx
import React, { useState, useEffect } from 'react';
import { WeeklySchedule, TimeSlot, BookingRequest } from '@/types';
import { useAuth, UserRole } from '@repo/ui/contexts/AuthContext';
import { useTeachers } from '../../contexts';
import { formatTime } from '../../../../../packages/ui/src/methods.ts';
import '../../styles/components/profile/availability.css';

interface AvailabilityProps {
    teacherId: string;
    availability: WeeklySchedule[];
    isEditable: boolean | undefined;
}

const Availability: React.FC<AvailabilityProps> = ({
                                                       teacherId,
                                                       availability,
                                                       isEditable
                                                   }) => {
    const { user, hasRole } = useAuth();
    const { updateTimeSlot, createBooking } = useTeachers();

    // State for the current week being viewed
    const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
    const currentWeek = availability[currentWeekIndex] || { weekStartDate: '', slots: [] };

    // State for the booking form
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    // Form state
    const [fullName, setFullName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [topic, setTopic] = useState('');
    const [notes, setNotes] = useState('');

    // Booking success message
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Update form values when user changes
    useEffect(() => {
        if (user) {
            setFullName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    // Format the display date for the week
    const formatWeekDisplay = (dateString: string) => {
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
    };

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
        }
    };

    // Handle slot status change (for teachers)
    const handleSlotStatusChange = (slot: TimeSlot, newStatus: 'available' | 'unavailable') => {
        if (isEditable) {
            updateTimeSlot(
                teacherId,
                currentWeek.weekStartDate,
                slot.id,
                { status: newStatus }
            );
        }
    };

    // Handle booking form submission
    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSlot || !user?.id) return;

        // Create booking request
        const bookingRequest: BookingRequest = {
            teacherId,
            studentId: user.id,
            slotId: selectedSlot.id,
            date: getDateFromSlot(selectedSlot),
            time: selectedSlot.time,
            topic,
            notes
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
        }
    };

    // Helper to get the full date from a slot
    const getDateFromSlot = (slot: TimeSlot): string => {
        const weekStart = new Date(currentWeek.weekStartDate);
        const dayIndex = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(slot.day);
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayIndex);
        // @ts-ignore
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    // Format slot info for display
    const formatSlotInfo = (slot: TimeSlot): string => {
        const dayNames = {
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

    // Group slots by day
    const slotsByDay: Record<string, TimeSlot[]> = {};
    currentWeek.slots.forEach(slot => {
        if (!slotsByDay[slot.day]) {
            slotsByDay[slot.day] = [];
        }
        // @ts-ignore
        slotsByDay[slot.day].push(slot);
    });

    // Sort slots by time
    Object.keys(slotsByDay).forEach(day => {
        // @ts-ignore
        slotsByDay[day].sort((a, b) => {
            return a.time.localeCompare(b.time);
        });
    });

    // Get all unique times across all days
    const allTimes = Array.from(new Set(currentWeek.slots.map(slot => slot.time)))
        .sort((a, b) => a.localeCompare(b));

    // Function to get slot for a specific day and time
    const getSlotForDayAndTime = (day: string, time: string): TimeSlot | undefined => {
        return slotsByDay[day]?.find(slot => slot.time === time);
    };

    // Order of days for display
    const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

    return (
        <section id="availability" className="profile-section">
            <h2>Availability</h2>
            <p className="section-intro">
                {hasRole(UserRole.STUDENT)
                    ? "Select your preferred day and time slot to schedule a session."
                    : "Manage your availability and view upcoming bookings."
                }
            </p>

            <div className="calendar-container">
                <div className="week-selector">
                    <button
                        id="prev-week"
                        className="week-nav"
                        onClick={goToPreviousWeek}
                        disabled={currentWeekIndex === 0}
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span id="week-display">{formatWeekDisplay(currentWeek.weekStartDate)}</span>
                    <button
                        id="next-week"
                        className="week-nav"
                        onClick={goToNextWeek}
                        disabled={currentWeekIndex === availability.length - 1}
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
                                    const slot = getSlotForDayAndTime(day, time);
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
                    <div id="booking-form" className="booking-form">
                        <h3>Book a Session</h3>
                        <p id="selected-slot-info">{formatSlotInfo(selectedSlot)}</p>

                        <form id="book-session-form" onSubmit={handleBookingSubmit}>
                            <div className="form-group">
                                <label htmlFor="full-name">Full Name</label>
                                <input
                                    type="text"
                                    id="full-name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
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
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="topic">Topic</label>
                                <select
                                    id="topic"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    required
                                >
                                    <option value="">Select a topic</option>
                                    <option value="algebra">Algebra</option>
                                    <option value="calculus">Calculus</option>
                                    <option value="statistics">Statistics</option>
                                    <option value="geometry">Geometry</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Additional Notes (Optional)</label>
                                <textarea
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                ></textarea>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    id="cancel-booking"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowBookingForm(false);
                                        setSelectedSlot(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">Book Session</button>
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