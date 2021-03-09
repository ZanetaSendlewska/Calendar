class Calendar {
    constructor() {
        this.now = new Date();
        this.day = this.now.getDate();
        this.month = this.now.getMonth();
        this.year = this.now.getFullYear();
        this.input = document.querySelector("#calendar");
        this.divCnt = null;
        this.divTable = null;
        this.divDateText = null;
        this.divButtons = null;
        this.availableMonthsCounter = 0;
        this.availableMonths = [new AvailableResarvations(new Date(this.year, this.month + 1, 0).getDate(), this.now.getMonth()),
        new AvailableResarvations(new Date(this.year, this.month + 2, 0).getDate(), this.now.getMonth() + 1),
        new AvailableResarvations(new Date(this.year, this.month + 3, 0).getDate(), this.now.getMonth() + 2)];
        this.targetDay = null;
    }

    addToLocalStorage(list) {
        localStorage.setItem("availableMonths", JSON.stringify(list));
    }

    getfromLocalStorage() {
        if ("availableMonths" in localStorage) {
            this.availableMonths = JSON.parse(localStorage.getItem("availableMonths"));
            return this.availableMonths;
        } else {
            return [new AvailableResarvations(new Date(this.year, this.month + 1, 0).getDate(), this.now.getMonth()),
            new AvailableResarvations(new Date(this.year, this.month + 2, 0).getDate(), this.now.getMonth() + 1),
            new AvailableResarvations(new Date(this.year, this.month + 3, 0).getDate(), this.now.getMonth() + 2)];
        }
    }

    createButtons() {
        const buttonPrev = document.createElement("button");
        buttonPrev.innerText = "<";
        buttonPrev.type = "button";
        buttonPrev.classList.add("input-prev");
        buttonPrev.addEventListener("click", e => {
            if (this.availableMonthsCounter > -1) {
                this.availableMonthsCounter--;
                this.month--;
                if (this.month < 0) {
                    this.month = 11;
                    this.year--;
                }
                this.createCalendarTable();
                this.createDateText();
            }
        });
        this.divButtons.appendChild(buttonPrev);

        const buttonNext = document.createElement("button");
        buttonNext.classList.add("input-next");
        buttonNext.innerText = ">";
        buttonNext.type = "button";
        buttonNext.addEventListener("click", e => {
            if (this.availableMonthsCounter < 2) {
                this.availableMonthsCounter++;
                this.month++;
                if (this.month > 11) {
                    this.month = 0;
                    this.year++;
                }
                this.createCalendarTable();
                this.createDateText();
            }
        });
        this.divButtons.appendChild(buttonNext);
    }

    createDateText() {
        const monthNames = ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"];
        this.divDateText.innerHTML = monthNames[this.month] + " " + this.year;
    }

    createCalendarTable() {
        this.divTable.innerHTML = "";

        const tab = document.createElement("table");
        tab.classList.add("calendar-table");

        let tr = document.createElement("tr");
        tr.classList.add("calendar-table-days-names");
        const days = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];
        days.forEach(day => {
            const th = document.createElement("th");
            th.innerHTML = day;
            tr.appendChild(th);
        });
        tab.appendChild(tr);

        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

        const tempDate = new Date(this.year, this.month, 1);
        let firstMonthDay = tempDate.getDay();
        if (firstMonthDay === 0) {
            firstMonthDay = 7;
        }

        const j = daysInMonth + firstMonthDay - 1;

        if (firstMonthDay - 1 !== 0) {
            tr = document.createElement("tr");
            tab.appendChild(tr);
        }

        for (let i = 0; i < firstMonthDay - 1; i++) {
            const td = document.createElement("td");
            td.innerHTML = "";
            tr.appendChild(td);
        }

        for (let i = firstMonthDay - 1; i < j; i++) {
            if (i % 7 === 0) {
                tr = document.createElement("tr");
                tab.appendChild(tr);
            }

            const td = document.createElement("td");
            td.innerText = i - firstMonthDay + 2;
            td.dayNr = i - firstMonthDay + 2;
            td.classList.add("day");

            if (this.year === this.now.getFullYear() && this.month === this.now.getMonth() && this.day === i - firstMonthDay + 2) {
                td.classList.add("current-day")
            }

            tr.appendChild(td);
        }

        tab.appendChild(tr);

        this.divTable.appendChild(tab);
    }

    bindTableDaysEvent() {
        this.divTable.addEventListener("click", e => {
            this.targetDay = e.target.dayNr;
            const targetDate = new Date();
            targetDate.setYear(this.year);
            targetDate.setMonth(this.month);
            targetDate.setUTCDate(e.target.dayNr);

            const currentDate = new Date();

            if (targetDate > currentDate && e.target.tagName.toLowerCase() === "td" && e.target.classList.contains("day")) {
                document.getElementById("message").innerHTML = ""
                document.getElementById("newReservation").style.display = ''
                document.getElementById("reservationLabel").innerHTML = "Dostępne terminy w dniu " + e.target.dayNr + "/" + (this.month + 1) + "/" + this.year;
                this.getAvailableHoursForSelectDay(e.target.dayNr)
            }
            else {
                this.hideReservationPanel();
                document.getElementById("message").innerHTML = "Rezerwacja niedostępna, dostępne dni rezerwacji są od kolejnego dnia od dzisiaj";
            }
        });
    }

    toggleShow() {
        this.divCnt.classList.toggle("calendar-show");
    }

    show() {
        this.divCnt.classList.add("calendar-show");
    }

    hide() {
        this.divCnt.classList.remove("calendar-show");
    }

    init() {
        this.divCnt = document.createElement("div");
        this.divCnt.classList.add("calendar");

        this.divButtons = document.createElement("div");
        this.divButtons.className = "calendar-prev-next";
        this.createButtons();

        this.divDateText = document.createElement("div");
        this.divDateText.className = "date-name";
        this.createDateText();

        this.divHeader = document.createElement("div");
        this.divHeader.classList.add("calendar-header");

        this.divHeader.appendChild(this.divButtons);
        this.divHeader.appendChild(this.divDateText);
        this.divCnt.appendChild(this.divHeader);

        this.divTable = document.createElement("div");
        this.divTable.className = "calendar-table-cnt";
        this.divCnt.appendChild(this.divTable);
        this.createCalendarTable();
        this.bindTableDaysEvent();

        this.calendarWrapper = document.createElement("div");
        this.calendarWrapper.classList.add("input-calendar-cnt");
        this.input.parentElement.insertBefore(this.calendarWrapper, this.input);
        this.calendarWrapper.appendChild(this.input);
        this.calendarWrapper.appendChild(this.divCnt);

        this.getfromLocalStorage()
    }

    getAvailableHoursForSelectDay(dayNumber) {
        let month = this.availableMonths[this.availableMonthsCounter];
        let hours = month.days[dayNumber].hours;

        let selectbox = document.getElementById("selectHours");
        selectbox.options.length = 0;
        if (hours.length === 0) {
            this.hideReservationPanel()
            alert("W wybranym dniu nie ma wolnych terminów na rezerwacje");
        }
        for (let index = 0; index < hours.length; index++) {
            selectbox.options.add(new Option(hours[index], hours[index], false))
        }
    }

    removeChosenHour(chosenHour) {
        let month = this.availableMonths[this.availableMonthsCounter];
        let hours = month.days[this.targetDay].hours;
        for (let index = 0; index < hours.length; index++) {
            if (chosenHour == hours[index]) {
                hours.splice(index, 1);
                this.addToLocalStorage(this.availableMonths);
            }

        }

    }

    getAvailableReservationsFromJson(json) {
        this.addToLocalStorage(JSON.parse(json));
    }

    returnAvailableReservationsInJson() {
        return JSON.stringify(this.getfromLocalStorage());
    }

    hideReservationPanel(){
        document.getElementById("newReservation").style.display = 'none'
    }
}

class AvailableResarvations {
    constructor(numberOfDays, month) {
        this.numberOfDays = numberOfDays;
        this.month = month
        this.days = []
        for (let i = 0; i < numberOfDays; i++) {
            var singleDay = {};
            singleDay['hours'] = ["10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00"]
            this.days.push(singleDay)
        }
    }
}