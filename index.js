fetch("wordsList.txt")
.then(res => res.text())
.then(data => {

    let listWord = data.split("\n");
    let randomIndex = Math.floor(Math.random() * listWord.length);
    const wordToGuess = listWord[randomIndex].toLocaleLowerCase();
    let wordLength = wordToGuess.length;
    let worldHidden = "";

    for(let i = 0; i < wordLength; i++){
        worldHidden += "_";
    }

    document.querySelector(".word").textContent = worldHidden;

    let guessInput = document.querySelector(".btn_input");
    let submitButton = document.querySelector(".submit");
    let result = document.querySelector(".result");
    const restart = document.querySelector(".restart_word");
    const resetButton = document.querySelector(".button_reset");
    const confirmYes = document.querySelector(".confirm_yes");
    const confirmToCancel = document.querySelector(".confirm_to_cancel");
    const modalConfirm = document.querySelector(".container_confirm_modal");
    const overlayConfirm = document.querySelector(".overlay_confirm_modal");
    
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
    
    function submitInput() {
        
        let guess = guessInput.value.toLocaleLowerCase();
        let regex = /^[a-zA-ZáàâäãçéèêëíìîïñóòôöõúùûüýÿÁÀÂÄÃÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸ-]$/
    
        if(guess.length > 1){
            result.textContent = "Veuillez saisir qu'une seul lettre.";
            result.style.opacity = "1";
    
        } else if(guess.length === 0) {
            result.textContent ="Champ vide. Veuillez saisir une lettre.";
            result.style.opacity = "1";
    
        } else if(guess != guess.match(regex)) {
            result.textContent = "Veuillez saisir que des lettres";
            result.style.opacity = "1";

        } else {
            
            result.style.opacity = "0";

            for(let i = 0; i < wordLength; i++){
                if(wordToGuess[i] === guess){
                    worldHidden = worldHidden.substring(0, i) + guess + worldHidden.substring(i + 1);
                }
            }

            try{
                if(getTry != null){
                    let newSetTry = 1 + parseInt(getTry) + counterTry++;
                    countTry.textContent = newSetTry;
                    localStorage.setItem("try", newSetTry);
                    
                } else {
                    countTry.textContent = 1 + counterTry++;
                    localStorage.setItem("try", counterTry)
                }
            } catch {
                alert("Erreur de récupération des scores")
            }

            document.querySelector(".word").textContent = worldHidden;
    
        const winnerModal = document.querySelector(".container_modal_win");

            try{
                if(worldHidden === wordToGuess){
                    if(getWord != null){
                        let newSetWord = parseInt(getWord) + 1;
                        countWord.textContent = newSetWord;
                        winnerModal.style.display = "flex";
                        localStorage.setItem("word", newSetWord);
                    } else {
                        countWord.textContent = counterWord++;
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

const infoBtn = document.querySelector(".info_btn");
const infoModal = document.querySelector(".container_modal_info");
const iconClose = document.querySelector(".icon_close");
const overlayModalInfo = document.querySelector(".overlay_modal_info");

infoBtn.addEventListener("click", () => {
    infoModal.style.display = "flex";
})

iconClose.addEventListener("click", () => {
    infoModal.style.display = "none";
})

overlayModalInfo.addEventListener("click", () => {
    infoModal.style.display = "none";
})
