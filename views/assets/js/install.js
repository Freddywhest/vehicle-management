const dbUser = document.querySelector('[data-db="user"]'),
      dbHost = document.querySelector('[data-db="host"]'),
      dbPass = document.querySelector('[data-db="pass"]'),
      dbName = document.querySelector('[data-db="name"]'),
      userName = document.querySelector('[data-user="name"]'),
      userPass = document.querySelector('[data-user="pass"]'),
      userConPass = document.querySelector('[data-user="conpass"]'),
      userEmail = document.querySelector('[data-user="email"]'),
      siteName = document.querySelector('[data-site="name"]'),
      siteLogo = document.querySelector('[data-site="logo"]'),
      installBtn = document.querySelector('[data-install="btn"]'),
      errorDiv = document.querySelector('[class="alert-box red"]'),
      imgPreview = document.querySelector('[data-site="img-preview"]');

let form;

const errorMsg = (message) => {
    errorDiv.innerText = message;
    setTimeout(() => {
        errorDiv.style.display = 'block';
        
    }, 10);
}

const request = {
    install : () => {
        form = new FormData();
        form.append('dbUser', dbUser.value);
        form.append('dbHost', dbHost.value);
        form.append('dbPass', dbPass.value);
        form.append('dbName', dbName.value);
        form.append('userName', userName.value);
        form.append('userPass', userPass.value);
        form.append('conUserPass', userConPass.value);
        form.append('userEmail', userEmail.value);
        form.append('siteName', siteName.value);
        form.append('siteLogo', siteLogo.files[0]);
        form.append('install', true);

        fetch('/installation', {
            method: 'POST',
            body: form
        })
        .then(response => response.json())
        .then((result) => {
            console.log(result);
            if(result.status){
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  })
                customAlert.alert(result.message);
                setTimeout(() => {
                    location.href = '/';
                }, 4000);
            }else{
                errorMsg(result.message);
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                    errorDiv.innerText = '';
                }, 3500);
            }
        })
        .catch(err => alert(err));
    }
}

installBtn.addEventListener('click', (e) => {
    e.preventDefault();
    request.install();
});

siteLogo.addEventListener('change', ()=> {
    const [file] = siteLogo.files;
    imgPreview.src = URL.createObjectURL(file);
})