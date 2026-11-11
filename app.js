const foods = [
['Maize roti, plain','Grains & roti',218,5.7,44,2.5],['Wheat roti, plain','Grains & roti',297,9.8,55,4.5],['Cooked white rice','Grains & roti',130,2.7,28,0.3],['Cooked brown rice','Grains & roti',123,2.7,25.6,1],['Oats, dry','Grains & roti',389,16.9,66.3,6.9],['Paratha','Grains & roti',320,7,45,12],
['Egg, whole','Protein',143,12.6,0.7,9.5],['Chicken breast, cooked','Protein',165,31,0,3.6],['Chicken leg meat, cooked','Protein',209,26,0,11],['Beef, lean cooked','Protein',217,26,0,12],['Fish cooked','Protein',128,26,0,2.7],['Tuna canned in water','Protein',116,26,0,1],
['Chana boiled','Beans & pulses',164,8.9,27.4,2.6],['Rajma boiled','Beans & pulses',127,8.7,22.8,0.5],['Daal cooked','Beans & pulses',116,9,20,0.4],['Chickpea dry','Beans & pulses',378,20.5,63,6],
['Milk, whole','Dairy',61,3.2,4.8,3.3],['Curd plain','Dairy',61,3.5,4.7,3.3],['Greek yogurt plain','Dairy',97,9,3.9,5],['Paneer','Dairy',265,18.3,1.2,20.8],
['Banana','Fruit',89,1.1,22.8,0.3],['Apple','Fruit',52,0.3,13.8,0.2],['Mango','Fruit',60,0.8,15,0.4],['Guava','Fruit',68,2.6,14.3,1],['Orange','Fruit',47,0.9,11.8,0.1],['Dates','Fruit',282,2.5,75,0.4],
['Potato boiled','Vegetables',87,1.9,20.1,0.1],['Tomato','Vegetables',18,0.9,3.9,0.2],['Cucumber','Vegetables',15,0.7,3.6,0.1],['Spinach cooked','Vegetables',23,3,3.8,0.3],
['Nimko','Snacks',520,10,55,28],['Pakora','Snacks',280,6,30,15],['Biscuit plain','Snacks',450,7,70,15],['Potato chips','Snacks',536,7,53,35],
['Pumpkin seeds','Nuts & seeds',559,30,11,49],['Almonds','Nuts & seeds',579,21,22,50],['Peanuts','Nuts & seeds',567,26,16,49],['Walnuts','Nuts & seeds',654,15,14,65]
];
let diary = JSON.parse(localStorage.getItem('diary') || '[]');
let goals = JSON.parse(localStorage.getItem('goals') || '{"kcal":2400,"protein":145}');
const $ = id => document.getElementById(id);
function save(){localStorage.setItem('diary',JSON.stringify(diary));renderDiary();}
function renderFoods(){
 const q=$('search').value.toLowerCase(), cat=$('category').value;
 const list=foods.filter(f=>(cat==='All'||f[1]===cat)&&f[0].toLowerCase().includes(q));
 $('foodChoices').innerHTML=list.map((f,i)=>`<div class="food"><div><b>${f[0]}</b><small>${f[2]} kcal · P ${f[3]}g · C ${f[4]}g · F ${f[5]}g per 100g</small></div><button class="remove" onclick="quickAdd(${foods.indexOf(f)})">Add</button></div>`).join('')||'<p class="muted">No matching foods.</p>';
}
function quickAdd(i){const f=foods[i];const w=prompt('Enter weight in grams for '+f[0]+':','100');if(w===null||!Number(w)||Number(w)<=0)return;diary.push({name:f[0],weight:Number(w),k:f[2],p:f[3],c:f[4],fat:f[5]});save();}
function addCustom(){let n=$('customName').value.trim(),w=Number($('customWeight').value),k=Number($('customKcal').value),p=Number($('customProtein').value),c=Number($('customCarbs').value),fat=Number($('customFat').value);if(!n||w<=0)return alert('Enter a food name and valid weight.');diary.push({name:n,weight:w,k,p,c,fat});save();$('customName').value='';}
function totals(){return diary.reduce((a,x)=>{let m=x.weight/100;a.k+=x.k*m;a.p+=x.p*m;a.c+=x.c*m;a.f+=x.fat*m;return a},{k:0,p:0,c:0,f:0});}
function renderDiary(){let t=totals();$('kcal').textContent=Math.round(t.k);$('protein').textContent=t.p.toFixed(1)+' g';$('remaining').textContent=Math.round(goals.kcal-t.k);$('goalText').textContent=`Daily goals: ${goals.kcal} kcal · ${goals.protein} g protein | Carbs ${t.c.toFixed(1)} g · Fat ${t.f.toFixed(1)} g`;$('diary').innerHTML=diary.length?diary.map((x,i)=>`<div class="food"><div><b>${x.name}</b><small>${x.weight} g · ${Math.round(x.k*x.weight/100)} kcal · P ${(x.p*x.weight/100).toFixed(1)}g</small></div><button class="remove" onclick="removeItem(${i})">Remove</button></div>`).join(''):'<p class="muted">No foods added yet.</p>';}
function removeItem(i){diary.splice(i,1);save();}
function saveGoals(){goals={kcal:Number($('goalKcal').value)||2400,protein:Number($('goalProtein').value)||145};localStorage.setItem('goals',JSON.stringify(goals));renderDiary();alert('Goals saved.');}
function resetDay(){if(confirm('Clear all foods from today?')){diary=[];save();}}
function exportData(){let blob=new Blob([JSON.stringify({diary,goals},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='food-tracker-backup.json';a.click();URL.revokeObjectURL(a.href);}
function importData(e){let file=e.target.files[0];if(!file)return;let r=new FileReader();r.onload=()=>{try{let d=JSON.parse(r.result);diary=d.diary||[];goals=d.goals||goals;localStorage.setItem('goals',JSON.stringify(goals));save();$('goalKcal').value=goals.kcal;$('goalProtein').value=goals.protein;alert('Backup imported.');}catch(err){alert('Invalid backup file.');}};r.readAsText(file);}
$('goalKcal').value=goals.kcal;$('goalProtein').value=goals.protein;renderFoods();renderDiary();
