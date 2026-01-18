const titleInput = document.getElementById("titleInput");
const noteInput = document.getElementById("noteInput");
const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notesContainer");
const searchInput = document.getElementById("searchInput");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let sedangEditIndex = null;

// ===== TOAST CONFIG =====
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
});

// ===== RENDER =====
function renderCatatan(filter = "") {
  notesContainer.innerHTML = "";

  const hasilFilter = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(filter.toLowerCase()) ||
      note.content.toLowerCase().includes(filter.toLowerCase()),
  );

  if (hasilFilter.length === 0) {
    notesContainer.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:#9ca3af;">
        Tidak ada catatan
      </p>`;
    return;
  }

  hasilFilter.forEach((note, index) => {
    const card = document.createElement("div");
    card.className = "note-card";

    if (sedangEditIndex === index) {
      card.innerHTML = `
        <div class="edit-form">
          <input type="text" id="editTitle" value="${note.title}" />
          <textarea id="editContent">${note.content}</textarea>
          <div class="edit-actions">
            <button class="btn-outline" onclick="batalEdit()">Batal</button>
            <button class="btn-success" onclick="simpanEdit(${index})">Simpan</button>
          </div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="note-title">${note.title}</div>
        <div class="note-date">${note.date}</div>
        <div class="note-content">${note.content}</div>
        <div class="note-actions">
          <button class="btn-outline" onclick="mulaiEdit(${index})">Edit</button>
          <button class="btn-danger" onclick="hapusCatatan(${index})">Hapus</button>
        </div>
      `;
    }

    notesContainer.appendChild(card);
  });
}

// ===== TAMBAH =====
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const content = noteInput.value.trim();

  if (!title || !content) {
    Toast.fire({ icon: "error", title: "Judul dan catatan wajib diisi" });
    return;
  }

  notes.unshift({
    title,
    content,
    date: new Date().toLocaleString(),
  });

  simpanKeStorage();
  renderCatatan(searchInput.value);

  titleInput.value = "";
  noteInput.value = "";

  Toast.fire({ icon: "success", title: "Catatan berhasil ditambahkan" });
});

// ===== HAPUS =====
function hapusCatatan(index) {
  Swal.fire({
    title: "Hapus catatan?",
    text: "Catatan yang dihapus tidak bisa dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#ef4444",
  }).then((hasil) => {
    if (hasil.isConfirmed) {
      notes.splice(index, 1);
      simpanKeStorage();
      renderCatatan(searchInput.value);
      Toast.fire({ icon: "success", title: "Catatan berhasil dihapus" });
    }
  });
}

// ===== MODE EDIT =====
function mulaiEdit(index) {
  sedangEditIndex = index;
  renderCatatan(searchInput.value);
}

function batalEdit() {
  sedangEditIndex = null;
  renderCatatan(searchInput.value);
}

function simpanEdit(index) {
  const newTitle = document.getElementById("editTitle").value.trim();
  const newContent = document.getElementById("editContent").value.trim();

  if (!newTitle || !newContent) {
    Toast.fire({ icon: "error", title: "Form tidak boleh kosong" });
    return;
  }

  notes[index].title = newTitle;
  notes[index].content = newContent;
  notes[index].date = new Date().toLocaleString();

  sedangEditIndex = null;
  simpanKeStorage();
  renderCatatan(searchInput.value);

  Toast.fire({ icon: "success", title: "Catatan berhasil diperbarui" });
}

// ===== SEARCH =====
searchInput.addEventListener("input", (e) => {
  renderCatatan(e.target.value);
});

// ===== STORAGE =====
function simpanKeStorage() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

// INIT
renderCatatan();
