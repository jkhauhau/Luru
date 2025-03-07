// 기본 기능 구현
document.addEventListener('DOMContentLoaded', function() {
  // 이미지 업로드 버튼 이벤트 리스너
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('textbook-image');
  const kanjiContainer = document.getElementById('kanji-container');
  
  uploadBtn.addEventListener('click', function() {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // 이미지 표시
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.marginBottom = '20px';
        
        // 실제 분석 대신 예시 세트 표시
        const exampleSet = createExampleKanjiSet('木', 'き', 'もく');
        
        kanjiContainer.innerHTML = '';
        kanjiContainer.appendChild(img);
        kanjiContainer.appendChild(exampleSet);
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('이미지를 선택해주세요.');
    }
  });
  
  // 예시 한자 세트 생성 함수
  function createExampleKanjiSet(kanji, kunyomi, onyomi) {
    const setDiv = document.createElement('div');
    setDiv.className = 'kanji-set';
    
    // HTML 구조 생성
    setDiv.innerHTML = `
      <div class="kanji-box">
        <div class="kanji">${kanji}</div>
        <button class="stroke-order-toggle">획순 보기</button>
        <div class="stroke-order-gif" style="display:none;">
          <p>여기에 획순 GIF가 표시됩니다.</p>
        </div>
      </div>
      
      <div class="kunyomi-box">
        <h3>훈독</h3>
        <div class="word-list">
          <div class="word">
            <ruby>${kanji}<rt>${kunyomi}</rt></ruby>の<ruby>下<rt>した</rt></ruby>
          </div>
        </div>
      </div>
      
      <div class="onyomi-box">
        <h3>음독</h3>
        <div class="word-list">
          <div class="word">
            <ruby>${kanji}<rt>${onyomi}</rt></ruby><ruby>材<rt>ざい</rt></ruby>
          </div>
        </div>
      </div>
    `;
    
    // 획순 토글 기능 추가
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
    
    return setDiv;
  }
});
