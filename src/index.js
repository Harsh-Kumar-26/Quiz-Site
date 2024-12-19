// User name left to store
// remember to make admin id line 146
import { initializeApp } from 'firebase/app'
import {
  getFirestore,collection,getDocs,addDoc,deleteDoc,doc,onSnapshot,query,where,orderBy,serverTimestamp,getDoc,
  updateDoc,setDoc
  /**initializeApp: initializes
   * getFirestore: adds firestore
   * collection: particular collection of store
   * getDocs: gets data from store
   * doc: get particular document from collection
   * onSnapshot: real time data getting~getDocs
   */
} from 'firebase/firestore'
import{
  getAuth,createUserWithEmailAndPassword,signOut,signInWithEmailAndPassword,onAuthStateChanged,
  signInAnonymously,updateProfile,deleteUser,
  sendPasswordResetEmail
}from 'firebase/auth'
// import { getDatabase, ref, set } from "firebase/database";
// init
const firebaseConfig = {
  apiKey: "AIzaSyDDy14HC8x0hylj8qq_kKOPIJqTarNbHco",
  authDomain: "quiz-site-8c774.firebaseapp.com",
  projectId: "quiz-site-8c774",
  storageBucket: "quiz-site-8c774.firebasestorage.app",
  messagingSenderId: "336600619145",
  appId: "1:336600619145:web:1b9763c289c7d6e68e8e58"
};
  initializeApp(firebaseConfig);
  console.log("Firebase initialized")
  // init ends
  
  // Firestore init
  const db=getFirestore();

  // For Auth
  const auth=getAuth();
  // Sign Up
  if (window.location.pathname.includes("signup")){
  document.addEventListener("DOMContentLoaded", () => {
  const signupmail=document.querySelector(".signup");
  console.log("Sign up DOM Loaded");
  signupmail.addEventListener("submit",(e)=>{
    e.preventDefault();
    console.log("Submitted")
    const name=signupmail.name.value;
    const mail=document.getElementById("mail").value;
    const pass=document.getElementById("mail_password").value;
  createUserWithEmailAndPassword(auth,mail,pass)
  .then(cred=>{
    console.log("No Error");
    const user=cred.user;
    return updateProfile(user, { displayName: name })
    .then(() => {
      console.log("Display name set successfully:", user.displayName);
      document.querySelector("#ep2").style.color = "blue";
      document.querySelector("#ep2").innerHTML = "User Created";    
      document.querySelector("#ep2").style.color="blue";
    document.querySelector("#ep2").innerHTML="User Created";
    console.log(user.displayName);
    window.location.href = "user_main.html";
    signupmail.reset()
  })
  .catch((error) => {
    console.log("Error");
    document.querySelector("#ep2").style.color="red";
    document.querySelector("#ep2").innerHTML=error.message;

  })
})
  })})}
// Sign Up Ends

// Login
if(window.location.pathname.includes("login.html")){
document.addEventListener("DOMContentLoaded", () => {
const loginmail=document.querySelector(".login");
console.log("Login DOM Loaded");
loginmail.addEventListener("submit",(e)=>{
  e.preventDefault()
  const mail=document.getElementById("mail1").value;
  const pass=document.getElementById("mail_passowrd1").value;
  signInWithEmailAndPassword(auth,mail,pass)
  .then(cred => {
    console.log("No Error");
    // const user=cred.user;
    document.querySelector("#ep1").style.color="blue";
    document.querySelector("#ep1").innerHTML="User Created";
    window.location.href = "user_main.html";
    // console.log(cred.displayName);
    loginmail.reset()
  })
  .catch(error => {
    console.log("Error");
    document.querySelector("#ep1").style.color="red";
    document.querySelector("#ep1").innerHTML=error.message;
  })
})
})}
// Login Ends

// Admin Login
if (window.location.pathname.includes("admin_login")){
const admlog=collection(db,"admin")
// let id;
document.addEventListener("DOMContentLoaded", ()=>{
const admlog2=document.querySelector("#admlog");
console.log(" Admlog DOM Loaded");
admlog2.addEventListener("submit",(e)=>{
  e.preventDefault()
const admail=document.getElementById("admail").value;
const adpass=document.getElementById("admail_passowrd").value;
getDocs(admlog)
.then((snapshot)=>{
  let admin=[]
  snapshot.docs.forEach((doc)=>
  admin.push({...doc.data()}))
  console.log(admin);
  let n=0;
  for(let i=0;i<admin.length;i++)
  {
    if(admail==admin[i].mail && adpass==admin[i].password)
    {
      n=1;
      async function ids() {
        const q=query(admlog,where("mail","==",admail));
        const qsnapshot=await getDocs(q);
        let id;
        qsnapshot.forEach((doc)=>{
          id=doc.id;
        });
        return id;
      }
        async function call() {
          const id=await ids();
          window.location.href = `admin_main.html?id=${encodeURIComponent(id)}`;
          loginmail.reset()
        }
        call();
    }
  }
    if(n==0)
    {
      document.querySelector("#ep3").style.color="red";
      document.querySelector("#ep3").innerHTML="Wrong Credentials";
    }
  admin=[];
})
.catch((error)=>{
  console.log(error);
})
})
})}
// Admin Login Ends
// Auth Ends


