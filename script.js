document.addEventListener('DOMContentLoaded', (event) => {
    showPage('alarm');
    updateClock();
    setInterval(updateClock, 1000);
    checkAlarms();
    updatePageContent();
});

function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });
}

// Bấm giờ
let stopwatchInterval;
let stopwatchTime = 0;

function startStopwatch() {
    if (stopwatchInterval) return;
    const startTime = Date.now() - stopwatchTime;
    stopwatchInterval = setInterval(() => {
        stopwatchTime = Date.now() - startTime;
        document.getElementById('stopwatchDisplay').textContent = formatTime(stopwatchTime);
    }, 1000);
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchTime = 0;
    document.getElementById('stopwatchDisplay').textContent = '00:00:00';
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Hẹn giờ
let timerInterval;
let timerTime = 0;

function startTimer() {
    const timerInput = document.getElementById('timerInput').value;
    if (!timerInput || timerInput <= 0) return;
    timerTime = timerInput * 1000;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timerTime <= 0) {
            clearInterval(timerInterval);
            alert(languages[currentLanguage].timerEndAlert);
            playAlarmSound();
        } else {
            timerTime -= 1000;
            document.getElementById('timerDisplay').textContent = formatTime(timerTime);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    document.getElementById('timerDisplay').textContent = '00:00';
}

// Báo thức
let alarms = [];
const alarmSound = document.getElementById('alarmSound');

function addAlarm() {
    const alarmTime = prompt(languages[currentLanguage].alarmInputPrompt);
    if (!alarmTime) return;
    alarms.push(alarmTime);
    updateAlarmsList();
}

function updateAlarmsList() {
    const alarmsList = document.getElementById('alarmsList');
    alarmsList.innerHTML = '';
    alarms.forEach((alarm, index) => {
        const li = document.createElement('li');
        li.textContent = alarm;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = languages[currentLanguage].deleteBtnText;
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => {
            alarms.splice(index, 1);
            updateAlarmsList();
        };
        li.appendChild(deleteButton);
        alarmsList.appendChild(li);
    });
}

function checkAlarms() {
    const now = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    alarms.forEach((alarm) => {
        if (alarm === now) {
            alert(languages[currentLanguage].alarmAlert);
            playAlarmSound();
        }
    });
    setTimeout(checkAlarms, 1000);
}

function playAlarmSound() {
    alarmSound.play();
}

// Ngôn ngữ
const languages = {
    vi: {
        clockTitle: 'Đồng hồ',
        alarmPageTitle: 'Báo thức',
        alarmInputPrompt: 'Nhập thời gian báo thức (HH:MM:SS)',
        stopwatchPageTitle: 'Bấm giờ',
        stopwatchStartBtn: 'Bắt đầu',
        stopwatchStopBtn: 'Dừng',
        stopwatchResetBtn: 'Đặt lại',
        timerPageTitle: 'Hẹn giờ',
        timerInputPlaceholder: 'Giây',
        timerStartBtn: 'Bắt đầu',
        timerStopBtn: 'Dừng',
        timerResetBtn: 'Đặt lại',
        timerEndAlert: 'Hẹn giờ kết thúc!',
        deleteBtnText: 'Xóa',
        alarmAlert: 'Báo thức đang đổ chuông!',
    },
    en: {
        clockTitle: 'Clock',
        alarmPageTitle: 'Alarm',
        alarmInputPrompt: 'Enter alarm time (HH:MM:SS)',
        stopwatchPageTitle: 'Stopwatch',
        stopwatchStartBtn: 'Start',
        stopwatchStopBtn: 'Stop',
        stopwatchResetBtn: 'Reset',
        timerPageTitle: 'Timer',
        timerInputPlaceholder: 'Seconds',
        timerStartBtn: 'Start',
        timerStopBtn: 'Stop',
        timerResetBtn: 'Reset',
        timerEndAlert: 'Timer ended!',
        deleteBtnText: 'Delete',
        alarmAlert: 'Alarm is ringing!',
    },
    // Add more languages here if needed
};

let currentLanguage = 'vi';

function changeLanguage(lang) {
    currentLanguage = lang;
    updatePageContent();
}

function updatePageContent() {
    const lang = languages[currentLanguage];
    document.querySelector('title').textContent = lang.clockTitle;
    document.getElementById('clock').textContent = new Date().toLocaleTimeString();

    document.querySelectorAll('.nav-btn')[0].textContent = lang.alarmPageTitle;
    document.querySelectorAll('.nav-btn')[1].textContent = lang.stopwatchPageTitle;
    document.querySelectorAll('.nav-btn')[2].textContent = lang.timerPageTitle;

    document.getElementById('alarm').querySelector('h2').textContent = lang.alarmPageTitle;
    document.getElementById('alarm').querySelector('.action-btn').textContent = lang.alarmInputPrompt;

    document.getElementById('stopwatch').querySelector('h2').textContent = lang.stopwatchPageTitle;

    document.getElementById('timer').querySelector('h2').textContent = lang.timerPageTitle;
    document.querySelector('.input').placeholder = lang.timerInputPlaceholder;

    const stopwatchBtns = document.getElementById('stopwatch').querySelectorAll('.action-btn');
    stopwatchBtns[0].textContent = lang.stopwatchStartBtn;
    stopwatchBtns[1].textContent = lang.stopwatchStopBtn;
    stopwatchBtns[2].textContent = lang.stopwatchResetBtn;

    const timerBtns = document.getElementById('timer').querySelectorAll('.action-btn');
    timerBtns[0].textContent = lang.timerStartBtn;
    timerBtns[1].textContent = lang.timerStopBtn;
    timerBtns[2].textContent = lang.timerResetBtn;

    updateAlarmsList();
}
