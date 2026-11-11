
// FOOD TRACKER - OFFLINE VERSION

const foods = [
  {name:"Boiled Egg",cal:155,protein:13,carbs:1,fat:11,category:"breakfast"},
  {name:"Fried Egg",cal:196,protein:14,carbs:1,fat:15,category:"breakfast"},
  {name:"Paratha",cal:320,protein:7,carbs:45,fat:13,category:"breakfast"},
  {name:"Plain Roti",cal:270,protein:8,carbs:55,fat:2,category:"roti"},
  {name:"Maize Roti",cal:220,protein:6,carbs:45,fat:2,category:"roti"},
  {name:"Boiled Rice",cal:130,protein:2.7,carbs:28,fat:0.3,category:"rice"},
  {name:"Chicken Breast",cal:165,protein:31,carbs:0,fat:3.6,category:"meat"},
  {name:"Chicken Curry",cal:190,protein:18,carbs:5,fat:11,category:"meat"},
  {name:"Beef Curry",cal:220,protein:18,carbs:4,fat:14,category:"meat"},
  {name:"Daal",cal:116,protein:9,carbs:20,fat:0.4,category:"daal"},
  {name:"Boiled Chana",cal:164,protein:8.9,carbs:27,fat:2.6,category:"daal"},
  {name:"Rajma",cal:127,protein:8.7,carbs:23,fat:0.5,category:"daal"},
  {name:"Plain Yogurt",cal:61,protein:3.5,carbs:4.7,fat:3.3,category:"other"},
  {name:"Milk",cal:61,protein:3.2,carbs:4.8,fat:3.3,category:"drinks"},
  {name:"Banana",cal:89,protein:1.1,carbs:23,fat:0.3,category:"fruits"},
  {name:"Apple",cal:52,protein:0.3,carbs:14,fat:0.2,category:"fruits"},
  {name:"Mango",cal:60,protein:0.8,carbs:15,fat:0.4,category:"fruits"},
  {name:"Dates",cal:282,protein:2.5,carbs:75,fat:0.4,category:"fruits"},
  {name:"Almonds",cal:579,protein:21,carbs:22,fat:50,category:"snacks"},
  {name:"Peanuts",cal:567,protein:26,carbs:16, fat:49,category:"snacks"},
  {name:"Pumpkin Seeds",cal:559,protein:30,carbs:11,fat:49,category:"snacks"},
  {name:"Pakora",cal:280,protein:6,carbs:30,fat:16,category:"snacks"},
  {name:"Nimko",cal:520,protein:12,carbs:55,fat:28,category:"snacks"},
  {name:"Tea with Milk (no sugar)",cal:30,protein:1.5,carbs:2,fat:1.5,category:"drinks"},
  {name:"Sugar",cal:387,protein:0,carbs:100,fat:0,category:"other"}
];

let customFoods = JSON.parse(localStorage.getItem("customFoods") || "[]");
let diary = JSON.parse(localStorage.getItem("diary") || "[]");

let goals = JSON.parse(localStorage.getItem("goals") || '{"kcal":2400,"protein":145}');

let savedDate = localStorage.getItem("trackerDate");
const today = new Date().toDateString();

if (savedDate !== today) {
  diary = [];
  localStorage.setItem("trackerDate", today);
  saveDiary();
}

function saveDiary() {
  localStorage.setItem("diary", JSON.stringify(diary));
}

function saveCustomFoods() {
  localStorage.setItem("customFoods", JSON.stringify(customFoods));
}

function saveGoals() {
  const kcal = Number(document.getElementById("goalKcal").value);
  const protein = Number(document.getElementById("goalProtein").value);

  if (kcal <= 0 || protein <= 0) {
    alert("Enter valid goals.");
    return;
  }

  goals = {kcal, protein};
  localStorage.setItem("goals", JSON.stringify(goals));
  updateProgress();
  alert("Goals saved!");
}

function updateProgress() {
  const totalCalories = diary.reduce((sum, item) => sum + item.cal, 0);
  const totalProtein = diary.reduce((sum, item) => sum + item.protein, 0);

  document.getElementById("kcal").textContent =
    Math.round(totalCalories);

  document.getElementById("protein").textContent =
    totalProtein.toFixed(1) + " g";

  document.getElementById("remaining").textContent =
    Math.round(goals.kcal - totalCalories);

  document.getElementById("goalText").textContent =
    goals.kcal;

  document.getElementById("goalKcal").value = goals.kcal;
  document.getElementById("goalProtein").value = goals.protein;

  renderDiary();
}

