fetch("wordsList.txt")
.then(res => res.text())
.then(data => {


    const btnActiveAccent = document.querySelector(".accentActive");
    const btnDisableAccent = document.querySelector(".accentDisable");

    let accentVerify = JSON.parse(localStorage.getItem("accent"));

    if(accentVerify){
        btnDisableAccent.classList.add("disable");
        btnDisableAccent.style.background = "orange";
        btnDisableAccent.style.border = "1px solid #000";

        btnActiveAccent.style.background = "#c4c4c4";
        btnActiveAccent.style.border = "1px dashed #000";
    } else {
        btnDisableAccent.style.background = "#c4c4c4";
        btnDisableAccent.style.border = "1px dashed #000";

        btnActiveAccent.style.background = "orange";
        btnActiveAccent.style.border = "1px solid #000";
    }

    let wordList = data.split("\n");
    let filterWordList = wordList.filter(word => word.length >= 3 && word.length <= 15);
    let randomIndex = Math.floor(Math.random() * filterWordList.length);
    let wordToGuess = accentVerify ? filterWordList[randomIndex].toLocaleLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") : filterWordList[randomIndex].toLocaleLowerCase();
    let worldHidden = "";
    let wordLength = wordToGuess.length;
    
    for(let i = 0; i < wordLength; i++){
        worldHidden += "_";
    }
    
    document.querySelector(".word").textContent = worldHidden;

    // Delete accent


    btnActiveAccent.addEventListener("click", activeAccent);
    btnDisableAccent.addEventListener("click", disableAccent);
    
    function disableAccent(){
        btnDisableAccent.classList.add("disable")
        btnDisableAccent.style.background = "orange";
        btnDisableAccent.style.border = "1px solid #000";

        btnActiveAccent.style.background = "#c4c4c4";
        btnActiveAccent.style.border = "1px dashed #000";
        let verifyActive = true;

        location.reload();

        if(btnDisableAccent.classList.contains("disable")){
            localStorage.setItem("accent", JSON.stringify(verifyActive));
        }
    }

    function activeAccent(){
        btnDisableAccent.classList.remove("disable");
        btnDisableAccent.style.background = "#c4c4c4";
        btnDisableAccent.style.border = "1px dashed #000";

        btnActiveAccent.style.background = "orange";
        btnActiveAccent.style.border = "1px solid #000";
        let verifyActive = false;

        location.reload();

        if(!btnDisableAccent.classList.contains("disable")){
            localStorage.setItem("accent", JSON.stringify(verifyActive));
        }
    }


    let guessInput = document.querySelector(".btn_input");
    let submitButton = document.querySelector(".submit");
    let result = document.querySelector(".result");
    const restart = document.querySelector(".restart_word");
    const resetButton = document.querySelector(".button_reset");
    const confirmYes = document.querySelector(".confirm_yes");
    const confirmToCancel = document.querySelector(".confirm_to_cancel");
    const modalConfirm = document.querySelector(".container_modal_confirm");
    const overlayConfirm = document.querySelector(".overlay_modal_confirm");

    guessInput.addEventListener("keydown", (e) => {
        if(e.code === "Enter") {
            submitInput();
        }
    });
    
    submitButton.addEventListener("click", () => submitInput());
    
    restart.addEventListener("click", () => {
        location.reload();
        winnerModal.style.display = "none";
    })

    resetButton.addEventListener("click", () => {
        modalConfirm.style.display = "flex";
    })

    confirmYes.addEventListener("click", () => {
        counterTry = 0;
        counterWord = 0;
        localStorage.removeItem("try");
        localStorage.removeItem("word");
        location.reload();
    })

    confirmToCancel.addEventListener("click", () => {
        modalConfirm.style.display = "none";
    })


    overlayConfirm.addEventListener("click", () => {
        modalConfirm.style.display = "none";
    })


    let countTry = document.querySelector(".count_try");
    let countWord = document.querySelector(".count_word");

    let counterTry = 0;
    let counterWord = 0;
    
    let getTry = localStorage.getItem("try");
    let getWord = localStorage.getItem("word");
    
    if(getTry != null || getWord != null){
        countTry.textContent = getTry;
        countWord.textContent = getWord;
    } else {
        countTry.textContent = counterTry;
        countWord.textContent = counterWord;
    }
    
    let wordSplit = wordToGuess.split("");
    
    function followTried() {
        const addLetter = document.querySelector(".add_letter");
        const li = document.createElement("li");
        const guess = guessInput.value.toLocaleLowerCase();
        const letter = document.createTextNode(guess);

        li.appendChild(letter);
        li.classList.add("letter_tried");
        
        addLetter.appendChild(li);

        if(wordSplit.indexOf(guess) === -1){
            li.style.color = "rgb(143, 13, 13)";
        }
    }

    let letterTab = [];

    function submitInput() {
        
        let guess = guessInput.value.toLocaleLowerCase();
        let regex = /^[a-zA-ZáàâäãçéèêëíìîïñóòôöõúùûüýÿÁÀÂÄÃÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸ-]$/;

        if(guess.length > 1){
            result.textContent = "Veuillez saisir qu'une seul lettre.";
            result.style.opacity = "1";
    
        } else if (letterTab.indexOf(guess) !== -1) {
                result.textContent = "Vous avez déjà fais cette saisie.";
                result.style.opacity = "1";

        } else if(guess.length === 0) {
            result.textContent ="Champ vide. Veuillez saisir une lettre.";
            result.style.opacity = "1";
    
        } else if(guess != guess.match(regex)) {
            result.textContent = "Veuillez saisir que des lettres ou un '-'.";
            result.style.opacity = "1";

        } else {
            
            result.style.opacity = "0";

            followTried();
            letterTab.push(guess);

            for(let i = 0; i < wordLength; i++){
                if(wordToGuess[i] === guess){
                    worldHidden = worldHidden.substring(0, i) + guess + worldHidden.substring(i + 1);
                }
            }

            try{

                if(wordSplit.indexOf(guess) === -1){
                    if(getTry != null){
                        let newSetTry = 1 + parseInt(getTry) + counterTry++;
                        countTry.textContent = newSetTry;
                        localStorage.setItem("try", newSetTry);
                    } else {
                        countTry.textContent = 1 + counterTry++;
                        localStorage.setItem("try", counterTry)
                    }
                }

            } catch {
                alert("Erreur de récupération des scores")
            }

            document.querySelector(".word").textContent = worldHidden;
    
            const winnerModal = document.querySelector(".container_modal_win");
            const foundWord = document.querySelector(".found_word");

            try{
                if(worldHidden === wordToGuess){
                    if(getWord != null){
                        let newSetWord = parseInt(getWord) + 1;
                        countWord.textContent = newSetWord;
                        foundWord.textContent = wordToGuess;
                        winnerModal.style.display = "flex";
                        localStorage.setItem("word", newSetWord);
                    } else {
                        countWord.textContent = counterWord++;
                        foundWord.textContent = wordToGuess;
                        winnerModal.style.display = "flex";
                        localStorage.setItem("word", counterWord);
                    }
                }
            } catch {
                alert("Erreur de la récupération de 'victoire'")
            }
        }        

        guessInput.value = "";   
    }
});

const headerBtn = document.querySelector(".header_btn");
const infoModal = document.querySelector(".container_modal_info");
const iconClose = document.querySelector(".icon_close");
const overlayModalInfo = document.querySelector(".overlay_modal_info");

headerBtn.addEventListener("click", () => {
    infoModal.style.display = "flex";
})

iconClose.addEventListener("click", () => {
    infoModal.style.display = "none";
})

overlayModalInfo.addEventListener("click", () => {
    infoModal.style.display = "none";
})