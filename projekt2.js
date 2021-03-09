const calendar = new Calendar();
calendar.init();

function submitReservation() {
    const fullName = document.getElementById("name").value;
    const chosenHour = document.getElementById("selectHours").value;
    if (isEmpty(fullName)) {
        alert("Imię i nazwisko musi być uzupełnione")
        return;
    }
    const targetDate = new Date();
        targetDate.setYear(calendar.year);
        targetDate.setMonth(calendar.month);
        targetDate.setUTCDate(calendar.targetDay);
    addReservation(fullName, chosenHour, targetDate);
    alert("Rezerwacja dodana!");
    calendar.removeChosenHour(chosenHour);
    
}
function isEmpty(str) {
    return !str.trim().length;
}