"use strict";
document.addEventListener("DOMContentLoaded", function (e) {
  {
    document.querySelector("#formAccountDeactivation");
    let e = document.getElementById("uploadedAvatar");
    const t = document.querySelector(".account-file-input"),
      c = document.querySelector(".account-image-reset");
    if (e) {
      const n = e.src;
      (t.onchange = () => {
        t.files[0] && (e.src = window.URL.createObjectURL(t.files[0]));
      }),
        (c.onclick = () => {
          (t.value = ""), (e.src = n);
        });
    }
    return;
  }
});
