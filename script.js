const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = [];
let schedule = [];
let timerSeconds = 25 * 60;
let timerInterval = null;

// تحديث إحصائيات المهام
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.done).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("total").textContent = total;
    document.getElementById("completed").textContent = completed;
    document.getElementById("percentage").textContent =
        percentage + "%";
}

// عرض المهام
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        const row = document.createElement("div");
        row.className = "task-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;
        checkbox.setAttribute("aria-label", "إكمال المهمة");

        const name = document.createElement("span");
        name.textContent = task.name;

        if (task.done) {
            name.classList.add("done");
        }

        checkbox.addEventListener("change", () => {
            task.done = checkbox.checked;
            renderTasks();
        });

        const remove = document.createElement("button");
        remove.textContent = "حذف";
        remove.className = "delete";

        remove.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            renderTasks();
        });

        row.append(checkbox, name, remove);
        li.appendChild(row);
        taskList.appendChild(li);
    });

    updateStats();
}

// إضافة مهمة جديدة
taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = taskInput.value.trim();

    if (name === "") {
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        name: name,
        done: false
    });

    taskInput.value = "";
    renderTasks();
});

// إضافة مادة إلى الجدول
document.getElementById("addSubject")
    .addEventListener("click", () => {

        const day = document.getElementById("day").value;
        const subjectInput = document.getElementById("subject");
        const subject = subjectInput.value.trim();

        if (subject === "") {
            alert("اكتب اسم المادة أولًا.");
            return;
        }

        schedule.push({
            day: day,
            subject: subject
        });

        renderSchedule();
        subjectInput.value = "";
    });

// عرض جدول الحصص
function renderSchedule() {
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    schedule.forEach((item, index) => {
        const li = document.createElement("li");

        li.appendChild(
            document.createTextNode(
                item.day + ": " + item.subject + " "
            )
        );

        const remove = document.createElement("button");
        remove.textContent = "حذف";
        remove.className = "delete";

        remove.addEventListener("click", () => {
            schedule.splice(index, 1);
            renderSchedule();
        });

        li.appendChild(remove);
        scheduleList.appendChild(li);
    });
}

// تحديث شاشة المؤقت
function updateTimer() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    document.getElementById("timer").textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

// تشغيل المؤقت
document.getElementById("startTimer")
    .addEventListener("click", () => {

        if (timerInterval !== null) {
            return;
        }

        if (timerSeconds <= 0) {
            alert("اضغط إعادة ضبط لبدء جلسة جديدة.");
            return;
        }

        timerInterval = setInterval(() => {
            timerSeconds--;
            updateTimer();

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("أحسنت! انتهت جلسة المذاكرة.");
            }
        }, 1000);
    });

// إيقاف المؤقت مؤقتًا
document.getElementById("pauseTimer")
    .addEventListener("click", () => {

        clearInterval(timerInterval);
        timerInterval = null;
    });

// إعادة المؤقت إلى 25 دقيقة
document.getElementById("resetTimer")
    .addEventListener("click", () => {

        clearInterval(timerInterval);
        timerInterval = null;

        timerSeconds = 25 * 60;
        updateTimer();
    });

// تشغيل التطبيق عند فتح الصفحة
renderTasks();
renderSchedule();
updateTimer();