function renderFoods() {
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;

  const allFoods = [...foods, ...customFoods];

  const results = allFoods.filter(food =>
    food.name.toLowerCase().includes(search) &&
    (category === "all" || food.category === category)
  );

  const container = document.getElementById("foodChoices");
  container.innerHTML = "";

  if (results.length === 0) {
    container.textContent = "No foods found.";
    return;
  }

  results.forEach(food => {
    const div = document.createElement("div");
    div.className = "food-item";

    const title = document.createElement("strong");
    title.textContent = food.name;

    const details = document.createElement("p");
    details.textContent =
      `${food.cal} kcal | Protein ${food.protein}g per 100g`;

    const grams = document.createElement("input");
    grams.type = "number";
    grams.placeholder = "Enter quantity in grams";
    grams.min = "1";
    grams.value = "100";

    const button = document.createElement("button");
    button.textContent = "Add to Diary";

    button.onclick = () => {
      const amount = Number(grams.value);

      if (!amount || amount <= 0) {
        alert("Enter a valid quantity.");
        return;
      }

      addToDiary(food, amount);
    };

    div.append(title, details, grams, button);
    container.appendChild(div);
  });
}

function addToDiary(food, grams) {
  const factor = grams / 100;

  diary.push({
    name: food.name,
    grams: grams,
    cal: food.cal * factor,
    protein: food.protein * factor,
    carbs: food.carbs * factor,
    fat: food.fat * factor
  });

  saveDiary();
  updateProgress();
}

function renderDiary() {
  const container = document.getElementById("diary");
  container.innerHTML = "";

  if (diary.length === 0) {
    container.textContent = "No food added yet.";
    return;
  }

  diary.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "diary-item";

    const title = document.createElement("strong");
    title.textContent = `${item.name} - ${item.grams}g`;

    const details = document.createElement("p");
    details.textContent =
      `${Math.round(item.cal)} kcal | Protein ${item.protein.toFixed(1)}g | Carbs ${item.carbs.toFixed(1)}g | Fat ${item.fat.toFixed(1)}g`;

    const button = document.createElement("button");
    button.textContent = "Remove";
    button.onclick = () => {
      diary.splice(index, 1);
      saveDiary();
      updateProgress();
    };

    div.append(title, details, button);
    container.appendChild(div);
  });
}

function addCustom() {
  const name = document.getElementById("customName").value.trim();
  const cal = Number(document.getElementById("customCalories").value);
  const protein = Number(document.getElementById("customProtein").value);
  const carbs = Number(document.getElementById("customCarbs").value);
  const fat = Number(document.getElementById("customFat").value);

  if (!name || !Number.isFinite(cal) || cal < 0 ||
      !Number.isFinite(protein) || protein < 0 ||
      !Number.isFinite(carbs) || carbs < 0 ||
      !Number.isFinite(fat) || fat < 0) {
    alert("Enter a food name and valid nutrition values.");
    return;
  }

  customFoods.push({
    name, cal, protein, carbs, fat, category:"other"
  });

  saveCustomFoods();

  document.getElementById("customName").value = "";
  document.getElementById("customCalories").value = "";
  document.getElementById("customProtein").value = "";
  document.getElementById("customCarbs").value = "";
  document.getElementById("customFat").value = "";

  renderFoods();
  alert("Custom food added!");
}

function resetDay() {
  if (!confirm("Clear today's food diary?")) return;

  diary = [];
  saveDiary();
  updateProgress();
}

function exportData() {
  const data = {
    diary,
    customFoods,
    goals,
    date: today
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    {type:"application/json"}
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "food-tracker-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const file = document.getElementById("importFile").files[0];

  if (!file) {
    alert("Choose a backup file first.");
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);

      if (!Array.isArray(data.diary) ||
          !Array.isArray(data.customFoods) ||
          !data.goals) {
        throw new Error("Invalid backup");
      }

      diary = data.diary;
      customFoods = data.customFoods;
      goals = data.goals;

      saveDiary();
      saveCustomFoods();
      localStorage.setItem("goals", JSON.stringify(goals));

      renderFoods();
      updateProgress();

      alert("Backup restored!");
    } catch (error) {
      alert("Invalid backup file.");
    }
  };

  reader.readAsText(file);
}

// Start application
document.getElementById("goalKcal").value = goals.kcal;
document.getElementById("goalProtein").value = goals.protein;

renderFoods();
updateProgress();
