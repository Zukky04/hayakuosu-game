const wordDisplay = document.getElementById('word-display');
const emojiButtonsContainer = document.getElementById('emoji-buttons');
const messageDisplay = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const startButton = document.getElementById('start-button');

let score = 0;
let timeLeft = 20;
let gameInterval;
let currentWord = '';
let currentCorrectEmoji = '';
let gameActive = false;
let level = 1;
let correctCount = 0;

// 文字と絵文字のペアデータ
const emojiData = [
    { word: 'りんご', emoji: '🍎' },
    { word: 'バナナ', emoji: '🍌' },
    { word: 'ぶどう', emoji: '🍇' },
    { word: 'いちご', emoji: '🍓' },
    { word: 'みかん', emoji: '🍊' },
    { word: 'レモン', emoji: '🍋' },
    { word: 'スイカ', emoji: '🍉' },
    { word: '桃', emoji: '🍑' },
    { word: 'さくらんぼ', emoji: '🍒' },
    { word: 'パイナップル', emoji: '🍍' },
    { word: '車', emoji: '🚗' },
    { word: '電車', emoji: '🚃' },
    { word: '飛行機', emoji: '✈️' },
    { word: '船', emoji: '🚢' },
    { word: '自転車', emoji: '🚲' },
    { word: '家', emoji: '🏠' },
    { word: '学校', emoji: '🏫' },
    { word: '病院', emoji: '🏥' },
    { word: '公園', emoji: '🌳' },
    { word: '犬', emoji: '🐶' },
    { word: '猫', emoji: '🐱' },
    { word: '鳥', emoji: '🐦' },
    { word: '魚', emoji: '🐟' },
    { word: 'パンダ', emoji: '🐼' },
    { word: 'ペンギン', emoji: '🐧' },
    { word: '太陽', emoji: '☀️' },
    { word: '月', emoji: '🌙' },
    { word: '星', emoji: '⭐️' },
    { word: '雨', emoji: '☔️' },
    { word: '雪', emoji: '❄️' },
    { word: '本', emoji: '📚' },
    { word: '鉛筆', emoji: '✏️' },
    { word: 'はさみ', emoji: '✂️' },
    { word: '時計', emoji: '⏰' },
    { word: 'カメラ', emoji: '📸' },
    { word: '電話', emoji: '📞' },
    { word: 'パソコン', emoji: '💻' },
    { word: 'テレビ', emoji: '📺' },
    { word: '音楽', emoji: '🎵' },
    { word: 'サッカー', emoji: '⚽️' },
    { word: '野球', emoji: '⚾️' },
    { word: 'バスケットボール', emoji: '🏀' },
    { word: 'テニス', emoji: '🎾' },
    { word: '水泳', emoji: '🏊' },
    { word: 'コーヒー', emoji: '☕️' },
    { word: 'ビール', emoji: '🍺' },
    { word: 'ケーキ', emoji: '🍰' },
    { word: 'ピザ', emoji: '🍕' },
    { word: '寿司', emoji: '🍣' },
];

// オーディオコントローラー
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playSound = (type) => {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);

        // 和音のための2つ目のオシレーター
        const osc2 = audioCtx.createOscillator();
        const gainNode2 = audioCtx.createGain();
        osc2.connect(gainNode2);
        gainNode2.connect(audioCtx.destination);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1000, audioCtx.currentTime); // 3度上
        osc2.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode2.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode2.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.3);

    } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
};

// ゲームの初期化
function initializeGame() {
    score = 0;
    timeLeft = 20;
    level = 1;
    correctCount = 0;
    scoreDisplay.textContent = `スコア: ${score}`;
    levelDisplay.textContent = `レベル: ${level}`;
    timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
    wordDisplay.textContent = '';
    emojiButtonsContainer.innerHTML = '';
    messageDisplay.textContent = '';
    startButton.disabled = false;
    gameActive = false;
}

// ゲーム開始
function startGame() {
    initializeGame();
    gameActive = true;
    startButton.disabled = true;
    generateNewRound();
    gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// 新しいラウンドの生成
function generateNewRound() {
    messageDisplay.textContent = '';
    const correctPair = emojiData[Math.floor(Math.random() * emojiData.length)];
    currentWord = correctPair.word;
    currentCorrectEmoji = correctPair.emoji;
    wordDisplay.textContent = currentWord;

    const emojis = [currentCorrectEmoji];

    // レベルに応じて選択肢の数を決定
    let numChoices = 3;
    if (level === 2) numChoices = 6;
    else if (level === 3) numChoices = 9;
    else if (level >= 4) numChoices = 12;

    while (emojis.length < numChoices) { // レベルに応じた数のボタンを表示
        const randomEmoji = emojiData[Math.floor(Math.random() * emojiData.length)].emoji;
        if (!emojis.includes(randomEmoji)) {
            emojis.push(randomEmoji);
        }
    }
    shuffleArray(emojis);

    emojiButtonsContainer.innerHTML = '';
    emojis.forEach(emoji => {
        const button = document.createElement('button');
        button.classList.add('emoji-button');
        button.textContent = emoji;
        button.style.animation = 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) backwards';
        button.style.animationDelay = `${Math.random() * 0.2}s`; // ランダムな遅延でポップ感を出す
        button.addEventListener('click', () => handleEmojiClick(emoji));
        emojiButtonsContainer.appendChild(button);
    });
}

// 絵文字ボタンクリック時の処理
function handleEmojiClick(clickedEmoji) {
    if (!gameActive) return;

    if (clickedEmoji === currentCorrectEmoji) {
        playSound('correct');

        // 指数関数的なスコア計算: 100 * (1.5 ^ (level - 1))
        const points = Math.floor(100 * Math.pow(1.5, level - 1));
        score += points;

        messageDisplay.textContent = `正解！ +${points}`;
        messageDisplay.style.color = '#28a745';

        // レベルアップ判定
        correctCount++;
        if (correctCount >= 3) {
            level++;
            correctCount = 0;
            levelDisplay.textContent = `レベル: ${level}`;
            // レベルアップ演出（簡易）
            messageDisplay.textContent = `レベルアップ！ Lv.${level}`;
            score += Math.floor(200 * Math.pow(1.5, level - 1)); // ボーナスも増やす
        }
    } else {
        playSound('wrong');
        score -= 50; // 不正解で50点減点
        messageDisplay.textContent = '不正解...';
        messageDisplay.style.color = '#e74c3c';
    }
    scoreDisplay.textContent = `スコア: ${score}`;
    generateNewRound();
}

// ゲーム終了
function endGame() {
    gameActive = false;
    clearInterval(gameInterval);
    wordDisplay.textContent = 'ゲーム終了！';
    emojiButtonsContainer.innerHTML = '';
    messageDisplay.textContent = `最終スコア: ${score}点`;
    startButton.textContent = 'もう一度プレイ';
    startButton.disabled = false;
}

// 配列をシャッフルするヘルパー関数 (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// イベントリスナー
startButton.addEventListener('click', () => {
    playSound('click');
    startGame();
});

// ページロード時にゲームを初期化
initializeGame();
