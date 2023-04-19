import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzTL43Q8dXqNVudsCWeS2dZNTEO9OL1ng",
  authDomain: "pwaproject-6da4c.firebaseapp.com",
  projectId: "pwaproject-6da4c",
  storageBucket: "pwaproject-6da4c.appspot.com",
  messagingSenderId: "299642393614",
  appId: "1:299642393614:web:f8a7c61b74a90623de985f",
  measurementId: "G-FGZ9CCRWGV",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addbtn = document.getElementById("add-btn");
const titleFeild = document.getElementById("form-title");
const descFeild = document.getElementById("form-desc");
const authorFeild = document.getElementById("form-author");
const formSubmit = document.getElementById("form-submit-btn");
const formCancel = document.getElementById("form-cancel-btn");
const blogs = document.querySelector(".blogs-wrapper");
const form = document.querySelector(".form-modal");
let editBtns;
let deleteBtns;
let currentBlog = {};

let blogsData = [];

const dbCollection = collection(db, "blogsData");
getDocs(dbCollection)
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
      const obj = { id: doc.id, ...doc.data() };
      blogsData.push(obj);
    });
    addButtons();
  })
  .catch((error) => {
    console.log("Error:", error);
  });

addbtn.addEventListener("click", () => {
  form.classList.add("show");
  if (!currentBlog.id) {
    titleFeild.value = "";
    descFeild.value = "";
    authorFeild.value = "";
  }
});

const renderBlogs = () => {
  blogs.innerHTML = "";
  blogsData.forEach((blog) => {
    const blogEl = document.createElement("div");
    blogEl.classList.add("blog");
    blogEl.setAttribute("id", blog.id);
    const title = document.createElement("h2");
    title.classList.add("blog-title");
    title.textContent = blog.title;
    const desc = document.createElement("p");
    desc.classList.add("desc");
    desc.textContent = blog.body;
    const author = document.createElement("p");
    author.classList.add("author");
    author.textContent = blog.author;
    const buttons = document.createElement("div");
    buttons.classList.add("btns-wrapper");
    const editbtn = document.createElement("button");
    editbtn.classList.add("btn");
    editbtn.classList.add("edit-btn");
    editbtn.textContent = "Edit Blog";
    const deletebtn = document.createElement("button");
    deletebtn.classList.add("btn");
    deletebtn.classList.add("delete-btn");
    deletebtn.textContent = "Delete Blog";

    buttons.append(editbtn);
    buttons.append(deletebtn);

    blogEl.append(title);
    blogEl.append(desc);
    blogEl.append(author);
    blogEl.append(buttons);
    blogs.append(blogEl);
  });
};
const addButtons = () => {
  renderBlogs();
  editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((editbtn) => {
    editbtn.addEventListener("click", () => {
      let selectedBlog = blogsData.filter(
        (blog) => blog.id == editbtn.parentElement.parentElement.id
      );
      currentBlog = selectedBlog[0];
      titleFeild.value = currentBlog.title;
      descFeild.value = currentBlog.body;
      authorFeild.value = currentBlog.author;
      form.classList.add("show");
    });
  });
  deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((deletebtn) => {
    deletebtn.addEventListener("click", () => {
      const dbDoc = doc(db, "blogsData", deletebtn.parentElement.parentElement.id);
      deleteDoc(dbDoc)
        .then(() => {
          console.log("Successfully deleted!");
          let tempArray = [...blogsData];
          let remainingArray = tempArray.filter(
            (blog) => blog.id !== deletebtn.parentElement.parentElement.id
          );
          blogsData = remainingArray;
          renderBlogs();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
};

formSubmit.addEventListener("click", () => {
  console.log(currentBlog);
  if (!currentBlog.id) {
    addDoc(dbCollection, {
      title: titleFeild.value,
      body: descFeild.value,
      author: authorFeild.value,
    })
      .then((docRef) => {
        console.log("Success: ", docRef.id);
        const obj = {
          id: docRef.id,
          title: titleFeild.value,
          body: descFeild.value,
          author: authorFeild.value,
        };
        blogsData.push(obj);
        addButtons();
        form.classList.remove("show");
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  } else {
    const docRef = doc(db, "blogsData", currentBlog.id);
    updateDoc(docRef, {
      title: titleFeild.value,
      body: descFeild.value,
      author: authorFeild.value,
    })
      .then(() => {
        const selectedBlogIndex = blogsData.findIndex(
          (blog) => blog.id == currentBlog.id
        );
        const selectedBlog = blogsData[selectedBlogIndex];
        selectedBlog.title = titleFeild.value;
        selectedBlog.body = descFeild.value;
        selectedBlog.author = authorFeild.value;

        blogsData[selectedBlogIndex] = selectedBlog;
        addButtons();
        currentBlog = {};
        form.classList.remove("show");
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }
});

formCancel.addEventListener("click", () => {
  currentBlog = {};
  form.classList.remove("show");
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js", {
      scope: "/",
      type: "module",
    })
    .then(function (registration) {
      console.log("SW Registered:", registration);
    })
    .catch(function (error) {
      console.log("Register Failed:", error);
    });
} else {
  console.log("Service workers are not supported.");
}

window.addEventListener("offline", function () {});

window.addEventListener("online", function () {
  loadPosts();
});
