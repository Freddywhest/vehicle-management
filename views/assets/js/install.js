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
      imgPreview = document.querySelector('[data-site="img-preview"]'),
      inputs = document.querySelectorAll('input');

let form;

const errorMsg = (message) => {
    errorDiv.innerText = message;
    setTimeout(() => {
        errorDiv.style.display = 'block';
        
    }, 10);
}

const request = {
    install : async() => {
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

        try {
            const postRequest = await fetch('/installation', {
                method: 'POST',
                body: form
            });
            const response = await postRequest.json();
            if(response.status){
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                    })
                customAlert.alert(response.message);
                setTimeout(() => {
                    location.href = '/';
                }, 3000);
            }else{
                errorMsg(response.message);
            }
        } catch (e) {
            alert(e.message);
        }
       
    }
}

document.addEventListener('DOMContentLoaded', () => {
    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            errorDiv.style.display = 'none';
            errorDiv.innerText = '';
        })
    })
})

installBtn.addEventListener('click', async function (e){
    e.preventDefault();
    this.setAttribute('disabled', true);
    this.innerText = 'Loading.....';
    await request.install();
    this.removeAttribute('disabled');
    this.innerText = 'Install';
});

siteLogo.addEventListener('change', ()=> {
    const [file] = siteLogo.files;
    imgPreview.src = URL.createObjectURL(file);
})