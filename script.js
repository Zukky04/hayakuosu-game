const wordDisplay = document.getElementById('word-display');
const emojiButtonsContainer = document.getElementById('emoji-buttons');
const messageDisplay = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

let score = 0;
let timeLeft = 20;
let gameInterval;
let currentWord = '';
let currentCorrectEmoji = '';
let gameActive = false;

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

// ゲームの初期化
function initializeGame() {
    score = 0;
    timeLeft = 20;
    scoreDisplay.textContent = `スコア: ${score}`;
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
    while (emojis.length < 6) { // 6つのボタンを表示
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
        button.addEventListener('click', () => handleEmojiClick(emoji));
        emojiButtonsContainer.appendChild(button);
    });
}

// 絵文字ボタンクリック時の処理
function handleEmojiClick(clickedEmoji) {
    if (!gameActive) return;

    if (clickedEmoji === currentCorrectEmoji) {
        score += 100; // 正解で100点加算
        messageDisplay.textContent = '正解！';
        messageDisplay.style.color = '#28a745';
    } else {
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
startButton.addEventListener('click', startGame);

// ページロード時にゲームを初期化
initializeGame();
