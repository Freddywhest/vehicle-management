const userPhoto = document.querySelector('[name="photo"]');
const fullName = document.querySelector('[name="fullName"]');

const curPass = document.querySelector('[name="curPass"]');
const newPass = document.querySelector('[name="newPass"]');
const conPass = document.querySelector('[name="conPass"]');

const userDetailsForm = document.forms.userDetailsForm;
const passwordForm = document.forms.passwordForm;


const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
const loadedBtn = (name) => {
    return name;
};

const APIRequest = async (url, formData) => {
    const request = await fetch(url, {
        method: 'POST',
        body: formData
    });
    const response = await request.json();
    return response;
}

userDetailsForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    this.querySelector('[type="submit"]').setAttribute('disabled', true);
    this.querySelector('[type="submit"]').innerHTML = loadingBtn;
    const formData = new FormData();
    formData.append('type', 'details');
    formData.append('fullName', fullName.value);
    formData.append('photo', userPhoto.files[0]);
    const response = await APIRequest('/api/profile', formData)
    if(response.message === 'Redirect'){
        document.location.href = "/logout";
        return;
    }

    if(!response.status){
        this.querySelector('#settingsErr').innerHTML = response.message;
        this.querySelector('#settingsErr').style.color = 'red'
        this.querySelector('[type="submit"]').removeAttribute('disabled');
        this.querySelector('[type="submit"]').innerHTML = loadedBtn('Save');
    }else{
        setTimeout(() => {
            this.querySelector('#settingsErr').innerHTML = response.message;
            this.querySelector('#settingsErr').style.color = 'green'
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn('Save');
        }, 1000);
    }

})

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
    formData.append('type', 'password');
    formData.append('curPass', curPass.value);
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
        this.querySelector('[type="submit"]').innerHTML = loadedBtn('Change Password');
    }else{
            this.querySelector('#settingsErr').innerHTML = response.message;
            this.querySelector('#settingsErr').style.color = 'green'
        setTimeout(() => {
            document.location.href = '/logout'
        }, 500);
    }

})