if(new URL(document.location.href).pathname === '/add-inventory'){
    const inventoryName = document.querySelector('[name="inventoryName"]');
    const vehicleBrand = document.querySelector('[name="vehicleBrand"]');
    const inventoryCondition = document.querySelector('[name="inventoryCondition"]');
    const quantity = document.querySelector('[name="quantity"]');
    const photo = document.querySelector('[name="photo"]');
    const addInventoryFrom = document.forms.addInventoryFrom;
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Add Inventory`;

    const APIPost = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const response = await request.json();
        return response;
    }

    addInventoryFrom.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData();
        this.querySelector('#addBtn').setAttribute('disabled', true);
        this.querySelector('#addBtn').innerHTML = loadingBtn;
        formData.append('inventoryName', inventoryName.value);
        formData.append('vehicleBrand', vehicleBrand.value);
        formData.append('inventoryCondition', inventoryCondition.value);
        formData.append('quantity', quantity.value);
        formData.append('photo', photo.files[0]);
        formData.append('method', 'POST');

        const response = await APIPost('/api/inventory', formData);
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            this.querySelector('#addBtn').removeAttribute('disabled');
            this.querySelector('#addBtn').innerHTML = loadedBtn;
            errDiv.innerText = response.message;
            errDiv.style.color = 'red';

        }else{
            errDiv.innerText = "Inventory added!";
            errDiv.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/inventories'
            }, 1000);
        }
    })
}else if(new URL(document.location.href).pathname === '/inventories'){
    let inventoryDeleteBtns;
    let inventoryShowBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const filterSelect = document.querySelector('#smallSelect');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const searchInventory = document.querySelector('[name="searchInventory"]');
    const searchInventoryBtn =document.getElementById('searchInventoryBtn');
    const searchInventoryForm =document.forms.searchInventoryForm;
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

    const detailDivShow = ({inventoryName, inventoryCondition, quantity, vehicleBrand, id, photo}) => {
        return `
            <h6>Photo</h6> <a href="/uploads/inventory/${photo}" target="_blank"><img src="/uploads/inventory/${photo}" alt="user-avatar" class="d-block rounded" height="100" width="100" id="uploadedAvatar" /></a> <br>
            <h6>Inventory Name</h6> <p>${inventoryName}</p> <br>
            <h6>Condition</h6> <p>${inventoryCondition}</p> <br>
            <h6>Quantity</h6> <p>${quantity}</p> <br>
            <h6>Vehicle Brand</h6> <p>${vehicleBrand}</p> <br>
            
        `;
    }

    const tableTr = ({inventoryName, inventoryCondition, quantity, vehicleBrand, id, photo}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${inventoryName}</strong></td>
                <td>${inventoryCondition}</td>
                <td>
                    <button data-tid=${id} type="button" id="quantityMinus" class="btn btn-primary btn-sm">-</button>
                    <span id="totalQty">${quantity}</span>
                    <button data-tid=${id} type="button" id="quantityPlus" class="btn btn-primary btn-sm">+</button>
                </td>
                <td>${vehicleBrand}</td>
                <td>
                    <ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" class="avatar avatar-xs pull-up" title="${inventoryName}'s Photo">
                            <img src="/uploads/inventory/${photo}" class="rounded-circle">
                        </li>
                    </ul>
                </td>
                <td>
                    <a class="btn w-30 btn-outline-secondary me-2" href="inventories/${id}"><i class="bx bx-edit-alt me-1"></i></a>
                    <button id="inventoryShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable"><i class="bx bx-show"></i></button>
                    <button id="inventoryDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${inventoryName}</strong></td>
                <td>${inventoryCondition}</td>
                <td>
                    <button data-tid=${id} type="button" id="quantityMinus" class="btn btn-primary btn-sm">-</button>
                    <span id="totalQty">${quantity}</span>
                    <button data-tid=${id} type="button" id="quantityPlus" class="btn btn-primary btn-sm">+</button>
                </td>
                <td>${vehicleBrand}</td>
                <td>
                    <ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                        <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" class="avatar avatar-xs pull-up" title="${inventoryName}'s Photo">
                            <img src="/uploads/inventory/${photo}" class="rounded-circle">
                        </li>
                    </ul>
                </td>
                <td>
                    <button id="inventoryShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable"><i class="bx bx-show"></i></button>
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

    const APIGetData = async (page, filter, search) => {
        tBody.innerHTML = '';
        const newFilter = filter ? filter : 'all';
        const request = await fetch('/api/inventory?page='+page+'&&filter='+newFilter+'&&search='+search);
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((inventory) => {
                tBody.innerHTML += tableTr(inventory, response.role);
            });

            if( response.totalPages < 2){
                pageNumbers.innerHTML = '';
                return;
            }

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
    
    function setQueryStringParameter(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    }
    
    const APIDeleteData = async (data) => {
        const request = await fetch('/api/inventory', {
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
            const page = 1;
            const filter = params.get('filter') ? params.get('filter') : 'all';
            const search = params.get('search') ? params.get('search') : '';
            deleteErr.innerText = "Inventory deleted!";
            deleteErr.style.color = 'green';
            await APIGetData(page, filter, search);
            setQueryStringParameter('page', 1);
        }
    }


    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const filter = params.get('filter') ? params.get('filter') : 'all';
        const search = params.get('search') ? params.get('search') : '';
        await APIGetData(page, filter, search);
    });
    

    document.addEventListener('mouseover', () => {
        const pageNums = document.querySelectorAll('#pageNums');
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const filter = params.get('filter') ? params.get('filter') : 'all';
        const search = params.get('search') ? params.get('search') : '';
        if(document.querySelectorAll('#inventoryDeleteBtn')){
            inventoryDeleteBtns = document.querySelectorAll('#inventoryDeleteBtn');
            inventoryDeleteBtns.forEach((inventoryDeleteBtn) => {
                inventoryDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const inventoryId = inventoryDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('inventoryId', inventoryId);
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
                    await APIGetData(parseInt(pageNum.getAttribute('page-number')), filter, search);
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
                await APIGetData(page - 1, filter, search);
                setQueryStringParameter('page', page - 1);
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
                await APIGetData(page + 1, filter, search)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }

        
        if(document.querySelectorAll('#inventoryShowBtn')){
            inventoryShowBtns = document.querySelectorAll('#inventoryShowBtn');
            inventoryShowBtns.forEach((inventoryShowBtn) => {
                inventoryShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const inventoryId = inventoryShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('inventoryId', inventoryId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/inventory', formData);
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
        const filter = params.get('filter') ? params.get('filter') : 'all';
        const search = params.get('search') ? params.get('search') : '';
        searchInventory.value = search;


        await APIGetData(page, filter, search);
        if(document.querySelectorAll('#inventoryDeleteBtn')){
            inventoryDeleteBtns = document.querySelectorAll('#inventoryDeleteBtn');
            inventoryDeleteBtns.forEach((inventoryDeleteBtn) => {
                inventoryDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const inventoryId = inventoryDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('inventoryId', inventoryId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }

        
        if(document.querySelectorAll('#inventoryShowBtn')){
            inventoryShowBtns = document.querySelectorAll('#inventoryShowBtn');
            inventoryShowBtns.forEach((inventoryShowBtn) => {
                inventoryShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const inventoryId = inventoryShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('inventoryId', inventoryId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/inventory', formData);
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

        if(document.querySelectorAll('#quantityMinus')){
            let quantityMinuses = document.querySelectorAll('#quantityMinus');
            let totalQty = document.querySelectorAll('#totalQty');
            let isZero;
            quantityMinuses.forEach((quantityMinus, index) => {
                const totalQuantity = isNaN(parseInt(totalQty[index].innerText)) ? 0 : parseInt(totalQty[index].innerText);

                    if(totalQuantity < 1){
                        quantityMinus.setAttribute('disabled', true)
                        return;
                    }
            })
            quantityMinuses.forEach((quantityMinus, index) => {
                quantityMinus.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const totalQuantity = isNaN(parseInt(totalQty[index].innerText)) ? 0 : parseInt(totalQty[index].innerText);
                    
                    let newQty = totalQuantity - 1;

                    if(totalQuantity < 1){
                        quantityMinus.setAttribute('disabled', true)
                        return;
                    }


                    totalQty[index].innerText = newQty;

                    if(isZero){
                        quantityMinus.setAttribute('disabled', true)
                    }else{
                        quantityMinus.removeAttribute('disabled')
                    }

                    if(newQty - 1 < 1){
                        isZero = true;
                    }else{
                        isZero = false
                    }

                    const inventoryId = quantityMinus.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('quantity', newQty);
                    formData.append('inventoryId', inventoryId);
                    formData.append('method', 'QUANTITY');
                    const response = await APIGet('/api/inventory', formData);
                    if(response.message && response.message == "Redirect"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(!response.status){
                    }
                });
            });
        }

        if(document.querySelectorAll('#quantityPlus')){
            let quantityPluses = document.querySelectorAll('#quantityPlus');
            let quantityMinus = document.querySelectorAll('#quantityMinus');
            let totalQty = document.querySelectorAll('#totalQty');
            quantityPluses.forEach((quantityPlus, index) => {
                quantityPlus.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const totalQuantity = isNaN(parseInt(totalQty[index].innerText)) ? 0 : parseInt(totalQty[index].innerText);
                    
                    let newQty = totalQuantity + 1;

                    if(totalQuantity < 1){
                        quantityMinus[index].setAttribute('disabled', true)
                    }

                    totalQty[index].innerText = newQty;
                    if(newQty > 0){
                        quantityMinus[index].removeAttribute('disabled')

                    }

                    const inventoryId = quantityPlus.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('quantity', newQty);
                    formData.append('inventoryId', inventoryId);
                    formData.append('method', 'QUANTITY');
                    const response = await APIGet('/api/inventory', formData);
                    if(response.message && response.message == "Redirect"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(!response.status){
                    }
                });
            });
        }
    });

    filterSelect.addEventListener('change', (e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        const search = params.get('search') ? params.get('search') : '';
        const page = 1;
        const filter = filterSelect.value;
        setQueryStringParameter('filter', filter)
        APIGetData(page, filter, search);
    });

    searchInventory.addEventListener('input', async function(e) {
        if(e.target.value && e.target.value.trim() !== ''){
            searchInventoryBtn.removeAttribute('disabled');
            return;
        }
        searchInventoryBtn.setAttribute('disabled', true);
        const searchValue = e.target.value ? e.target.value : '';
        const params = new URLSearchParams(window.location.search);
        const page = 1;
        const filter = params.get('filter') ? params.get('filter') : 'all';
        params.delete('search');
        setQueryStringParameter('page', 1);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
        APIGetData(page, filter, searchValue);
        
    });

    searchInventoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchValue = searchInventory.value ? searchInventory.value : '';
        const params = new URLSearchParams(window.location.search);
        const page = 1;
        setQueryStringParameter('search', searchValue);
        setQueryStringParameter('page', 1);
        const filter = params.get('filter') ? params.get('filter') : 'all';
        APIGetData(page, filter, searchValue);
    });
}else if(document.forms.editInventoryFrom){
    const inventoryName = document.querySelector('[name="inventoryName"]');
    const vehicleBrand = document.querySelector('[name="vehicleBrand"]');
    const inventoryCondition = document.querySelector('[name="inventoryCondition"]');
    const quantity = document.querySelector('[name="quantity"]');
    const photo = document.querySelector('[name="photo"]');
    const editInventoryFrom = document.forms.editInventoryFrom;
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Edit Inventory`;

    const APIPost = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const response = await request.json();
        return response;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const params = new URLSearchParams(window.location.search);
        if(params.get("s")){
            document.querySelector('#errDiv').innerHTML = "Inventory updated successfully!";
            document.querySelector('#errDiv').style.color = 'green';

        }
    })

    editInventoryFrom.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData();
        this.querySelector('#editBtn').setAttribute('disabled', true);
        this.querySelector('#editBtn').innerHTML = loadingBtn;
        formData.append('inventoryName', inventoryName.value);
        formData.append('vehicleBrand', vehicleBrand.value);
        formData.append('inventoryCondition', inventoryCondition.value);
        formData.append('quantity', quantity.value);
        formData.append('photo', photo.files[0]);
        formData.append('inventoryId', new URL(window.location).pathname.split('/').filter(n => n)[1]);
        formData.append('method', 'UPDATE');

        const response = await APIPost('/api/inventory', formData);
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            this.querySelector('#editBtn').removeAttribute('disabled');
            this.querySelector('#editBtn').innerHTML = loadedBtn;
            errDiv.innerText = response.message;
            errDiv.style.color = 'red';

        }else{
            errDiv.innerText = "Inventory added!";
            errDiv.style.color = 'green';

            window.scrollTo({ 
                top: 0, 
                behavior: "smooth" 
            });
            document.querySelector('#errDiv').innerHTML = "Inventory updating......";
            document.querySelector('#errDiv').style.color = 'green';
            setTimeout(() => {
                window.location.search = 's=u'
            },1500);
        }
    })
}