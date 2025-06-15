window.addEventListener('DOMContentLoaded', () => {
  const symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🥝', '🍍', '🍓'];
  let cards = [];
  let flipped = [];
  let matched = 0;
  let score = 0;
  let isBoardLocked = false;
  let timerInterval;
  let timeRemaining = 120;

  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');

  window.startGame = function () {
    const board = document.getElementById('game-board');
    board.innerHTML = '';
    matched = 0;
    score = 0;
    flipped = [];
    isBoardLocked = false;
    timeRemaining = 120;
    updateScore();
    updateTimerDisplay();

    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);

    const shuffled = [...symbols, ...symbols].sort(() => 0.5 - Math.random());

    cards = shuffled.map((symbol, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.symbol = symbol;
      card.dataset.index = index;
      card.innerText = '';
      card.addEventListener('click', flipCard);
      board.appendChild(card);
      return card;
    });
  };

  function updateScore() {
    scoreDisplay.textContent = score;
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function updateTimer() {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      alert('⏰ Tempo scaduto!');
      disableAllCards();
    }
  }

  function disableAllCards() {
    cards.forEach(card => card.removeEventListener('click', flipCard));
  }

  function flipCard(e) {
    if (isBoardLocked) return;

    const card = e.target;

    if (
      card.classList.contains('flipped') ||
      card.classList.contains('matched') ||
      flipped.length === 2
    ) return;

    card.classList.add('flipped');
    card.innerText = card.dataset.symbol;
    flipped.push(card);

    if (flipped.length === 2) {
      checkMatch();
    }
  }

  function checkMatch() {
    const [card1, card2] = flipped;

    if (card1.dataset.symbol === card2.dataset.symbol) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      card1.removeEventListener('click', flipCard);
      card2.removeEventListener('click', flipCard);
      flipped = [];
      score++;
      matched++;
      updateScore();

      if (matched === symbols.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
          alert(`🎉 Hai vinto! Punteggio: ${score}`);
        }, 300);
      }
    } else {
      isBoardLocked = true;

      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.innerText = '';
        card2.innerText = '';
        flipped = [];
        isBoardLocked = false;
      }, 1000);
    }
  }
});