class Reservation{
    constructor(fullName, chosenHour, date){
        this.fullName=fullName;
        this.chosenHour=chosenHour;
        this.date=date;
    }
}

function addReservation(fullName, chosenHour, date) {
    const reservation=new Reservation(fullName, chosenHour, new Date(date));
    let reservationList = getfromLocalStorage();

    reservationList.push(reservation);
    addToLocalStorage(reservationList);
}

function addToLocalStorage(list) {
    localStorage.setItem("reservationList", JSON.stringify(list));
}

function getfromLocalStorage() {
    if ("reservationList" in localStorage) {
        return JSON.parse(localStorage.getItem("reservationList"));
    } else {
        return new Array();
    }
}
