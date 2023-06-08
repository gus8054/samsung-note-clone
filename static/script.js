const count = document.querySelector(".index__header__count");
// db연결
let db = null;
let noteArray = null;
const DBOpenRequest = indexedDB.open("notes");
DBOpenRequest.addEventListener("upgradeneeded", (e) => {
  db = e.target.result;
  db.createObjectStore("personal_notes", {
    keyPath: "id",
    autoIncrement: true,
  });
});
DBOpenRequest.addEventListener("success", (e) => {
  db = e.target.result;
  const transaction = db.transaction(db.objectStoreNames, "readwrite");
  const objectStore = transaction.objectStore("personal_notes");
  const IDBRequest = objectStore.getAll();
  IDBRequest.addEventListener("error", (e) => {
    alert("데이터 불러오기 실패");
  });
  IDBRequest.addEventListener("success", (e) => {
    console.log("데이터 로드 완료");
    noteArray = e.target.result;
    const sortType = localStorage.getItem("sortType") ?? "만든 날짜 순";
    initSortReverse();
    setSortType(sortType);
    const sortTypeText = document.querySelector(".sort__type__text");
    sortTypeText.textContent = sortType;
    paint(noteArray);
  });
});
DBOpenRequest.addEventListener("error", (e) => {
  console.error(e.target.error);
});

function paint(noteArray) {
  // 이전 노트들이 있다면 제거
  const oldNoteSection = document.querySelector("section");
  if (oldNoteSection) oldNoteSection.parentNode.removeChild(oldNoteSection);
  // 개수 업데이트
  count.textContent = noteArray.length;
  // 노트들을 추가
  const noteSection = document.createElement("section");
  noteSection.classList.add("note__container");
  noteArray.map(({ id, title, content, updated }) => {
    noteSection.insertAdjacentHTML(
      "beforeend",
      noteHTML(id, title, content, updated)
    );
  });
  const main = document.querySelector("main");
  main.appendChild(noteSection);
}
function noteHTML(id, title, content, updated) {
  return `<div class="note">
  <a href="/view?id=${id}" class="note__thumbnail">
    <div class="note__thumbnail__innner">${content}</div>
  </a>
  <div class="note__title">${title}</div>
  <div class="note__updated">${new Intl.DateTimeFormat("ko-KR").format(
    updated
  )}</div>
</div>`;
}

const reverseBtn = document.querySelector(".sort__direction");
reverseBtn.addEventListener("click", (e) => {
  const i = e.currentTarget.querySelector("i");
  if (i.classList.contains("bx-down-arrow-alt")) {
    i.classList.replace("bx-down-arrow-alt", "bx-up-arrow-alt");
  } else {
    i.classList.replace("bx-up-arrow-alt", "bx-down-arrow-alt");
  }
  noteArray = noteArray.toReversed();
  paint(noteArray);
});

const sortTypeBtn = document.querySelector(".sort__type");
sortTypeBtn.addEventListener("click", (e) => {
  const sortType = localStorage.getItem("sortType") ?? "만든 날짜 순";
  let setting = null;
  switch (sortType) {
    case "제목":
      setting = { title: true };
      break;
    case "만든 날짜 순":
      setting = { created: true };
      break;
    case "수정 날짜 순":
      setting = { updated: true };
      break;
  }
  e.currentTarget.parentElement.insertAdjacentHTML(
    "beforeend",
    sortTypeListHTML(setting)
  );
  const sortTypeList = document.querySelector(".sort__type__list");
  sortTypeList.addEventListener("click", (e) => {
    console.log(e.target.tagName);
    if (e.target.tagName === "BUTTON") {
      const sortType = e.target.textContent.trim();
      const sortTypeText = document.querySelector(".sort__type__text");
      sortTypeText.textContent = sortType;
      localStorage.setItem("sortType", sortType);
      setSortType(sortType);
      initSortReverse();
      paint(noteArray);
      e.currentTarget.parentNode.removeChild(e.currentTarget);
    }
  });
});
function setSortType(typeString) {
  switch (typeString) {
    case "제목":
      noteArray = noteArray.toSorted((prev, next) => {
        if (prev.title < next.title) return -1;
        else if (prev.title > next.title) return 1;
        else return 0;
      });
      break;
    case "만든 날짜 순":
      noteArray = noteArray.toSorted((prev, next) => prev.id - next.id);
      break;
    case "수정 날짜 순":
      noteArray = noteArray.toSorted(
        (prev, next) => prev.updated - next.updated
      );
      break;
  }
}
function sortTypeListHTML({ title = false, created = false, updated = false }) {
  return `<div class="sort__type__list">
  <button class="sort__type__item ${
    title ? "sort__type__item__checked" : ""
  }">제목 ${title ? '<i class="bx bx-check"></i>' : ""}</button>
  <button class="sort__type__item ${
    created ? "sort__type__item__checked" : ""
  }">
    만든 날짜 순 ${created ? '<i class="bx bx-check"></i>' : ""}
  </button>
  <button class="sort__type__item ${
    updated ? "sort__type__item__checked" : ""
  }">수정 날짜 순 ${updated ? '<i class="bx bx-check"></i>' : ""}</button>
  </div>`;
}
function initSortReverse() {
  const reverseBtn = document.querySelector(".sort__direction");
  const i = reverseBtn.querySelector("i");
  if (i.classList.contains("bx-up-arrow-alt")) {
    i.classList.replace("bx-up-arrow-alt", "bx-down-arrow-alt");
  }
}
