if(new URL(document.location.href).pathname === '/login'){
    const form = document.forms.formAuthentication;
    const alertDiv = document.getElementById('alert');
    const loginBtn = document.getElementById('loginBtn');
    const loadingBtn = `<button class="btn btn-primary-outline d-grid w-100" type="button"><i class='bx bx-loader-alt bx-spin'></i></button>`;
    const loadedBtn = `<button class="btn btn-primary d-grid w-100" type="submit">Sign in</button>`;

    const alert = (alertColor, message) => {
        return `
            <div class="alert alert-${alertColor}" role="alert">
                ${message}
            </div>
        `
    }

    const logIn = async (formData) => {
        try {
            const fetchData = await fetch('/api/login', {
                method: 'POST',
                body: formData
            });
            const response = await fetchData.json();
            return response;
            
        } catch (err) {
            console.log(err);
        }

    }

    form.addEventListener('submit', async (e) => {
        loginBtn.innerHTML = loadingBtn;
        const formData = new FormData();
        e.preventDefault();
        const password = form.elements['password'].value;
        const email = form.elements['email'].value;

        formData.append('userEmail', email);
        formData.append('userPassword', password);
        const response = await logIn(formData);
        if(response.status){
            alertDiv.innerHTML = alert('success', 'Logging in, please wait.......');
            setTimeout(() => {
                document.location.href = response.url;
            }, 1000);
        }else{
            alertDiv.innerHTML = alert('danger', response.message);
            setTimeout(() => {
                loginBtn.innerHTML = loadedBtn;
            }, 200);
        }

    })
}else{
    const newPass = document.querySelector('[name="newPass"]');
    const conPass = document.querySelector('[name="conPass"]');

    const passwordForm = document.forms.passwordForm;


    const APIRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const response = await request.json();
        return response;
    }

    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = (name) => {
        return name;
    };
    
    passwordForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
    
        if(newPass.value !== conPass.value){
            this.querySelector('#settingsErr').innerHTML = "New Password and Confirm New Password should be same!";
            this.querySelector('#settingsErr').style.color = 'red'
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn('Change Password');
            return;
        }
    
        if(newPass.value.length < 8){
            this.querySelector('#settingsErr').innerHTML = "Password shouldn't be less than 8 characters!";
            this.querySelector('#settingsErr').style.color = 'red'
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn('Change Password');
            return;
        }
        const formData = new FormData();
        formData.append('type', 'setPassword');
        formData.append('newPass', newPass.value);
        formData.append('conPass', conPass.value);
        const response = await APIRequest('/api/profile', formData);
        if(response.message === 'Redirect'){
            document.location.href = "/logout";
            return;
        }
    
        if(!response.status){
            this.querySelector('#settingsErr').innerHTML = response.message;
            this.querySelector('#settingsErr').style.color = 'red'
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn('Set Password');
        }else{
                this.querySelector('#settingsErr').innerHTML = "Password successfully set!";
                this.querySelector('#settingsErr').style.color = 'green'
            setTimeout(() => {
                document.location.href = '/logout'
            }, 800);
        }
    
    })
}