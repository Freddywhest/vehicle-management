if(document.forms.validateDriverFrom) {
    const validUserDiv = document.getElementById('isValidDriver');
    const validateErr = document.getElementById('validateErr');
    const validErr = document.getElementById('validErr');
    const idNo = document.getElementById('idNo');
    const dName = document.getElementById('dName');
    const uploadedAvatar = document.getElementById('uploadedAvatar');
    const dUuid = document.getElementById('dUuid');
    const validateDriverFrom = document.forms.validateDriverFrom;
    const isValidDriverForm = document.forms.isValidDriverForm;
    const driverIdNo = document.querySelector('[name="driverIdNo"]');
    const amount = document.querySelector('[name="amount"]');
    
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Validate`;
    /*  */
    const APIRequest = async (formData, url) => {
        const request = await fetch(url, {
            method: 'POST',
            body:  formData
        });
        const response = await request.json();
        return response;
    };
    
    const reset = () => {
        validUserDiv.style.opacity = 0;
        validUserDiv.style.visibility = 'hidden';
        validateDriverFrom.querySelector('button').style.opacity = 1;
        validateDriverFrom.querySelector('button').style.visibility = 'visible';
        validateErr.innerText = '';
        validateDriverFrom.querySelector('button').innerHTML= loadedBtn;
        validateDriverFrom.querySelector('button').removeAttribute('disabled');
    }
    
    const driverDetails = {
        show: ({driverFullName, driverIdNo, driverPhoto, driverUuid}) => {
            idNo.innerText = `[${driverIdNo}]`;
            dName.innerText = `[${driverFullName}]`;
            dUuid.value = driverUuid;
            uploadedAvatar.src = driverPhoto ? `/uploads/drivers/${driverPhoto}` : '/uploads/users/avatar.png';
        },
        reset : () => {
            idNo.innerText = '';
            dName.innerText = '';
            validErr.innerText = '';
            dUuid.value = '';
            uploadedAvatar.src = '';
        }
    };
    
    validateDriverFrom.addEventListener('submit', async (e) => {
        e.preventDefault();
        validateDriverFrom.querySelector('button').innerHTML= loadingBtn;
        validateDriverFrom.querySelector('button').setAttribute('disabled', true);
        const formData = new FormData();
        formData.append('driver', driverIdNo.value);
        formData.append('method', 'POST');
        formData.append('status', 'check');
        const data = await APIRequest(formData, '/api/sales');
        if(data.message == "Redirect"){
            document.location.href = "/logout"
            return;
        }
    
        if(!data.status){
            validateErr.innerText = data.message;
            validateErr.style.color = 'red';
            validateDriverFrom.querySelector('button').innerHTML= loadedBtn;
            validateDriverFrom.querySelector('button').removeAttribute('disabled');
        }else{
            validateErr.innerText = data.message;
            validateErr.style.color = 'green';
            driverDetails.show(data.data)
            validUserDiv.style.opacity = 1;
            validUserDiv.style.visibility = 'visible';
            amount.focus();
            validateDriverFrom.querySelector('button').style.opacity = 0;
            validateDriverFrom.querySelector('button').style.visibility = 'hidden';
        }
    });
    
    window.addEventListener('keydown', (e) => {
        if(isValidDriverForm.querySelector('button').getAttribute('disabled')){
            e.preventDefault();
            return false;
        }
    })
    
    driverIdNo.addEventListener('input', (e) => {
        if(isValidDriverForm.querySelector('button').getAttribute('disabled')){
            return;
        }
        reset();
    });
    
    isValidDriverForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        isValidDriverForm.querySelector('button').innerHTML= loadingBtn;
        isValidDriverForm.querySelector('button').setAttribute('disabled', true);
        const formData = new FormData();
        formData.append('driver', dUuid.value);
        formData.append('amount', amount.value);
        formData.append('method', 'POST');
        formData.append('status', 'valid');
        const data = await APIRequest(formData, '/api/sales');
    
        if(data.message == "Redirect"){
            document.location.href = "/logout"
            return;
        }
    
        if(!data.status){
            validErr.innerText = data.message;
            validErr.style.color = 'red';
            isValidDriverForm.querySelector('button').innerHTML= loadedBtn;
            isValidDriverForm.querySelector('button').removeAttribute('disabled');
        }else{
            validErr.innerText = data.message;
            validErr.style.color = 'green';
            setTimeout(() => {
                document.location.href = "/sales"
            }, 1500);
    
        }
    })
/* ------------------------------------------------------------------------------------------------------------------ */
}else if(document.querySelector('#allSalesPage')){
    let salesDeleteBtns;
    const d = new Date();
    const month = d.getFullYear()+'-'+'0'+(d.getMonth()+1);
    const tBody = document.querySelector('.table-border-bottom-0');
    const filterSelect = document.querySelector('#smallSelect');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const filterDateSelector = document.querySelector('#filterDateSelector');
    async function filterWithDate(params, value){
        await APIGetData(1, '', true, value);
    }
    const tableTr = ({amount, salesDate, driverFullName, fullName, salesUuid}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${salesDate}</strong></td>
                <td>${driverFullName}</td>
                <td>GH₵ ${amount}</td>
                <td>${fullName}</td>
                <td>
                    <button id="salesDeleteBtn" data-tid=${salesUuid} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${salesDate}</strong></td>
                <td>${driverFullName}</td>
                <td>GH₵ ${amount}</td>
                <td>${fullName}</td>
                <td>
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

    const APIGetData = async (page, filter, filterDate = false, filterDateValue) => {
        tBody.innerHTML = '';
        let request;
        const newFilter = filter ? filter : month;
        if(filterDate && filterDateValue){
            request = await fetch('/api/sales?page='+page+'&&filterDate='+filterDateValue);
        }else{
            request = await fetch('/api/sales?page='+page+'&&filter='+newFilter);
        }
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((sale) => {
                tBody.innerHTML += tableTr(sale, response.role);
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

    
    const APIDeleteData = async (data) => {
        const request = await fetch('/api/sales', {
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
            const filter = params.get('filter') ? params.get('filter') : month;
            deleteErr.innerText = response.message;
            deleteErr.style.color = 'green';
            if(params.get('filterDate')){
                await APIGetData(page, '', true, params.get('filterDate'));
            }else{
                await APIGetData(page, filter, false, '');
            }
        }
    }

    function setQueryStringParameter(name, value, deleteFilterDate = false, deleteFilter = false) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        params.get('filterDate') && deleteFilterDate ? params.delete('filterDate') : '';
        params.get('filter') && deleteFilter ? params.delete('filter') : '';
        window.history.pushState({}, document.title, decodeURIComponent(`${window.location.pathname}?${params}`));
    }

    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const filter = params.get('filter') ? params.get('filter') : month;
        if(params.get('filterDate')){
            await APIGetData(page, '', true, params.get('filterDate'));
        }else{
            await APIGetData(page, filter, false, '');
        }
    });
    

    document.addEventListener('mouseover', () => {
        const pageNums = document.querySelectorAll('#pageNums');
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const filter = params.get('filter') ? params.get('filter') : month;
        if(document.querySelectorAll('#salesDeleteBtn')){
            salesDeleteBtns = document.querySelectorAll('#salesDeleteBtn');
            salesDeleteBtns.forEach((salesDeleteBtn) => {
                salesDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const salesId = salesDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('salesId', salesId);
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
                    let filterDateBool;
                    let filterBool;
                    if(params.get('filterDate')){
                        await APIGetData(parseInt(pageNum.getAttribute('page-number')), '', true, params.get('filterDate'));
                        filterDateBool = false;
                        filterBool = true;
                    }else{
                        await APIGetData(parseInt(pageNum.getAttribute('page-number')), filter, false, '');
                        filterDateBool = true;
                        filterBool = false;
                    }
                    setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')), filterDateBool, filterBool);
                }, false)
            });

        }
    
        if(document.querySelector('.prev')){
            document.querySelector('.prev').addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                let filterDateBool;
                let filterBool;
                if(document.querySelector('.prev').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.prev').classList.add('disabled');
                if(params.get('filterDate')){
                    await APIGetData(page - 1, '', true, params.get('filterDate'));
                    filterDateBool = false;
                    filterBool = true;
                }else{
                    await APIGetData(page - 1, filter, false, '');
                    filterDateBool = true;
                    filterBool = false;
                }
                setQueryStringParameter('page', page - 1, filterDateBool, filterBool)
                document.querySelector('.prev').classList.remove('disabled');
            });
        }
    
        if(document.querySelector('.next')){
            document.querySelector('.next').addEventListener('click',async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                let filterDateBool;
                let filterBool;
                if(document.querySelector('.next').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.next').classList.add('disabled');
                if(params.get('filterDate')){
                    await APIGetData(page + 1, '', true, params.get('filterDate'));
                    filterDateBool = false;
                    filterBool = true;
                }else{
                    await APIGetData(page + 1, filter, false, '');
                    filterDateBool = true;
                    filterBool = false;
                }
                setQueryStringParameter('page', page+1, filterDateBool, filterBool)
                document.querySelector('.next').classList.remove('disabled');
            });
        }
        
    });

    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const filter = params.get('filter') ? params.get('filter') : month;
        if(params.get('filterDate')){
            await APIGetData(page, '', true, params.get('filterDate'));
        }else{
            await APIGetData(page, filter, false, '');
        }
        if(document.querySelectorAll('#salesDeleteBtn')){
            salesDeleteBtns = document.querySelectorAll('#salesDeleteBtn');
            salesDeleteBtns.forEach((salesDeleteBtn) => {
                salesDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const salesId = salesDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('salesId', salesId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
    });

    filterSelect.addEventListener('change', (e) => {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        const page = 1;
        const filter = filterSelect.value;
        setQueryStringParameter('filter', filter, true, false)
        setQueryStringParameter('page', page, true, false)
        if(params.get('filterDate')){
            params.delete('filterDate')
        }
        APIGetData(page, filter, false, '');
    })

    filterDateSelector.addEventListener('change', async function (e) {
        e.preventDefault();
        const params = new URLSearchParams(window.location.search);
        const page = 1;
        setQueryStringParameter('filterDate', this.value, false, true)
        setQueryStringParameter('page', page, false, true)
        await filterWithDate(params, this.value);
    })
}else if(document.querySelector('#driverSalesPage')){
    let salesDeleteBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const filterSelect = document.querySelector('#smallSelect');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const tableTr = ({amount, salesDate, driverFullName, fullName, salesUuid}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${salesDate}</strong></td>
                <td>${driverFullName}</td>
                <td>GH₵ ${amount}</td>
                <td>${fullName}</td>
                <td>
                    <button id="salesDeleteBtn" data-tid=${salesUuid} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${salesDate}</strong></td>
                <td>${driverFullName}</td>
                <td>GH₵ ${amount}</td>
                <td>${fullName}</td>
                <td>
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

    const APIGetData = async (page, filter) => {
        tBody.innerHTML = '';
        const newFilter = filter ? filter : 'all';
        const request = await fetch('/api/sales/'+new URL(document.location.href).pathname.split('/').filter(n => n)[1]+'?method=driverSale&&page='+page+'&&filter='+newFilter);
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((sale) => {
                tBody.innerHTML += tableTr(sale, response.role);
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

    
    const APIDeleteData = async (data) => {
        const request = await fetch('/api/sales', {
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
            const filter = params.get('filter') ? params.get('filter') : 'all';
            deleteErr.innerText = response.message;
            deleteErr.style.color = 'green';
            await APIGetData(page, filter);
        }
    }

    function setQueryStringParameter(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.pushState({}, document.title, decodeURIComponent(`${window.location.pathname}?${params}`));
    }

    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const filter = params.get('filter') ? params.get('filter') : 'all';
        await APIGetData(page, filter);
    });
    

    document.addEventListener('mouseover', () => {
        const pageNums = document.querySelectorAll('#pageNums');
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const filter = params.get('filter') ? params.get('filter') : 'all';
        if(document.querySelectorAll('#salesDeleteBtn')){
            salesDeleteBtns = document.querySelectorAll('#salesDeleteBtn');
            salesDeleteBtns.forEach((salesDeleteBtn) => {
                salesDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const salesId = salesDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('salesId', salesId);
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
                    await APIGetData(parseInt(pageNum.getAttribute('page-number')), filter);
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
                await APIGetData(page - 1, filter)
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
                await APIGetData(page + 1, filter)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }
        
    });

    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const filter = params.get('filter') ? params.get('filter') : 'all';
        await APIGetData(page, filter);
        if(document.querySelectorAll('#salesDeleteBtn')){
            salesDeleteBtns = document.querySelectorAll('#salesDeleteBtn');
            salesDeleteBtns.forEach((salesDeleteBtn) => {
                salesDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const salesId = salesDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('salesId', salesId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
    });

    filterSelect.addEventListener('change', (e) => {
        e.preventDefault();
        const page = 1;
        const filter = filterSelect.value;
        setQueryStringParameter('filter', filter)
        setQueryStringParameter('page', page)
        APIGetData(page, filter);
    })
}