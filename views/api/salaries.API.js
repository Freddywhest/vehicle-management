if(new URL(document.location.href).pathname === '/pay-driver'){
    const driverSelect = document.getElementById('select_box');
    const payDriverErr = document.getElementById('payDriverErr');
    const payDriversErr = document.getElementById('payDriversErr');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Pay`;
    const amount = document.querySelector('[name="amount"]');
    const payDriversForm = document.forms.payDriversForm;
    const payDriverForm = document.forms.payDriverForm;
    const APIGetRequest = async () => {
        const request = await fetch('/api/salaries?method=allDrivers');
        const response = await request.json();
        response.data.forEach(driver => {
            driverSelect.insertAdjacentHTML('beforeend', `<option value="${driver.driverUuid}">${driver.driverFullName}</option>`)
        });
    };
    document.addEventListener('DOMContentLoaded', async() => {
        await APIGetRequest();
        $('select').selectize({
            sortField: 'text'
        });
    })

    const APIPostRequest = async(url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const response = await request.json();
        return response;
    };
    payDriversForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(payDriverForm.querySelector('button').getAttribute('disabled')) return;
        payDriversForm.querySelector('button').setAttribute('disabled', true);
        payDriversForm.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
        formData.append('type', 'PayToAllDrivers');
        formData.append('method', 'POST');
        const response = await APIPostRequest('/api/salaries', formData);
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            payDriversForm.querySelector('button').removeAttribute('disabled');
            payDriversForm.querySelector('button').innerHTML = loadedBtn;
            payDriversErr.innerText = response.message;
            payDriversErr.style.color = 'red';

        }else{
            payDriversErr.innerText = response.message;
            payDriversErr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/salaries'
            }, 1000);
        }
    })

    payDriverForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        payDriverForm.querySelector('button').setAttribute('disabled', true);
        payDriverForm.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
        formData.append('type', 'PayToDriver');
        formData.append('method', 'POST');
        formData.append('amount', amount.value);
        formData.append('receiverId', driverSelect.value);
        const response = await APIPostRequest('/api/salaries', formData);
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            payDriverForm.querySelector('button').removeAttribute('disabled');
            payDriverForm.querySelector('button').innerHTML = loadedBtn;
            payDriverErr.innerText = response.message;
            payDriverErr.style.color = 'red';

        }else{
            payDriverErr.innerText = response.message;
            payDriverErr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/salaries'
            }, 1000);
        }
    })

}else if(new URL(document.location.href).pathname === '/pay-worker'){
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Pay Worker`;
    const workerSelect = document.getElementById('select_box');
    const payWorkerErr = document.getElementById('payWorkerErr');
    const payWorkersErr = document.getElementById('payWorkersErr');
    const amount = document.querySelector('[name="amount"]');
    const payWorkersForm = document.forms.payWorkersForm;
    const payWorkerForm = document.forms.payWorkerForm;
    const APIGetRequest = async () => {
        const request = await fetch('/api/salaries?method=allWorkers');
        const response = await request.json();
        response.data.forEach(worker => {
            workerSelect.insertAdjacentHTML('beforeend', `<option value="${worker.userUuid}">${worker.fullName}</option>`)
        });
    };

    const APIPostRequest = async(url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const response = await request.json();
        return response;
    }

    document.addEventListener('DOMContentLoaded', async() => {
        await APIGetRequest();
        $('select').selectize({
            sortField: 'text'
        });
    });

    payWorkersForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if(payWorkerForm.querySelector('button').getAttribute('disabled')) return;
        payWorkersForm.querySelector('button').setAttribute('disabled', true);
        payWorkersForm.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
        formData.append('type', 'PayToAllWorkers');
        formData.append('method', 'POST');
        const response = await APIPostRequest('/api/salaries', formData);
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            payWorkersForm.querySelector('button').removeAttribute('disabled');
            payWorkersForm.querySelector('button').innerHTML = loadedBtn;
            payWorkersErr.innerText = response.message;
            payWorkersErr.style.color = 'red';

        }else{
            payWorkersErr.innerText = response.message;
            payWorkersErr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/salaries'
            }, 1000);
        }
    })

    payWorkerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        payWorkerForm.querySelector('button').setAttribute('disabled', true);
        payWorkerForm.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
        formData.append('type', 'PayToWorker');
        formData.append('method', 'POST');
        formData.append('amount', amount.value);
        formData.append('receiverId', workerSelect.value);
        const response = await APIPostRequest('/api/salaries', formData);
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            payWorkerForm.querySelector('button').removeAttribute('disabled');
            payWorkerForm.querySelector('button').innerHTML = loadedBtn;
            payWorkerErr.innerText = response.message;
            payWorkerErr.style.color = 'red';

        }else{
            payWorkerErr.innerText = response.message;
            payWorkerErr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/salaries'
            }, 1000);
        }
    })

}else if(new URL(document.location.href).pathname === '/salaries'){
    let salaryDeleteBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const filterSelect = document.querySelector('#smallSelect');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const tableTr = ({amount, salaryDate, driverFullName, fullName, id, receiver}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${salaryDate}</strong></td>
                <td>GH₵ ${amount}</td>
                <td>${driverFullName ? driverFullName : fullName ? fullName : 'Unknown'}</td>
                <td>${receiver}</td>
                <td>
                    <button id="salaryDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${salaryDate}</strong></td>
                <td>GH₵ ${amount}</td>
                <td>${driverFullName ? driverFullName : fullName ? fullName : 'Unknown'}</td>
                <td>${receiver}</td>
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
        const request = await fetch('/api/salaries?method=allSalaries&&page='+page+'&&filter='+newFilter);
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((salary) => {
                tBody.innerHTML += tableTr(salary, response.role);
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
        const request = await fetch('/api/salaries', {
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
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
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
        if(document.querySelectorAll('#salaryDeleteBtn')){
            salaryDeleteBtns = document.querySelectorAll('#salaryDeleteBtn');
            salaryDeleteBtns.forEach((salaryDeleteBtn) => {
                salaryDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const salaryId = salaryDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('salaryId', salaryId);
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
        if(document.querySelectorAll('#salaryDeleteBtn')){
            salaryDeleteBtns = document.querySelectorAll('#salaryDeleteBtn');
            salaryDeleteBtns.forEach((salaryIdDeleteBtn) => {
                salaryIdDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const salaryId = salaryIdDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('salaryId', salaryId);
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
}else{
    let salaryDeleteBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const filterSelect = document.querySelector('#smallSelect');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const tableTr = ({amount, salaryDate, driverFullName, fullName, id, receiver}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${salaryDate}</strong></td>
                <td>GH₵ ${amount}</td>
                <td>${driverFullName ? driverFullName : fullName ? fullName : 'Unknown'}</td>
                <td>${receiver}</td>
                <td>
                    <button id="salaryDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${salaryDate}</strong></td>
                <td>GH₵ ${amount}</td>
                <td>${driverFullName ? driverFullName : fullName ? fullName : 'Unknown'}</td>
                <td>${receiver}</td>
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
        const request = await fetch('/api/salaries/'+new URL(document.location.href).pathname.split('/').filter(n => n)[1]+'?method=workerSalaries&&page='+page+'&&filter='+newFilter);
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((salary) => {
                tBody.innerHTML += tableTr(salary, response.role);
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
        const request = await fetch('/api/salaries', {
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
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
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
        if(document.querySelectorAll('#salaryDeleteBtn')){
            salaryDeleteBtns = document.querySelectorAll('#salaryDeleteBtn');
            salaryDeleteBtns.forEach((salaryDeleteBtn) => {
                salaryDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const salaryId = salaryDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('salaryId', salaryId);
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
        if(document.querySelectorAll('#salaryDeleteBtn')){
            salaryDeleteBtns = document.querySelectorAll('#salaryDeleteBtn');
            salaryDeleteBtns.forEach((salaryIdDeleteBtn) => {
                salaryIdDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const salaryId = salaryIdDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('salaryId', salaryId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
    });


}
