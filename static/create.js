// db연결
let db = null;
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
});
DBOpenRequest.addEventListener("error", (e) => {
  console.error(e.target.error);
});

// 폼 제출
const form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const transaction = db.transaction(db.objectStoreNames, "readwrite");
  const objectStore = transaction.objectStore("personal_notes");
  const IDBRequest = objectStore.add({
    title: document.querySelector(".form__title").value,
    content: document.querySelector(".form__content").value,
    updated: Date.now(),
  });
  IDBRequest.addEventListener("error", (e) => {
    alert("데이터 삽입 실패");
  });
  IDBRequest.addEventListener("success", (e) => {
    console.log("삽입 완료", e);
    location.href = "/";
  });
});
