
// Access the Element 
let questionCount = document.querySelector(".quiz-info .count span");
let bulltesContainer = document.querySelector(".bullets .spans")
let questionArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let bulltes = document.querySelector(".bullets")
let resultArea = document.querySelector(".results")
let countDown = document.querySelector(".count-down")
let htmlBtn = document.querySelector(".htmlBtn")
let javaScriptBtn = document.querySelector(".javaScriptBtn")

// Set option 
let currentIndex = 0;
let rightAnswers = 0;
let countDowninterval ;
//   fuction to Get the Qeustion From json und chang the json Obj to JavaScript Obj  
 function getQeustion(){

    let myRequst = new XMLHttpRequest();

    myRequst.onreadystatechange = function(){
        if( this.readyState === 4 && this.status === 200 ){
            let qeustionObj = (JSON.parse(this.responseText))
            
            // Randomize the Question 
                shuffleEs6(qeustionObj)

            let questionNumber = qeustionObj.length;

            
            // Creat bulltes + set question Count
            creatBulltes(questionNumber);

            //  Add QeustionData
            addQeustionData(qeustionObj[currentIndex],questionNumber);
           
            // Start count Down Timer
            countDownTimer(8,questionNumber)

            // Click on submit
            submitBtn.addEventListener("click",function(){

                // Get right Answer
              let theRight= qeustionObj[currentIndex].right_answer;
                // increase curresntIndex
                currentIndex++ ;
                // check the Answer
                checkAnswer(theRight,questionNumber)

                // Remove the Previous Question
                questionArea.innerHTML="";
                answerArea.innerHTML=""
              
                //  Add QeustionData
                
                addQeustionData(qeustionObj[currentIndex],questionNumber);
               
                // Handel bulltes Class
                handelBult();
                clearInterval(countDowninterval)
                countDownTimer(8,questionNumber)
                // Show result
                showRsult(questionNumber);            
            })
        };
    } 

    // Html Question
    htmlBtn.onclick=function(){
          myRequst.open("Get","html-question.json",true);
            myRequst.send();
            javaScriptBtn.remove();
            htmlBtn.disabled = true;
            htmlBtn.style.opacity = .5;
    }
    // JavaScript Question
    javaScriptBtn.onclick =function(){
           myRequst.open("Get","javaScript-question.json",true);
            myRequst.send();
            htmlBtn.remove();
             javaScriptBtn.disabled = true;
             javaScriptBtn.style.opacity = .5;
    }
}

getQeustion();

function creatBulltes(num){

    questionCount.innerHTML = num;

    //  Creat spans
    for(let i = 0; i< num; i++){
        // Creat sapn
        let theBullte = document.createElement("span")
        //  check the First Span than Add Class to Styling
        if(i === 0){
            theBullte.className="on";
        }
        // Append theBullte to main Bullt Container
        bulltesContainer.appendChild(theBullte)
    }
}


function addQeustionData(obj,count){
 if(currentIndex < count){
       // Creat h2 question Title   
    let qeustionTitle = document.createElement("h2");

    // Creat qeustion Text 
    let questionText =document.createTextNode(obj.title);

    //  Append text to h2
    qeustionTitle.appendChild(questionText);
    // Append h2 to question Area
    questionArea.appendChild(qeustionTitle);
    //  Creat the Answer

    
    for (let i = 1 ; i <= 4 ; i++ ){
   
        //  Creat main Div
        let mainDiv = document.createElement("div")

        // Add class to main Div
        mainDiv.className="answer";
        
        // Creat the Radio Input
        let radioInput= document.createElement("input")

        // Add type + Name + ID + Data-Attribut
        radioInput.name="question";
        radioInput.type="radio";
        radioInput.id=`answer_${i}`;
        radioInput.dataset.answer = (obj[`answer_${i}`]) 
   
    
        // Make the First Input Checked
        if(i === 1){
            radioInput.checked = true;
        }
        
        // Creat the label
        let theLabel= document.createElement("label")
        // Add For Attribute
        theLabel.htmlFor = `answer_${i}`;

        // Creat label Text 
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);
        
       
        // Add the Text To label
        theLabel.appendChild(theLabelText)
        
        // Add input und Label to MAin Div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        
        //  Add mainDiv to Answer Area
        answerArea.appendChild(mainDiv)
    
    }      
           
 }else{
    false
 }
}

function checkAnswer(rAnswer,count){
    let answers = document.getElementsByName("question");
    let theChosenAnswer ;
          
    for(let i = 0; i < answers.length; i++){
        if(answers[i].checked){
             theChosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === theChosenAnswer){
        rightAnswers++ ;
    }
}
function handelBult(){
    let bulltesSpans = document.querySelectorAll(".bullets .spans span");
    let arrayofSpans= Array.from(bulltesSpans);
    arrayofSpans.forEach((span,index)=>{
        if(currentIndex === index){
            span.classList.add("on")
        }
    })
}

function showRsult(count) {
    let theResultes ;
if(currentIndex === count){
    questionArea.remove();
    answerArea.remove();
    submitBtn.remove();
    bulltes.remove();
    if(rightAnswers > (count / 2)){
        theResultes = `<span class="good">good </span> ${rightAnswers} From ${count} is Right Answer`;
    }else if(rightAnswers === count){
            theResultes = `<span class="perfect">perfect </span> All Answers is Right `
    }else{
                    theResultes = `<span class="bad">bad </span> ${rightAnswers} From ${count} is Right Answer you should lern more.  `

    }
    resultArea.innerHTML = theResultes
    resultArea.style.padding="10px"
    resultArea.style.backgroundColor="white"
 }
}

// countDown Timer

function countDownTimer(duration, count){
if(currentIndex < count){
    let minutes ,seconds;
    countDowninterval =setInterval(() => {
            minutes =parseInt(duration / 60);
            seconds =parseInt(duration % 60);

           minutes = minutes < 10 ? `0${minutes}` :minutes
           seconds = seconds < 10 ? `0${seconds}` :seconds

        countDown.innerHTML = `${minutes} : ${seconds}`
         if(--duration < 0){
            clearInterval(countDowninterval)
            submitBtn.click(); 
         }
    }, 1000);
 }
}

//  Shuffle Function
function shuffleEs6 (array){
  for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];

        // Swap
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
