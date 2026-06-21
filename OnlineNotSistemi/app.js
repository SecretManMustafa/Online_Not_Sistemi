// LocalStorage keyleri
const GRADES_KEY = "grades";
const SCHEDULE_KEY = "schedule";

// Öğrenci ve not listesi
let grades = JSON.parse(localStorage.getItem(GRADES_KEY)) || [];
let currentUser = null;
let currentRole = null;

const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
const lessons = ["Matematik", "Fizik", "Kimya", "Biyoloji", "Türkçe", "Tarih", "Coğrafya"];
const times = [
    ["09:00", "09:40"],
    ["09:50", "10:30"],
    ["10:40", "11:20"],
    ["11:30", "12:10"],
    ["12:20", "13:00"],
    ["13:10", "13:50"],
    ["14:00", "14:40"]
];

// Giriş Fonksiyonu
function login() {
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const role = document.getElementById("role").value;

    if(!firstName || !lastName) { alert("İsim ve soyisim giriniz!"); return; }

    currentUser = firstName + " " + lastName;
    currentRole = role;

    document.getElementById("loginDiv").classList.add("hidden");

    if(role === "teacher") {
        document.getElementById("teacherDiv").classList.remove("hidden");
        updateTeacherTable();
    } else {
        document.getElementById("studentDiv").classList.remove("hidden");
        document.getElementById("studentLabel").innerText = currentUser;
        updateStudentTable();
        generateSchedule();
    }
}

// Çıkış
function logout() {
    currentUser = null;
    currentRole = null;
    document.getElementById("loginDiv").classList.remove("hidden");
    document.getElementById("teacherDiv").classList.add("hidden");
    document.getElementById("studentDiv").classList.add("hidden");
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
}

// Öğretmen not ekleme
function addGrade() {
    const firstName = document.getElementById("studentName").value.trim();
    const lastName = document.getElementById("studentLastName").value.trim();
    const grade = parseFloat(document.getElementById("studentGrade").value);

    if(!firstName || !lastName || isNaN(grade)) {
        alert("Lütfen öğrenci adı, soyadı ve notu eksiksiz giriniz!");
        return;
    }

    const fullName = firstName + " " + lastName;

    const existing = grades.find(g => g.name === fullName);
    if(existing) existing.grade = grade;
    else grades.push({name: fullName, grade});

    localStorage.setItem(GRADES_KEY, JSON.stringify(grades));
    updateTeacherTable();

    document.getElementById("studentName").value = "";
    document.getElementById("studentLastName").value = "";
    document.getElementById("studentGrade").value = "";
}

// Öğretmen tablosu
function updateTeacherTable() {
    const table = document.getElementById("gradesTable");
    table.innerHTML = "<tr><th>Öğrenci</th><th>Not</th></tr>";
    grades.forEach(g => {
        const row = table.insertRow();
        row.insertCell(0).innerText = g.name;
        row.insertCell(1).innerText = g.grade;
    });
}

// Öğrenci tablosu
function updateStudentTable() {
    const table = document.getElementById("studentGradesTable");
    table.innerHTML = "<tr><th>Öğrenci</th><th>Not</th></tr>";
    grades.forEach(g => {
        if(g.name === currentUser) {
            const row = table.insertRow();
            row.insertCell(0).innerText = g.name;
            row.insertCell(1).innerText = g.grade;
        }
    });
}

// Ders programı tablo oluştur
function generateSchedule() {
    let schedule = JSON.parse(localStorage.getItem(SCHEDULE_KEY)) || {};

    // Yeni kullanıcı veya eski formatlı veri ise oluştur
    if(!schedule[currentUser] || !schedule[currentUser][days[0]] || typeof schedule[currentUser][days[0]][0] === "string") {
        let userSchedule = {};
        days.forEach(day => {
            let dayLessons = [];
            for(let i = 0; i < 7; i++) {
                const randomLesson = lessons[Math.floor(Math.random() * lessons.length)];
                dayLessons.push({name: randomLesson, start: times[i][0], end: times[i][1]});
            }
            userSchedule[day] = dayLessons;
        });
        schedule[currentUser] = userSchedule;
        localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
    }

    const table = document.getElementById("scheduleTable");
    table.innerHTML = ""; // önce tabloyu temizle

    // Başlık satırı
    const headerRow = table.insertRow();
    headerRow.insertCell().innerText = "Gün";
    for(let i = 1; i <= 7; i++) {
        headerRow.insertCell().innerText = `${i}. Ders`;
    }

    // Her gün için satır
    const userSchedule = schedule[currentUser];
    for(let day in userSchedule) {
        const row = table.insertRow();
        row.insertCell().innerText = day;

        userSchedule[day].forEach(lesson => {
            const cell = row.insertCell();
            cell.innerText = `${lesson.start}-${lesson.end} ${lesson.name}`;
        });
    }
}