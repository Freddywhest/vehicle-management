
if(new URL(document.location.href).pathname === '/vehicles'){
    const vehicleForm = document.forms.vehicleForm;
    const convertedDiv = document.getElementById('convertedDiv');
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Add Vehicle`;

    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }

    let converted;
    document.querySelectorAll('[name=convertedRadio]').forEach(function (radio){
        radio.addEventListener('change', function (e){
            if(this.value === 'converted'){
                convertedDiv.innerHTML = `
                <div class="row g-2 mb-3">
                    <div class="mb-0">
                        <label for="other" class="form-label"> What was it converted to?</label>
                        <textarea name="converted" id="converted" class="form-control" required></textarea>
                    </div>
                </div>`;
                converted = document.querySelector('[name="converted"]');
            }else{
                convertedDiv.innerHTML = '';
            }
        })
    })
    vehicleForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
        const photo = this.querySelector('[name="photo"]');
        const model = this.querySelector('[name="model"]');
        const regisNo = this.querySelector('[name="regisNo"]');
        const type = this.querySelector('[name="type"]');
        const engine = this.querySelector('[name="engine"]');
        const trans = this.querySelector('[name="trans"]');
        const axle = this.querySelector('[name="axle"]');
        const paint = this.querySelector('[name="paint"]');
        const trim = this.querySelector('[name="trim"]');
        const color = this.querySelector('[name="color"]');
        const chasis = this.querySelector('[name="chasis"]');
        const drivenBy = this.querySelector('[name="drivenBy"]');
        const other = this.querySelector('[name="other"]');

        const formData = new FormData();
        formData.append('photo', photo.files[0]);
        formData.append('model', model.value);
        formData.append('regisNo', regisNo.value);
        formData.append('type', type.value);
        formData.append('engine', engine.value);
        formData.append('trans', trans.value);
        formData.append('axle', axle.value);
        formData.append('paint', paint.value);
        formData.append('trim', trim.value);
        formData.append('color', color.value);
        formData.append('chasis', chasis.value);
        formData.append('converted', converted ? converted.value : 'unconverted');
        formData.append('drivenBy', drivenBy.value);
        formData.append('other', other.value);
        formData.append('method', 'POST');

        const response = await APIPostRequest('/api/vehicles', formData);
        if(response.message === 'Redirect'){
            document.location.href = '/logout';
            return
        }

        if (!response.status) {
            errDiv.innerHTML = response.message;
            errDiv.style.color = 'red'
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn;
        }else{
            errDiv.innerHTML = response.message;
            errDiv.style.color = 'green'
            setTimeout(() => {
                document.location.href = '/vehicles'
            }, 1000);
        }
    });
/* --------------------------------------------------------------------------------------- */
    let vehicleDeleteBtns;
    let vehicleShowBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const loadingDiv = `
        <div class="text-center fs-3">
            <i class='bx bx-loader-alt bx-spin fs-1'></i>
        </div>
    `;
    function truncate(str, n){
        return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
    };

    closeDetails.addEventListener('click', () => {
        detailsBody.innerHTML = loadingDiv;
    })

    const detailDivShow = ({model, vtype, engineNo, trans, axle, paint, regisNumber, trim, converted, chasis,driverFullName,photo, other}) => {
        return `
            <h6>Vehicle Photo</h6> <a href="/uploads/vehicles/${photo}" target="_blank"><img src="/uploads/vehicles/${photo}" alt="user-avatar" class="d-block rounded" height="100" width="100" id="uploadedAvatar" /></a> <br>
            <h6>Vehicle Model</h6> <p>${model}</p> <br>
            <h6>Vehicle Color</h6> <p>${color}</p> <br>
            <h6>Vehicle Type</h6> <p>${vtype}</p> <br>
            <h6>Registration Number</h6> <p>${regisNumber}</p> <br>
            <h6>Engine Number</h6> <p>${engineNo}</p> <br>
            <h6>Trans</h6> <p>${trans}</p> <br>
            <h6>Axle</h6> <p>${axle}</p> <br>
            <h6>Paint</h6> <p>${paint}</p> <br>
            <h6>Trim</h6> <p>${trim}</p> <br>
            <h6>Chasis</h6> <p>${chasis}</p> <br>
            <h6>Converted</h6> <p>${converted}</p> <br>
            <h6>Driven By</h6> <p>${driverFullName ? driverFullName : 'No driver'}</p> <br>
            <h6>Other</h6> <p>${other}</p> <br>
            
        `;
    }

    const tableTr = ({regisNumber, model, color, driverFullName, vehicleUuid, vtype}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${model}</td>
                <td>${color}</td>
                <td>${driverFullName ? driverFullName : 'No driver'}</td>
                <td>${vtype}</td>
                <td>
                    <a href="vehicles/${vehicleUuid}" class="btn btn-outline-secondary"><i class="bx bx-edit "></i></a>
                    <button id="vehicleShowBtn" data-tid=${vehicleUuid} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                    <button id="vehicleDeleteBtn" data-tid=${vehicleUuid} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${model}</td>
                <td>${color}</td>
                <td>${driverFullName ? driverFullName : 'No driver'}</td>
                <td>${vtype}</td>
                <td>
                    <button id="vehicleShowBtn" data-tid=${vehicleUuid} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                </td>
            </tr>
        `;
        }
        
    }

    const pagination  = (i, currentPage) => (`
        <li class="page-item ${ currentPage == i ? 'active' : ''}" page-number="${i}" id="pageNums">
            <a class="page-link" href="javascript:void(0);" id="pageNumsA">${i}</a>
        </li>
    `);

    const APIGetData = async (page) => {
        tBody.innerHTML = '';
        const request = await fetch('/api/vehicles?page='+page);
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((vehicle) => {
                tBody.innerHTML += tableTr(vehicle, response.role);
            });

            if(page === 1){
                pageNumbers.innerHTML = `
                <li class="page-item prev" style="display:none">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
                </li>
                `;
        
            }else{
                pageNumbers.innerHTML = ` 
                <li class="page-item prev">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
                </li>
            `;
            }
            for(let i = 1; i <= response.totalPages; i++){
                pageNumbers.innerHTML += pagination(i, page);
            }
            page++;
            if(page > response.totalPages){
                pageNumbers.innerHTML += `
                <li class="page-item next" style="display:none">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
                </li>`;
            }else{
                pageNumbers.innerHTML += ` 
                <li class="page-item next">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
                </li>
            `;
            }
        }
    }

    const APIGet = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const response = await request.json();
        return response;
    }
    
    const APIDeleteData = async (data) => {
        const request = await fetch('/api/vehicles', {
            method: 'POST',
            body: data
        });
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
            return;
        }

        if(!response.status){
            deleteErr.innerText = response.message;
            deleteErr.style.color = 'red';
        }else{
            const params = new URLSearchParams(window.location.search);
            const page = params.get('page') ? parseInt(params.get('page')) : 1;
            deleteErr.innerText = response.message;
            deleteErr.style.color = 'green';
            await APIGetData(page);
        }
    }

    function setQueryStringParameter(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    }

    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        await APIGetData(page);
    });
    

    document.addEventListener('mouseover', () => {
        const pageNums = document.querySelectorAll('#pageNums');
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        if(document.querySelectorAll('#vehicleDeleteBtn')){
            vehicleDeleteBtns = document.querySelectorAll('#vehicleDeleteBtn');
            vehicleDeleteBtns.forEach((vehicleDeleteBtn) => {
                vehicleDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const vehicleId = vehicleDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleId', vehicleId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                    /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
                });
            });
        }
        if(pageNums){
            pageNums.forEach((pageNum) => {
                pageNum.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    await APIGetData(parseInt(pageNum.getAttribute('page-number')));
                    setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')));
                }, false)
            });

        }
    
        if(document.querySelector('.prev')){
            document.querySelector('.prev').addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                if(document.querySelector('.prev').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.prev').classList.add('disabled');
                await APIGetData(page - 1)
                setQueryStringParameter('page', page - 1)
                document.querySelector('.prev').classList.remove('disabled');
            });
        }
    
        if(document.querySelector('.next')){
            document.querySelector('.next').addEventListener('click',async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                if(document.querySelector('.next').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.next').classList.add('disabled');
                await APIGetData(page + 1)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }

        
        if(document.querySelectorAll('#vehicleShowBtn')){
            vehicleShowBtns = document.querySelectorAll('#vehicleShowBtn');
            vehicleShowBtns.forEach((vehicleShowBtn) => {
                vehicleShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const vehicleId = vehicleShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleId', vehicleId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/vehicles', formData);
                    if(response.message && response.message == "Redirect"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                        }, 1500);
                    }
                });
            });
        }
        
    });

    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        await APIGetData(page);
        if(document.querySelectorAll('#vehicleDeleteBtn')){
            vehicleDeleteBtns = document.querySelectorAll('#vehicleDeleteBtn');
            vehicleDeleteBtns.forEach((vehicleDeleteBtn) => {
                vehicleDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const vehicleId = vehicleDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleId', vehicleId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
        
        if(document.querySelectorAll('#vehicleShowBtn')){
            vehicleShowBtns = document.querySelectorAll('#vehicleShowBtn');
            vehicleShowBtns.forEach((vehicleShowBtn) => {
                vehicleShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const vehicleId = vehicleShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleId', vehicleId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/vehicles', formData);
                    if(response.message && response.message == "Redirect"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                        }, 1500);
                    }
                });
            });
        }
    });
}else if(document.forms.editVehicle){
    const editVehicle = document.forms.editVehicle;
    const convertedDiv = document.getElementById('convertedDiv');
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Add Vehicle`;

    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }

    let converted;
    document.querySelectorAll('[name=convertedRadio]').forEach(function (radio){
        radio.addEventListener('change', async function (e){
            if(this.value === 'converted'){
                const formData = new FormData();
                formData.append('method', 'GET');
                const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
                convertedDiv.innerHTML = `
                <div class="row g-2 mb-3">
                    <div class="mb-0">
                        <label for="other" class="form-label"> What was it converted to?</label>
                        <textarea name="converted" id="converted" class="form-control" required>${response.data.converted !== 'unconverted' ? response.data.converted : ''}</textarea>
                    </div>
                </div>`;
                converted = document.querySelector('[name="converted"]');
            }else{
                convertedDiv.innerHTML = '';
            }
        })
    })
    editVehicle.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
        const photo = this.querySelector('[name="photo"]');
        const model = this.querySelector('[name="model"]');
        const regisNo = this.querySelector('[name="regisNo"]');
        const type = this.querySelector('[name="type"]');
        const engine = this.querySelector('[name="engine"]');
        const trans = this.querySelector('[name="trans"]');
        const axle = this.querySelector('[name="axle"]');
        const paint = this.querySelector('[name="paint"]');
        const trim = this.querySelector('[name="trim"]');
        const chasis = this.querySelector('[name="chasis"]');
        const color = this.querySelector('[name="color"]');
        const drivenBy = this.querySelector('[name="drivenBy"]');
        const other = this.querySelector('[name="other"]');

        const formData = new FormData();
        formData.append('photo', photo.files[0]);
        formData.append('model', model.value);
        formData.append('regisNo', regisNo.value);
        formData.append('type', type.value);
        formData.append('engine', engine.value);
        formData.append('trans', trans.value);
        formData.append('axle', axle.value);
        formData.append('paint', paint.value);
        formData.append('trim', trim.value);
        formData.append('color', color.value);
        formData.append('chasis', chasis.value);
        formData.append('converted', converted ? converted.value : 'unconverted');
        formData.append('drivenBy', drivenBy.value);
        formData.append('other', other.value);
        formData.append('method', 'UPDATE');

        const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
        console.log(response);
        if(response.message === 'Redirect'){
            document.location.href = '/logout';
            return
        }

        if (!response.status) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            errDiv.innerHTML = response.message;
            errDiv.style.color = 'red'
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn;
        }else{
            errDiv.innerHTML = response.message;
            errDiv.style.color = 'green'
            setTimeout(() => {
                document.location.href = new URLSearchParams(window.location.search).get('s') ? document.location.href : document.location.href+'?s=u';
            }, 1000);
        }
    }); 
}