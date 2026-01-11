export const checkConflicts = (newExam, allExams) => {
    if (!newExam.date || !newExam.startTime || !newExam.endTime) return [];

    return allExams.filter(existing => {
        // Skip self if editing
        if (newExam.id && existing.id === newExam.id) return false;

        // 1. Date Check
        if (existing.date !== newExam.date) return false;

        // Time Overlap Logic
        // (StartA < EndB) and (EndA > StartB)
        const timeOverlap = (
            newExam.startTime < existing.endTime &&
            newExam.endTime > existing.startTime
        );

        if (!timeOverlap) return false;

        // 2. Venue Conflict Check
        // If times overlap AND venues are the same -> Conflict
        if (newExam.venue && existing.venue &&
            newExam.venue.trim().toLowerCase() === existing.venue.trim().toLowerCase()) {
            return true;
        }

        // 3. Optional: Logic for "Same Course, Same Time" (avoid scheduling two exams for same course at same time?)
        // This wasn't explicitly requested but is good practice. 
        // We will stick to the requested check: Time Conflict OR Venue Conflict.

        // If we are here, dates match and times overlap.
        // If venue is DIFFERENT, is it a conflict? 
        // The prompt says: "Time Conflict" AND "Venue Conflict".
        // Usually, two exams CAN happen at the same time in different venues.
        // BUT, a venue cannot have two exams.
        // AND, a student batch (Semester) cannot have two exams at once. (This is implied "Time Conflict")

        // Let's check Semester Conflict as well (implied Batch conflict)
        if (newExam.semester && existing.semester && newExam.semester === existing.semester) {
            return true;
        }

        return false;
    });
};

export const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
};