// Firestore

// Creating quizzes
// section array(stores object):
// Number of questions for sec,section name,question array
// Question array(stores elements):
// question,no. of options,positive mark,negative mark,correct option,all options(option array)
// section array-->section data+questions array-->question array-->question data+option array
if (window.location.pathname.includes("quiz_make_page")){
const urlParams = new URLSearchParams(window.location.search);
    const id2 = urlParams.get('id');
    console.log(id2);
document.addEventListener("DOMContentLoaded", async()=>{
  console.log("DOM Loaded");
  const pos=document.getElementById("saveQuiz");
  pos.addEventListener("click",async (e)=>{
    e.preventDefault()
    const quiz_name=document.getElementById("quizName").value;
    console.log("Quiz name const")
    const admindocref1=doc(db,'admin',id2);
    console.log("First refrence made")
      let n1;
      await getDoc(admindocref1)
      .then(docSnapshot => {
      n1 = parseInt(docSnapshot.data().quiz,10);
      console.log(n1);
      n1=n1+1;
      return updateDoc(admindocref1, { quiz: n1 });
      })
    const subcolRef1=collection(doc(db,'admin',id2),n1.toString());
    console.log("Second refrence made")
    console.log("SaveQuiz opened")
const n=parseInt(document.getElementById('numSections').value,10);
const at=0;
const section_data=[];
const quiz={
  name:document.getElementById('quizName').value,
  type:document.getElementById('quiztype').value,
  section_num:document.getElementById('numSections').value,
  discription:document.getElementById('quizdis').value,
  time:parseInt(document.getElementById('hour').value,10)*60+parseInt(document.getElementById('min').value,10),
  attempt:at
};
try{
  const docRef = await addDoc(subcolRef1, quiz);
  console.log("Document added to firestore");
}
catch(err){
  document.querySelector("#p2").style.color="red";
  document.querySelector("#p2").innerHTML=err;
}
const questionsarray=[];
const optiondata=[]
for(let i=1;i<=n;i++)
  {
  console.log("Loop 1 open");
  const sectionName=document.getElementById(`sectionName${i}`).value;
  const numQuestions = parseInt(document.getElementById(`numQuestions${i}`).value, 10);
  
  for(let j=1;j<=numQuestions;j++){
    console.log("Loop 2 open");
    const pos4=document.getElementById(`generateOptions(${i}, ${j})`)
    const question=document.getElementById(`questionText${i}_${j}`).value;
    const options=parseInt(document.getElementById(`numOptions${i}_${j}`).value,10);
    const posmark=parseInt(document.getElementById(`posmark${i}_${j}`).value,10);
    const negmark=parseInt(document.getElementById(`negmark${i}_${j}`).value,10);
    let correct_val;
    for(let k=1;k<=options;k++){
      console.log("Loop 3 open");
      const option=document.getElementById(`optionText${i}_${j}_${k}`).value;
      optiondata.push({option,i,j,k});
      const correct=document.getElementById(`correctOption${i}_${j}_${k}`)
      if(correct.checked)
      {
        correct_val=k;
      }
    }
    console.log("Loop 3 closed")
    questionsarray.push({question,options,posmark,negmark,correct_val,i,j});
    }
  console.log("Loop 2 closed")
  section_data.push({sectionName,numQuestions,i});
  }
  console.log("Loop 1 closed")
  const quiz2={questions:questionsarray ,sections:section_data,option:optiondata};
  try{
    const docRef2 = await addDoc(subcolRef1, quiz2);
    console.log("Document added to firestore");
    window.location.href=`admin_main.html?id=${encodeURIComponent(id2)}`;
  }
  catch(err){
    document.querySelector("#p2").style.color="red";
    document.querySelector("#p2").innerHTML=err;
  }
})})}
//Creating Quiz ends


// Creating Quiz for user

