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

let blogsData = [
  {
    id: "blog1",
    title: "Dummy Blog",
    body: `Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.`,
    author: "Author",
  },
];

addbtn.addEventListener("click", () => {
  form.classList.add("show");
  if (!currentBlog.id) {
    titleFeild.value = "";
    descFeild.value = "";
    authorFeild.value = "";
  }
});

const renderBlogs = () =>{
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
}
const addButtons = () => {
  renderBlogs()
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
      let tempArray = [...blogsData];
      let remainingArray = tempArray.filter(
        (blog) => blog.id !== deletebtn.parentElement.parentElement.id
      );
      blogsData = remainingArray;
      renderBlogs()
    });
  });
};

addButtons();

formSubmit.addEventListener("click", () => {
  console.log(currentBlog);
  if (!currentBlog.id) {
    const obj = {
      id: `blog${blogsData.length + 1}`,
      title: titleFeild.value,
      body: descFeild.value,
      author: authorFeild.value,
    };
    blogsData.push(obj);
    addButtons();
    form.classList.remove("show");
  } else {
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
  }
});

formCancel.addEventListener("click", () => {
  currentBlog = {};
  form.classList.remove("show");
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js', {
    scope: '/',
    type: 'module'
  })
    .then(function (registration) {
      console.log('SW Registered:', registration);
    })
    .catch(function (error) {
      console.log('Register Failed:', error);
    });
}
else {
  console.log('Service workers are not supported.');
}



window.addEventListener("offline", function () {

});


window.addEventListener("online", function () {
  loadPosts();
});



