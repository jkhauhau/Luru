document.addEventListener('DOMContentLoaded', function() {
  // 이미지 업로드 관련 요소
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('textbook-image');
  const kanjiContainer = document.getElementById('kanji-container');
  
  // 파일 업로드 이벤트 처리
  uploadBtn.addEventListener('click', function() {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      processImage(file);
    } else {
      alert('이미지를 선택해주세요.');
    }
  });
  
  // 이미지 처리 함수
  function processImage(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      // 1. 업로드된 이미지 표시
      const imgElement = document.createElement('img');
      imgElement.src = e.target.result;
      imgElement.style.maxWidth = '100%';
      imgElement.style.marginBottom = '20px';
      
      // 이미지 로드 후 세트 생성 UI 표시
      imgElement.onload = function() {
        // 2. 기존 콘텐츠 지우기
        kanjiContainer.innerHTML = '';
        
        // 3. 이미지 표시
        kanjiContainer.appendChild(imgElement);
        
        // 4. 수동 입력 폼 추가
        const inputForm = createKanjiInputForm();
        kanjiContainer.appendChild(inputForm);
      };
    };
    
    reader.readAsDataURL(file);
  }
  
  // 수동 입력 폼 생성 함수
  function createKanjiInputForm() {
    const formDiv = document.createElement('div');
    formDiv.className = 'kanji-input-form';
    
    formDiv.innerHTML = `
      <h3>한자 세트 수동 입력</h3>
      <div class="form-group">
        <label for="kanji-input">한자:</label>
        <input type="text" id="kanji-input" placeholder="한자 입력">
      </div>
      <div class="form-group">
        <label for="kunyomi-input">훈독:</label>
        <input type="text" id="kunyomi-input" placeholder="훈독 입력">
      </div>
      <div class="form-group">
        <label for="onyomi-input">음독:</label>
        <input type="text" id="onyomi-input" placeholder="음독 입력">
      </div>
      <button id="add-kanji-btn">한자 세트 추가</button>
    `;
    
    // 폼 제출 이벤트 추가
    setTimeout(() => {
      const addButton = document.getElementById('add-kanji-btn');
      addButton.addEventListener('click', function() {
        const kanji = document.getElementById('kanji-input').value;
        const kunyomi = document.getElementById('kunyomi-input').value;
        const onyomi = document.getElementById('onyomi-input').value;
        
        if (kanji) {
          // 한자 세트 생성 및 표시
          const kanjiSet = createKanjiSet(kanji, kunyomi, onyomi);
          kanjiContainer.appendChild(kanjiSet);
          
          // 입력 필드 초기화
          document.getElementById('kanji-input').value = '';
          document.getElementById('kunyomi-input').value = '';
          document.getElementById('onyomi-input').value = '';
        } else {
          alert('한자를 입력해주세요.');
        }
      });
    }, 100);
    
    return formDiv;
  }
  
  // 한자 세트 생성 함수
  function createKanjiSet(kanji, kunyomi, onyomi) {
    const setDiv = document.createElement('div');
    setDiv.className = 'kanji-set';
    
    setDiv.innerHTML = `
      <div class="kanji-box">
        <div class="kanji">${kanji}</div>
        <button class="stroke-order-toggle">획순 보기</button>
        <div class="stroke-order-gif" style="display:none;">
          <img src="https://kakijun.com/wp-content/order/${kanji}.gif" alt="${kanji} 획순" onerror="this.src='https://placehold.co/200x200/lightgray/gray?text=GIF+없음';">
        </div>
      </div>
      
      <div class="kunyomi-box">
        <h3>훈독</h3>
        <div class="word-list">
          <div class="word">
            <ruby>${kanji}<rt>${kunyomi}</rt></ruby>
          </div>
        </div>
      </div>
      
      <div class="onyomi-box">
        <h3>음독</h3>
        <div class="word-list">
          <div class="word">
            <ruby>${kanji}<rt>${onyomi}</rt></ruby>
          </div>
        </div>
      </div>
    `;
    
    // 획순 토글 기능 추가
    setTimeout(() => {
      const toggleBtn = setDiv.querySelector('.stroke-order-toggle');
      const gifDiv = setDiv.querySelector('.stroke-order-gif');
      
      toggleBtn.addEventListener('click', function() {
        if (gifDiv.style.display === 'none') {
          gifDiv.style.display = 'block';
          toggleBtn.textContent = '획순 숨기기';
        } else {
          gifDiv.style.display = 'none';
          toggleBtn.textContent = '획순 보기';
        }
      });
    }, 100);
    
    return setDiv;
  }
});
