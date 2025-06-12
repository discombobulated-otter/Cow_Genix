import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, X, CheckCircle2 } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';

const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
];

const AppointmentBooking = ({ vet, onClose, onBook }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock function to check availability
    const isTimeSlotAvailable = (time) => {
        // In a real app, this would check against the vet's actual schedule
        return Math.random() > 0.3; // 70% chance of being available
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime || !reason) return;

        setIsSubmitting(true);
        try {
            // In a real app, this would make an API call to book the appointment
            await new Promise(resolve => setTimeout(resolve, 1000));
            onBook({
                vetId: vet._id,
                date: selectedDate,
                time: selectedTime,
                reason
            });
        } catch (error) {
            console.error('Error booking appointment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Book Appointment</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <img
                                src={vet.avatar || 'https://ui-avatars.com/api/?name=' + vet.name}
                                alt={vet.name}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <h3 className="font-semibold text-gray-900">{vet.name}</h3>
                                <p className="text-sm text-gray-600">{vet.specialization}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Date Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date
                                </label>
                                <div className="relative">
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={date => {
                                            setSelectedDate(date);
                                            setSelectedTime(null);
                                        }}
                                        minDate={new Date()}
                                        maxDate={addDays(new Date(), 30)}
                                        dateFormat="MMMM d, yyyy"
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    />
                                    <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Time
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {timeSlots.map(time => {
                                        const isAvailable = isTimeSlotAvailable(time);
                                        return (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => setSelectedTime(time)}
                                                disabled={!isAvailable}
                                                className={`p-2 text-sm rounded-md border ${
                                                    selectedTime === time
                                                        ? 'bg-green-600 text-white border-green-600'
                                                        : isAvailable
                                                        ? 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                                                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Reason for Visit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason for Visit
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    placeholder="Please describe the reason for your visit..."
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedDate || !selectedTime || !reason || isSubmitting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Booking...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 mr-2" />
                                            Book Appointment
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking; 