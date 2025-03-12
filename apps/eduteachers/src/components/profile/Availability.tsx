// src/components/profile/Availability.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { WeeklySchedule, TimeSlot, BookingRequest, TimeSlotStatus } from '@/types';
import { useAuth, UserRole } from '@repo/ui/contexts/AuthContext';
import { useTeachers } from '../../contexts';
import { formatTime } from '../../../../../packages/ui/src/methods';
import '../../styles/components/profile/availability.css';

interface AvailabilityProps {
    teacherId: string;
    availability: WeeklySchedule[];
    isEditable: boolean;
}

// Available time slots for adding new slots
const AVAILABLE_TIMES = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

// Day mapping for display
const DAY_NAMES: Record<string, string> = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday'
};

// Day types
type DayType = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
const ALL_DAYS: DayType[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

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

    // Editing state
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editedSlots, setEditedSlots] = useState<TimeSlot[]>([]);
    const [selectedDay, setSelectedDay] = useState<DayType | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<TimeSlotStatus>('available');

    // Booking form state
    const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [fullName, setFullName] = useState<string>(user?.name || '');
    const [email, setEmail] = useState<string>(user?.email || '');
    const [topic, setTopic] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    // UI state
    const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [editSuccess, setEditSuccess] = useState<boolean>(false);

    // Update current week when index or availability changes
    useEffect(() => {
        if (availability && availability.length > 0) {
            const week = availability[currentWeekIndex] || null;
            setCurrentWeek(week);

            if (week && isEditMode) {
                // Reset edited slots when week changes
                setEditedSlots([...week.slots]);
            }
        } else {
            setCurrentWeek(null);
        }
    }, [availability, currentWeekIndex, isEditMode]);

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

    // Handle entering edit mode
    const handleEnterEditMode = () => {
        if (currentWeek) {
            setEditedSlots([...currentWeek.slots]);
            setIsEditMode(true);
            setSelectedDay(null);
            setSelectedTime('');
            setEditSuccess(false);
            setError(null);
        }
    };

    // Handle exiting edit mode without saving
    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditedSlots([]);
        setSelectedDay(null);
        setSelectedTime('');
        setError(null);
    };

    // Get all unique times for the current slots
    const getAllTimes = useCallback(() => {
        if (!editedSlots || editedSlots.length === 0) return AVAILABLE_TIMES;

        const times = new Set<string>(AVAILABLE_TIMES);
        editedSlots.forEach(slot => times.add(slot.time));

        return Array.from(times).sort((a, b) => a.localeCompare(b));
    }, [editedSlots]);

    // Prepare slots by day
    const prepareSlotsByDay = useCallback((slots: TimeSlot[] = []) => {
        const slotsByDay: Record<string, TimeSlot[]> = {};

        ALL_DAYS.forEach(day => {
            slotsByDay[day] = [];
        });

        slots.forEach(slot => {
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
    }, []);

    // Get slot for a specific day and time
    const getSlotForDayAndTime = useCallback((slots: TimeSlot[], day: string, time: string): TimeSlot | undefined => {
        return slots.find(slot => slot.day === day && slot.time === time);
    }, []);

    // Handle slot click for booking
    const handleSlotClick = (slot: TimeSlot) => {
        if (isEditMode) {
            // In edit mode, clicking changes the slot status
            const updatedSlots = editedSlots.map(s => {
                if (s.id === slot.id) {
                    const newStatus: TimeSlotStatus =
                        s.status === 'available' ? 'unavailable' :
                            s.status === 'unavailable' ? 'available' :
                                s.status; // Keep booked status unchanged

                    return { ...s, status: newStatus };
                }
                return s;
            });
            setEditedSlots(updatedSlots);
        } else if (slot.status === 'available' && hasRole(UserRole.STUDENT)) {
            // In view mode, students can book available slots
            setSelectedSlot(slot);
            setShowBookingForm(true);
            setError(null);
        }
    };

    // Handle adding a new time slot
    const handleAddTimeSlot = () => {
        if (!selectedDay || !selectedTime || !currentWeek) return;

        // Check if slot already exists
        const existingSlot = getSlotForDayAndTime(editedSlots, selectedDay, selectedTime);
        if (existingSlot) {
            setError('This time slot already exists. Please edit it or choose a different time.');
            return;
        }

        // Create new slot
        const newSlot: TimeSlot = {
            id: `${teacherId}-${currentWeek.weekStartDate}-${selectedDay}-${selectedTime}`,
            day: selectedDay,
            time: selectedTime,
            status: selectedStatus
        };

        setEditedSlots([...editedSlots, newSlot]);
        setSelectedDay(null);
        setSelectedTime('');
        setError(null);
    };

    // Handle removing a time slot
    const handleRemoveTimeSlot = (slot: TimeSlot) => {
        // Only allow removing slots that aren't booked
        if (slot.status === 'booked') {
            setError('Cannot remove booked slots. Please contact support to resolve booking conflicts.');
            return;
        }

        setEditedSlots(editedSlots.filter(s => s.id !== slot.id));
    };

    // Handle saving availability changes
    const handleSaveAvailability = async () => {
        if (!currentWeek) return;

        setIsProcessing(true);
        setError(null);

        try {
            // In a real application, you would have an API endpoint to update the entire week's schedule
            // For now, we'll simulate success
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update successful
            setIsEditMode(false);
            setEditSuccess(true);

            // Hide success message after a delay
            setTimeout(() => {
                setEditSuccess(false);
            }, 5000);
        } catch (err) {
            console.error('Error saving availability:', err);
            setError('Failed to save availability changes. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle booking form submission
    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedSlot || !user?.id || !topic.trim()) {
            setError('Please fill in all required fields');
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
        const dayIndex = ALL_DAYS.indexOf(slot.day as DayType);
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + dayIndex);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    // Format slot info for display
    const formatSlotInfo = (slot: TimeSlot): string => {
        const date = getDateFromSlot(slot);
        return `${DAY_NAMES[slot.day]}, ${new Date(date).toLocaleDateString()} at ${formatTime(slot.time)}`;
    };

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
                        <button className="btn-primary" onClick={handleEnterEditMode}>
                            <i className="fas fa-plus"></i> Add Availability
                        </button>
                    </div>
                )}
            </section>
        );
    }

    // Prepare data for display
    const displaySlots = isEditMode ? editedSlots : currentWeek.slots;
    const slotsByDay = prepareSlotsByDay(displaySlots);
    const allTimes = getAllTimes();

    return (
        <section id="availability" className="profile-section">
            <div className="availability-section-header">
                <h2>Availability</h2>
                {isEditable && !isEditMode && (
                    <button
                        className="edit-btn"
                        onClick={handleEnterEditMode}
                        aria-label="Edit availability"
                    >
                        <i className="fas fa-edit"></i> Edit Availability
                    </button>
                )}
            </div>

            <p className="section-intro">
                {isEditMode ?
                    "Update your availability by clicking on time slots to toggle their status. You can also add new time slots." :
                    hasRole(UserRole.STUDENT) ?
                        "Select your preferred day and time slot to schedule a session." :
                        "View your availability schedule and upcoming bookings."
                }
            </p>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {editSuccess && (
                <div className="success-message">
                    <div className="success-icon"><i className="fas fa-check-circle"></i></div>
                    <h3>Availability Updated</h3>
                    <p>Your availability schedule has been successfully updated.</p>
                </div>
            )}

            <div className="calendar-container">
                <div className="week-selector">
                    <button
                        className="week-nav"
                        onClick={goToPreviousWeek}
                        disabled={currentWeekIndex === 0 || isProcessing || isEditMode}
                        aria-label="Previous week"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <span className="week-display">{formatWeekDisplay(currentWeek.weekStartDate)}</span>
                    <button
                        className="week-nav"
                        onClick={goToNextWeek}
                        disabled={currentWeekIndex === availability.length - 1 || isProcessing || isEditMode}
                        aria-label="Next week"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>

                {/* Editing controls */}
                {isEditMode && (
                    <div className="edit-controls">
                        <div className="add-slot-form">
                            <h3>Add Time Slot</h3>
                            <div className="add-slot-inputs">
                                <div className="form-group">
                                    <label htmlFor="day-select">Day</label>
                                    <select
                                        id="day-select"
                                        value={selectedDay || ''}
                                        onChange={(e) => setSelectedDay(e.target.value as DayType)}
                                        disabled={isProcessing}
                                    >
                                        <option value="">Select Day</option>
                                        {ALL_DAYS.map(day => (
                                            <option key={day} value={day}>{DAY_NAMES[day]}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="time-select">Time</label>
                                    <select
                                        id="time-select"
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        disabled={isProcessing}
                                    >
                                        <option value="">Select Time</option>
                                        {AVAILABLE_TIMES.map(time => (
                                            <option key={time} value={time}>{formatTime(time)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status-select">Status</label>
                                    <select
                                        id="status-select"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value as TimeSlotStatus)}
                                        disabled={isProcessing}
                                    >
                                        <option value="available">Available</option>
                                        <option value="unavailable">Unavailable</option>
                                    </select>
                                </div>

                                <button
                                    className="add-slot-btn"
                                    onClick={handleAddTimeSlot}
                                    disabled={!selectedDay || !selectedTime || isProcessing}
                                >
                                    <i className="fas fa-plus"></i> Add
                                </button>
                            </div>
                        </div>

                        <p className="edit-instructions">
                            <i className="fas fa-info-circle"></i> Click on slots to toggle between available and unavailable.
                            Booked slots cannot be modified.
                        </p>
                    </div>
                )}

                <div className="timetable">
                    <div className="time-headers">
                        <div className="day-header"></div> {/* Empty corner cell */}
                        {ALL_DAYS.map(day => (
                            <div
                                key={day}
                                className={`day-header ${day === 'sat' || day === 'sun' ? 'weekend' : ''}`}
                            >
                                {DAY_NAMES[day].substring(0, 3)}
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
                        {ALL_DAYS.map(day => (
                            <div
                                key={day}
                                className={`day-column ${day === 'sat' || day === 'sun' ? 'weekend' : ''}`}
                            >
                                {allTimes.map(time => {
                                    const slot = getSlotForDayAndTime(displaySlots, day, time);
                                    const slotExists = !!slot;

                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className={`slot ${slotExists ? slot.status : 'empty'} ${isEditMode ? 'editable' : ''}`}
                                            onClick={() => slot && handleSlotClick(slot)}
                                            title={
                                                !slotExists ? 'No time slot' :
                                                    slot.status === 'booked'
                                                        ? `Booked by ${slot.studentName || 'a student'}: ${slot.topic || 'No topic specified'}`
                                                        : slot.status === 'available'
                                                            ? isEditMode ? 'Click to make unavailable' : 'Available - Click to book'
                                                            : isEditMode ? 'Click to make available' : 'Unavailable'
                                            }
                                        >
                                            {slotExists && isEditMode && slot.status !== 'booked' && (
                                                <button
                                                    className="remove-slot-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveTimeSlot(slot);
                                                    }}
                                                    title="Remove time slot"
                                                    aria-label="Remove time slot"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            )}

                                            {slotExists && slot.status === 'booked' && (
                                                <div className="booked-info">
                                                    <span className="booked-student">{slot.studentName || 'Student'}</span>
                                                    {slot.topic && <span className="booked-topic">{slot.topic}</span>}
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
                    {isEditMode && (
                        <div className="legend-item">
                            <div className="legend-color empty"></div>
                            <span>No Slot</span>
                        </div>
                    )}
                </div>

                {/* Edit mode action buttons */}
                {isEditMode && (
                    <div className="edit-actions">
                        <button
                            className="btn-secondary"
                            onClick={handleCancelEdit}
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-primary"
                            onClick={handleSaveAvailability}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Saving...' : 'Save Availability'}
                        </button>
                    </div>
                )}

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