if (window.location.pathname.includes("quiz_make_page_user")){
  document.addEventListener("DOMContentLoaded", async()=>{
    console.log("DOM Loaded");
    const pos=document.getElementById("saveQuiz");
    let id2;
    onAuthStateChanged(auth,(user)=>{
      if(user){
        id2=user.uid;
      }
      else{
        console.log("User signed out");
      }
    })
    pos.addEventListener("click",async (e)=>{
      e.preventDefault()
      const quiz_name=document.getElementById("quizName").value;
      console.log("Quiz name const")
      const userdocref1=doc(db,'userquiz',id2);
      console.log("First refrence made")
        let n1;
        try{
        const docSnapshot=await getDoc(userdocref1)
          console.log("hi");
          if(docSnapshot.exists()){
            console.log("Exist")
            n1 = parseInt(await(docSnapshot.data().quiz),10);
            console.log("Nan")
            if(!isNaN(n1)&&isFinite(n1)){
            console.log("hello");
            n1=n1+1;
            console.log(n1);
            const n2=n1;
            await updateDoc(userdocref1, {quiz:n2});
            console.log(n1);
        }
        else{
          console.log("hihello");
          n1=1;
          console.log(n1);
          const n2=1;
          await setDoc(userdocref1,{quiz:n2});
          console.log(n1);
        }
      }
      else{
            console.log("Creating");
            n1=1;
            console.log("n1 is")
            console.log(n1);
            const n2=1;
            await setDoc(userdocref1,{quiz:n2});
      }
             }
      catch{
        console.log("Error");
      }
      const subcolRef1=collection(userdocref1,n1.toString());
      console.log("Second refrence made")
      console.log("SaveQuiz opened")
  const n=parseInt(document.getElementById('numSections').value,10);
  const at=0;
  const section_data=[];
  const quiz={
    name:document.getElementById('quizName').value,
    type:document.getElementById('quiztype').value,
    section_num:document.getElementById('numSections').value,
    discription:document.getElementById('quizdis').value,
    time:parseInt(document.getElementById('hour').value,10)*60+parseInt(document.getElementById('min').value,10),
    attempt:at
  };
  try{
    const docRef = await addDoc(subcolRef1, quiz);
    console.log("Document added to firestore");
  }
  catch(err){
    document.querySelector("#p2").style.color="red";
    document.querySelector("#p2").innerHTML=err;
  }
  const questionsarray=[];
  const optiondata=[]
  for(let i=1;i<=n;i++)
    {
    console.log("Loop 1 open");
    const sectionName=document.getElementById(`sectionName${i}`).value;
    const numQuestions = parseInt(document.getElementById(`numQuestions${i}`).value, 10);
    
    for(let j=1;j<=numQuestions;j++){
      console.log("Loop 2 open");
      const pos4=document.getElementById(`generateOptions(${i}, ${j})`)
      const question=document.getElementById(`questionText${i}_${j}`).value;
      const options=parseInt(document.getElementById(`numOptions${i}_${j}`).value,10);
      const posmark=parseInt(document.getElementById(`posmark${i}_${j}`).value,10);
      const negmark=parseInt(document.getElementById(`negmark${i}_${j}`).value,10);
      let correct_val;
      for(let k=1;k<=options;k++){
        console.log("Loop 3 open");
        const option=document.getElementById(`optionText${i}_${j}_${k}`).value;
        optiondata.push({option,i,j,k});
        const correct=document.getElementById(`correctOption${i}_${j}_${k}`)
        if(correct.checked)
        {
          correct_val=k;
        }
      }
      console.log("Loop 3 closed")
      questionsarray.push({question,options,posmark,negmark,correct_val,i,j});
      }
    console.log("Loop 2 closed")
    section_data.push({sectionName,numQuestions,i});
    }
    console.log("Loop 1 closed")
    const quiz2={questions:questionsarray ,sections:section_data,option:optiondata};
    try{
      const docRef2 = await addDoc(subcolRef1, quiz2);
      console.log("Document added to firestore");
      alert(" Quiz Saved to 'Your Custom Quizzes' ")
      // window.location.href='user_main.html';
    }
    catch(err){
      document.querySelector("#p2").style.color="red";
      document.querySelector("#p2").innerHTML=err;
    }
  })})}

// User Quiz Creation Ends


