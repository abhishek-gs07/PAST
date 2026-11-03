const tasks = [
  {
    date: "2026-10-28",
    time: "18:30",
    session:null,
    nts:false,
    title: "Check papers",
    note: ""
  },{
    date: "2026-10-29",
    time: null,
    session: "afternoon",
    nts: false,
    title: "exam time",
    note: ""
  },{
    date: "2026-10-29",
    time: null,
    nts:true,
    session: "morning",
    title: "breakfast",
    note: ""
  }
];

const chatContainer=document.getElementById("chat-container");
const input_txt=document.getElementById("message-input");
const sendBtn=document.getElementById("send-button");

function addMessage(input_text, sender) {
  const box = document.createElement("div");
  box.textContent=input_text;  //filled 
  box.classList.add("message", sender); // Labelled
  chatContainer.appendChild(box);
}

function saveTask(rest){
      const l_indexOfOn = rest.lastIndexOf(" on ");
      const time = findTime(rest);
      if(l_indexOfOn==-1){return addMessage("Date not found","past");}
      else{
        const title=rest.slice(0,l_indexOfOn).trim();
        if(title==""){
          addMessage("Task title is missing","past");
          return;}
        const date =rest.slice(l_indexOfOn+4).trim();
        if(looksLikeDate(date)){
          let session= findSession(title);
          let nts=false;
          if(session==null){
            if(time==null){
              nts=true;
            }
            if(nts==true){session="morning";}}
            tasks.push({date:toStorageDate(date),time:time,session:session,title:title,note:null,nts:nts});
        addMessage(`Added ${title} on ${date}`,"past");}
        else{ addMessage("That doesn't look like a valid date!","past");}
      }}

function displayMsg(){
  if(input_txt.value.trim()!==""){   // trim used for handling only space input
    addMessage(input_txt.value,"user");
    const saving_inp=input_txt.value.trim();
    input_txt.value="";
    const temp = saving_inp.split(" ");
    if(saving_inp.toLowerCase().startsWith("remind ")){ 
      let newmsg=saving_inp.slice(7);
      if(newmsg.toLowerCase().startsWith("to ")){newmsg=newmsg.slice(3);}
      saveTask(newmsg);}
    if(looksLikeDate(saving_inp)){
      const found=getTasksForDate(toStorageDate(saving_inp));
      addMessage(formatTasks(found),"past");
    }
    if(temp[0].toLowerCase()==("add")){
      saveTask(saving_inp.slice(3));
    }
  }};
sendBtn.addEventListener("click",displayMsg);
input_txt.addEventListener("keydown",function(e){
  if(e.key==="Enter"){
    displayMsg();
  }
});

addMessage("Hello! How can I assist you today?","past");

function isLeapYear(year){
  if(year%400==0 || (year%4==0 && year%100!==0)){return true;}
  return false;
}

function looksLikeDate(test){
  const clean = test.trim();
  const pattern = /^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/;
  if(!pattern.test(clean)){
    return false;
  }
  let parts=clean.split(/[\/-]/);
  const day=Number(parts[0]);const  month=Number(parts[1]);const year=Number(parts[2]);
  if(month<1 || month>12){
    return false;
  }
  if(day<1){return false;}
  if(month==4 || month==6 || month==9|| month==11){
    if(day>30){return false;}
  }
  if(month==2){
    if(isLeapYear(year)){if(day>29){return false;}}
    else {if(day>28){return false;}}}
  if(day>31){return false;}
  return true;
};

function toStorageDate(test){
  const clean = test.trim();
  let parts = clean.split(/[\/-]/);
  parts[0]=parts[0].padStart(2,"0");
  parts[1]=parts[1].padStart(2,"0");
  const newFormatDate= parts[2]+'-'+parts[1]+'-'+parts[0];
  return newFormatDate;
}
function getTasksForDate(date){ //filters the task for the given date
  const found = tasks.filter(task =>task.date===date);
  return found;
}

function formatTasks(found){
  if(found.length==0){ return "No Tasks Scheduled";}
  const labels = found.map(task => {
    if(task.time!==null){
      return `- ${task.time} ${task.title}`;
    }
    return `- ${task.title}`;
  });
  return labels.join("\n");
}

function findSession(text){
  const lower_txt= text.toLowerCase();
  if(lower_txt.includes("morning")){return "morning";}
  if(lower_txt.includes("afternoon")){return "afternoon";}
  if(lower_txt.includes("evening")){return "evening";}
  if(lower_txt.includes("night")){return "night";}
  return null;
}
function looksLikeTime(text){
  const assume_time=text.split(":");
  if(Number(assume_time[0])>=24 || Number(assume_time[1])>59){
    return false;
  }
  return true;
}
function findTime(text){
  const m = text.match(/\d{1,2}[:]\d{2}/);   // YOUR STENCIL: 1-2 digits, colon, 2 digits
  if(m === null){ return null; }
  if(looksLikeTime(m[0])){
    return m[0];
  }
  return null;                    // the matched piece
}

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }