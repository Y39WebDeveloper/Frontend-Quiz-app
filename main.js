const container = document.querySelector("#root > section")
const navbar = document.getElementById("navbar")
const categoryList = document.getElementById("categoryList")
const title = document.getElementById("title")

let score = 0;
let currenIndex = 0;

// function yuyiu(){
//     let myRequest = new XMLHttpRequest();
//     myRequest.onreadystatechange = function(){
//         if(this.readyState === 4 && this.status === 200){
//             let data1 = JSON.parse(this.responseText);
//             let data = data1.quizzes
//             console.log(data)
//             generateCategory(data)
//             startQuiz(data)
//             console.log(categoryList)
//         }
//     }
//     myRequest.open("GET", "../data.json", true);
//     myRequest.send();
// }

// yuyiu()



fetch("data.json").then(data => data.json()).then(data => data.quizzes).then((data) => {
    console.log(data)
    console.log(categoryList)
    generateCategory(data)
    startQuiz(data)
})

function generateCategory(data) {
    console.log(data.length)
    for (let i = 0; i < data.length; i++) {
        let e = data[i];
        categoryList.innerHTML += `<li data-id="${i}" ><a class="d-flex flex-start hs bold" href="#"><div class="icon d-flex flex-center" style="background-color: ${e.color};"><img src="${e.icon}" alt=""></div>${e.title}</a></li>`
    }
}


function startQuiz(data) {
    let categories = document.querySelectorAll("#categoryList li")
    let quizObj;
    const start = (e) => {
        quizObj = data[e.currentTarget.dataset.id]
        console.log(quizObj)
        setTitle(title, quizObj)
        setQuiz(quizObj)
    }

    categories.forEach(category => {
        category.addEventListener("click", start)
    })
}
function setTitle(title, obj) {
    title.innerHTML = ` 
    <h3 class="hs bold d-flex flex-start">
        <div class="icon-title d-flex flex-center" style="background-color: ${obj.color};">
            <img src="${obj.icon}" alt="" />
        </div>
        <span>${obj.title}</span>
    </h3>
    `
}


function setQuiz(quizObj) {
    let questions = quizObj.questions[currenIndex];
    let count = quizObj.questions.length;
    document.getElementById("start").classList.remove("active")
    document.getElementById("score").classList.remove("active")
    document.getElementById("quiz").classList.add("active")

    document.getElementById("questionNumber").innerHTML = `Question ${currenIndex + 1} of ${count}`

    document.getElementById("questionText").innerHTML = questions.question
    setAnswers(questions)
    submitAnswer(questions.answer, questions);
    let nextBtn = document.getElementById("nextQuestion")
    nextBtn.addEventListener("click", () => {
        currenIndex++;
        setProgress(currenIndex, count-1)
        if (currenIndex > 9) {
            setProgress(0,0)
            document.getElementById("start").classList.remove("active")
            document.getElementById("quiz").classList.remove("active")
            document.getElementById("score").classList.add("active")

            document.getElementById("scoreTitle").innerHTML =
                `
            <div class="icon-title d-flex flex-center" style="background-color: ${quizObj.color};">
                <img src="${quizObj.icon}" alt="" />
            </div>
            <span>${quizObj.title}</span>
            `


            document.getElementById("result").innerHTML =
                `
            <span>${score}</span><p class="bm">out of ${count}</p>
            `
            document.getElementById("palyAgain").onclick = () => {
                document.getElementById("score").classList.remove("active")
                document.getElementById("quiz").classList.remove("active")
                document.getElementById("start").classList.add("active")
                currenIndex = 0;
                score = 0;
            }
        } else {
            console.log(quizObj.questions.length)
            setQuiz(quizObj)
        }
    })
}


function setAnswers(questions) {
    let answers = document.getElementById("answers")
    answers.innerHTML = ""
    for (let i = 0; i < 4; i++) {
        let answer = document.createElement("li")
        let inp = document.createElement("input")
        let lab = document.createElement("label")
        let d1 = document.createElement("div")
        let spn = document.createElement("span")
        let ind = document.createElement("div")
        ind.classList.add("indicator")

        let answerTxt = document.createTextNode(questions.options[i])

        inp.type = "radio"
        inp.name = "answer"
        inp.dataset.q = i
        inp.id = `anwser_${i}`

        lab.classList.add("d-flex", "flex-start", "hs", "bold")
        lab.htmlFor = `anwser_${i}`

        d1.classList.add("d-flex", "flex-start", "g-30")

        let spnCnt = document.createTextNode(String.fromCharCode(65 + i))
        spn.appendChild(spnCnt)
        d1.appendChild(spn)
        d1.appendChild(answerTxt)

        lab.appendChild(d1)
        lab.appendChild(ind)

        answer.appendChild(inp)
        answer.appendChild(lab)
        // let answer = `<li><input type="radio" name="answer" data-q=${i} id="answer_${i}"><label for="answer_${i}" class="d-flex flex-start hs bold"><div class="d-flex flex-start g-30"><span>${String.fromCharCode(65 + i)}</span>${questions.options[i]}</div><div class="indicator"></label></li>`
        answers.appendChild(answer)
    }
    answers.innerHTML += `
        <button id="submitAnswer" class="btn hs bold">Submit Answer</button>
        <button id="nextQuestion" class="btn hs bold hide">Next Question</button>
    `
}
function submitAnswer(rightAnswer, questions) {
    let submitBtn = document.getElementById("submitAnswer")
    submitBtn.addEventListener("click", function () { checkAnswer(rightAnswer, questions) })
}
function checkAnswer(rightAnswer, questions) {
    document.getElementById("submitAnswer").classList.add("hide")
    document.getElementById("nextQuestion").classList.remove("hide")
    let answers = document.querySelectorAll("li input[type='radio']")
    let choosenAnswer;
    let choosenIndex;
    let rightIndex;
    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            choosenAnswer = answers[i].dataset.q
            choosenIndex = i;
        }
    }

    for (let i = 0; i < questions.options.length; i++) {
        if (questions.options[i] == rightAnswer) {
            rightIndex = i;
        }
    }

    if (rightAnswer == questions.options[choosenAnswer]) {
        score++;
        answers[choosenIndex].nextElementSibling.classList.add("success")
    } else if(!choosenAnswer){
        answers[rightIndex].nextElementSibling.classList.add("success2")
    } else {
        answers[choosenIndex].nextElementSibling.classList.add("failed")
        answers[rightIndex].nextElementSibling.classList.add("success2")
    }
}

function setProgress(index, count){
    let progress = document.getElementById("progress")
    progress.style.width = `${(index/count)*100}%`
}

const darkmode = document.getElementById("darkmode");
darkmode.addEventListener("change",(e) => {
    if(e.currentTarget.checked){
        document.body.classList.add("dark")
    }else{
        document.body.classList.remove("dark")
    }
})