//Admin main Quiz show
if (window.location.pathname.includes("admin_main")) {
  console.log("Entered the element");
  const urlParams = new URLSearchParams(window.location.search);
  const id3 = urlParams.get('id');
  document.addEventListener("DOMContentLoaded",async()=>{
    console.log("DOM Loaded");
    const admindocref1=doc(db,'admin',id3);
    let n1;
    console.log("First refrence")
      await getDoc(admindocref1)
      .then(docSnapshot => {
      n1 = parseInt(docSnapshot.data().quiz,10);
    })
    console.log(n1);
      for(let i=0;i<n1;i++)
        {
        const subcolRef1=collection(doc(db,'admin',id3),(i+1).toString());
        // const data=collection(quizz,admin[i]);
        const dataref=await getDocs(subcolRef1);
        dataref.forEach((doc)=>{
          const name=doc.data().name;
          if(name){
            const sectionDiv = document.createElement("div");
            // sectionDiv.id="quizzes"
            sectionDiv.classList.add("section-container");
            sectionDiv.innerHTML = `<div>Quiz Name: ${name}</div>`;
            const quizhistory=document.getElementById("quizhistory");
            quizhistory.appendChild(sectionDiv);
          }
        })
      }
      for(let i=0;i<n1;i++){
      document.getElementsByClassName("section-container")[i].addEventListener("click",()=>{
        window.location.href="https://example.com";
    })
  }
  })
}
//Admin main Quiz show ends


// User Profile Page
if (window.location.pathname.includes("user_profile")) {
  // Showing names at profile
  document.addEventListener("DOMContentLoaded",async()=>{
    console.log("DOM Loaded")
    onAuthStateChanged(auth,(user)=>{
      if(user){
        console.log("User signed in");
        const name="Name: "+user.displayName;
        const mail="Email: "+user.email;
        document.getElementById("named").innerHTML=name;
        document.getElementById("email").innerHTML=mail;
      }
      else{
        console.log("User signed out");
        const name="none";
        const mail="none";
      }
    })
  })
  // Logout
  document.getElementById("logout").addEventListener("click",async()=>{
    signOut(auth)
    .then(()=>{
      alert("Siggned Out");
      window.location.href="index.html";
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  //Delete
  document.getElementById("bt2").addEventListener("click",async()=>{
    if(confirm("Are you sure to delete your account")){
    const user=auth.currentUser;
    if(user){
      deleteUser(user)
      .then(()=>{
        alert("Account Deleted");
        window.location.href="index.html";
      })
      .catch(()=>{
        alert("Please relogin to delete your account");
      })
    }
    }
  })
  // Reset mail
  document.getElementById("bt1").addEventListener("click",async()=>{
    onAuthStateChanged(auth,(user)=>{
      const mail=user.email;
    sendPasswordResetEmail(auth,mail)
    .then(()=>{
      if(confirm("Are you sure you want to reset password")){
      alert("Password reset email sent")
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  })
  })
}
// User Profile Page ends

// images
const images=doc(db,'images','images');
getDoc(images)
.then((snapshot)=>
  {
    if (window.location.pathname.includes("index.html")) {
      document.getElementById("logo").src=snapshot.data().logo;
      document.getElementById("one").src=snapshot.data().one;
      document.getElementById("two").src=snapshot.data().two;
      document.getElementById("three").src=snapshot.data().three;
      document.getElementById("four").src=snapshot.data().four;
      const n=snapshot.data().bg;
      const n2=snapshot.data().bgm;
      document.getElementById("Cyberlabs").src=snapshot.data().cl;
      document.getElementById("m").style.backgroundImage="url('" + n + "')";
      document.getElementById("m").style.backgroundSize="cover";
      document.body.style.backgroundImage="url('" + n2 + "')";
      // document.body.style.backgroundSize="cover";
  }
  if(window.location.pathname.includes("signup.html")||window.location.pathname.includes("login.html")||window.location.pathname.includes("admin_login.html")) {
    const n2=snapshot.data().bgm;
    const n=snapshot.data().bg;
    document.body.style.backgroundImage="url('" + n2 + "')";
    document.getElementById("m").style.backgroundImage="url('" + n + "')";
    document.getElementById("logo").src=snapshot.data().logo;
  }
  if(window.location.pathname.includes("user_main.html")){
    const n2=snapshot.data().bgm;
    document.body.style.backgroundImage="url('" + n2 + "')";
    const n=snapshot.data().bg;
    document.getElementById("logo").src=snapshot.data().logo;
    // document.getElementById("n").style.backgroundImage="url('" + n + "')";
    document.getElementById("m").style.backgroundImage="url('" + n + "')";
  }
  if(window.location.pathname.includes("user_profile.html")){
    const n=snapshot.data().bg;
    const n2=snapshot.data().bgm;
    document.getElementById("m").style.backgroundImage="url('" + n + "')";
    document.body.style.backgroundImage="url('" + n2 + "')";
  }
  if(window.location.pathname.includes("user_profile.html")||window.location.pathname.includes("user_main.html")){
    document.getElementById("Cyberlabs").src=snapshot.data().cl;
  }

})