document.addEventListener('DOMContentLoaded', function() {
  // CJK 호환 한자를 기본 CJK 통합 한자로 변환하는 함수
  function standardizeKanji(kanji) {
    // NFKC 정규화: 호환 문자를 정규 형태로 변환
    return kanji.normalize('NFKC');
  }
  
  // 이미지 업로드 관련 요소
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('textbook-image');
  const kanjiContainer = document.getElementById('kanji-container');
  
  // 저장된 한자 세트 배열
  let kanjiSets = [];
  
  // 로컬 스토리지에서 데이터 불러오기
  loadFromLocalStorage();
  
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
        // 2. 기존 콘텐츠 지우기 (입력 폼과 세트는 유지)
        // 이미지만 업데이트하는 방식으로 변경
        const existingImg = kanjiContainer.querySelector('img');
        if (existingImg) {
          kanjiContainer.replaceChild(imgElement, existingImg);
        } else {
          kanjiContainer.insertBefore(imgElement, kanjiContainer.firstChild);
        }
        
        // 입력 폼이 없으면 추가
        if (!document.querySelector('.kanji-input-form')) {
          const inputForm = createKanjiInputForm();
          kanjiContainer.appendChild(inputForm);
        }
        
        // 저장된 세트가 없으면 저장된 세트 표시
        renderKanjiSets();
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
        // 여기서 한자 정규화 적용
        const kanji = standardizeKanji(document.getElementById('kanji-input').value);
        const kunyomi = document.getElementById('kunyomi-input').value;
        const onyomi = document.getElementById('onyomi-input').value;
        
        if (kanji) {
          // 한자 세트 데이터 생성 및 저장 (정규화된 한자 저장)
          const kanjiSetData = {
            kanji: kanji, // 이미 정규화된 한자
            kunyomi: kunyomi,
            onyomi: onyomi,
            id: Date.now() // 고유 ID 생성
          };
          
          // 배열에 추가
          kanjiSets.push(kanjiSetData);
          
          // 로컬 스토리지에 저장
          saveToLocalStorage();
          
          // 화면에 표시
          const kanjiSetElement = createKanjiSetElement(kanjiSetData);
          kanjiContainer.appendChild(kanjiSetElement);
          
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
  
  // 한자 세트 HTML 요소 생성 함수
  function createKanjiSetElement(data) {
    // 한자 정규화 - 세트 생성 시에도 한 번 더 정규화
    const normalizedKanji = standardizeKanji(data.kanji);
    
    const setDiv = document.createElement('div');
    setDiv.className = 'kanji-set';
    setDiv.dataset.id = data.id; // 데이터 속성으로 ID 저장
    
    setDiv.innerHTML = `
      <div class="kanji-box">
        <div class="kanji">${normalizedKanji}</div>
        <button class="stroke-order-toggle">획순 보기</button>
        <div class="stroke-order-gif" style="display:none;">
          <img src="https://kakijun.com/wp-content/order/${normalizedKanji}.gif" alt="${normalizedKanji} 획순" onerror="this.src='https://placehold.co/200x200/lightgray/gray?text=GIF+없음';">
        </div>
        <button class="delete-set-btn" data-id="${data.id}">세트 삭제</button>
      </div>
      
      <div class="kunyomi-box">
        <h3>훈독</h3>
        <div class="word-list">
          <div class="word">
            <ruby>${normalizedKanji}<rt>${data.kunyomi}</rt></ruby>
          </div>
        </div>
      </div>
      
      <div class="onyomi-box">
        <h3>음독</h3>
        <div class="word-list">
          <div class="word">
            <ruby>${normalizedKanji}<rt>${data.onyomi}</rt></ruby>
          </div>
        </div>
      </div>
    `;
    
    // 이벤트 리스너 추가
    setTimeout(() => {
      // 획순 토글 기능
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
      
      // 삭제 버튼 기능
      const deleteBtn = setDiv.querySelector('.delete-set-btn');
      deleteBtn.addEventListener('click', function() {
        const setId = parseInt(this.dataset.id);
        deleteKanjiSet(setId);
      });
    }, 100);
    
    return setDiv;
  }
  
  // 한자 세트 삭제 함수
  function deleteKanjiSet(id) {
    // 배열에서 해당 ID를 가진 항목 찾기 및 제거
    kanjiSets = kanjiSets.filter(set => set.id !== id);
    
    // 로컬 스토리지 업데이트
    saveToLocalStorage();
    
    // DOM에서 해당 요소 제거
    const setElement = document.querySelector(`.kanji-set[data-id="${id}"]`);
    if (setElement) {
      setElement.remove();
    }
  }
  
  // 모든 한자 세트 렌더링 함수
  function renderKanjiSets() {
    // 기존 세트 요소들 제거 (입력 폼은 유지)
    const existingSets = document.querySelectorAll('.kanji-set');
    existingSets.forEach(set => set.remove());
    
    // 저장된 세트 데이터로 요소 생성 및 추가
    kanjiSets.forEach(setData => {
      const setElement = createKanjiSetElement(setData);
      kanjiContainer.appendChild(setElement);
    });
  }
  
  // 로컬 스토리지에 저장
  function saveToLocalStorage() {
    localStorage.setItem('kanjiSets', JSON.stringify(kanjiSets));
  }
  
  // 로컬 스토리지에서 불러오기
  function loadFromLocalStorage() {
    const savedSets = localStorage.getItem('kanjiSets');
    if (savedSets) {
      kanjiSets = JSON.parse(savedSets);
      
      // 저장된 데이터 정규화 (이전 데이터 호환성 보장)
      kanjiSets = kanjiSets.map(set => ({
        ...set,
        kanji: standardizeKanji(set.kanji)
      }));
      
      // 입력 폼 생성
      if (!document.querySelector('.kanji-input-form')) {
        const inputForm = createKanjiInputForm();
        kanjiContainer.appendChild(inputForm);
      }
      
      // 저장된 세트 표시
      renderKanjiSets();
    }
  }
});
