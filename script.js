//URL на API за произволни цитати
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

//Показване на произволен цитат
const renderNewQuote = async () => {
  //Извличане на съдържание от URL
  const response = await fetch(quoteApiUrl);

  //Съхраняване на отговора
  let data = await response.json();

  //Достъп до цитата
  quote = data.content;

  //Масив от знаци в цитата
  let arr = quote.split("").map((value) => {
    //Увиваме знаците в span таг
    return "<span class='quote-chars'>" + value + "</span>";
  });
  //Присъединяване към масив за показване
  quoteSection.innerHTML += arr.join("");
};

//Логика за сравняване на въведени думи с цитат
userInput.addEventListener("input", () => {
  let quoteChars = document.querySelectorAll(".quote-chars");
  //Създаване на масив от получени span тагове
  quoteChars = Array.from(quoteChars);

  //Масив от въведените знаци на потребителя
  let userInputChars = userInput.value.split("");

  //Преминава през всеки знак в кавичките
  quoteChars.forEach((char, index) => {
    //Проверява дали даден знак от цитата съвпада с даден знак от въведените
    if (char.innerText == userInputChars[index]) {
      char.classList.add("success");
    }
    //Ако потребителят не е въвел нищо или не е изтрил символ
    else if (userInputChars[index] == null) {
      //Премахване на клас, ако има такъв
      if (char.classList.contains("success")) {
        char.classList.remove("success");
      } else {
        char.classList.remove("fail");
      }
    }
    //Ако потребителят въведе грешен знак
    else {
      //Проверява дали вече сме добавили клас fail
      if (!char.classList.contains("fail")) {
        //Увеличаване на грешки
        mistakes += 1;
        char.classList.add("fail");
      }
      //Показване на грешки
      document.getElementById("mistakes").innerText = mistakes;
    }
    //Връща true, ако всички знаци са въведени правилно
    let check = quoteChars.every((element) => {
      return element.classList.contains("success");
    });
    //Край на теста, ако всички символи са правилни
    if (check) {
      displayResult();
    }
  });
});

//Актуализиране на таймера на екрана
function updateTimer() {
  if (time == 0) {
    //Приключване на теста, ако таймерът достигне 0
    displayResult();
  } else {
    document.getElementById("timer").innerText = --time + "s";
  }
}

//Задаване на таймер
const timeReduce = () => {
  time = 60;
  timer = setInterval(updateTimer, 1000);
};

//Край на теста
const displayResult = () => {
  //Показване на резултата в div
  document.querySelector(".result").style.display = "block";
  clearInterval(timer);
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  let timeTaken = 1;
  if (time != 0) {
    timeTaken = (60 - time) / 100;
  }
  document.getElementById("wpm").innerText =
    (userInput.value.length / 5 / timeTaken).toFixed(2) + " wpm";
  document.getElementById("accuracy").innerText =
    Math.round(
      ((userInput.value.length - mistakes) / userInput.value.length) * 100
    ) + " %";
};

//Начало на теста
const startTest = () => {
  mistakes = 0;
  timer = "";
  userInput.disabled = false;
  timeReduce();
  document.getElementById("start-test").style.display = "none";
  document.getElementById("stop-test").style.display = "block";
};

window.onload = () => {
  userInput.value = "";
  document.getElementById("start-test").style.display = "block";
  document.getElementById("stop-test").style.display = "none";
  userInput.disabled = true;
  renderNewQuote();
};