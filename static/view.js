const inputTitle = document.querySelector(".form__title");
const textarea = document.querySelector(".form__content");
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
  const transaction = db.transaction(db.objectStoreNames, "readwrite");
  const objectStore = transaction.objectStore("personal_notes");
  const id = Number(getIdParam());
  const IDBRequest = objectStore.get(id);
  IDBRequest.addEventListener("error", (e) => {
    alert("데이터 불러오기 실패");
  });
  IDBRequest.addEventListener("success", (e) => {
    console.log("데이터 로드 완료");
    const note = e.target.result;
    inputTitle.value = note.title;
    textarea.value = note.content;
  });
});
DBOpenRequest.addEventListener("error", (e) => {
  console.error(e.target.error);
});
// id 파라미터 가져오기
function getIdParam() {
  const url = new URL(location.href);
  return url.searchParams.get("id");
}
// 폼 제출
const form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = new URL(location.href).searchParams.get("id");
  location.href = `/edit?id=${id}`;
});
