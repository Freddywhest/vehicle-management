const APIGetRequest = async (url) => {
    const request = await fetch(url);
    const response = await request.json();
    return response;
}

const APIPostRequest = async (url, formData) => {
    const request = await fetch(url, {
        method: 'POST',
        body: formData
    });
    const response = await request.json();
    return response;
}

const customErrMsg = (element, message) => {
    element.addEventListener('invalid', function () {
        this.setCustomValidity(message);
    })

    element.addEventListener('input', function () {
        this.setCustomValidity('');
    })
    

}
const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
const loadedBtn = 'Add Expense';

if(new URL(document.location.href).pathname === '/add-expense'){
    const totalExp = document.querySelector('#totalExp');
    const expenseErr = document.querySelector('#expenseErr');
    const expensesForm = document.forms.expensesForm;
    const amount = document.querySelector('[name="amount"]');
    const purpose = document.querySelector('[name="purpose"]');
    const workshopN = document.querySelector('[name="workshopN"]');
    const workshopC = document.querySelector('[name="workshopC"]');

    document.addEventListener('DOMContentLoaded', async () => {
        const response = await APIGetRequest('/api/totals?type=expenses');
        totalExp.innerHTML = response.status ? `GH₵ ${response.data.totalExpenses}` : `Something went when retrieving total expenses`;
        totalExp.style.color = !response.status ? 'red' : '';
        customErrMsg(amount, "Expense amount shouldn't be empty!");
        customErrMsg(purpose, "Purpose shouldn't be empty!");
    });

    expensesForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData();
        this.querySelector('button').innerHTML = loadingBtn;
        this.querySelector('button').setAttribute('disabled', true);

        formData.append('amount', amount.value);
        formData.append('purpose', purpose.value);
        formData.append('workshopN', workshopN.value);
        formData.append('workshopC', workshopC.value);
        formData.append('type', 'POST');

        const response = await APIPostRequest('/api/workshop', formData);
        console.log(response);
        if(response.message === "Redirect"){
            document.location.href = '/logout';
            return;
        } 

        if (!response.status) {
            expenseErr.innerHTML = response.message;
            expenseErr.style.color = 'red'
            this.querySelector('button').innerHTML = loadedBtn;
            this.querySelector('button').removeAttribute('disabled');
        }else{
            expenseErr.innerHTML = response.message;
            expenseErr.style.color = 'green'
            setTimeout(() => {
                document.location.href = '/expenses';
            }, 1000);
        }
    })
}else if(new URL(document.location.href).pathname === '/expenses'){
    let workshopDeleteBtns;
    let workshopShowBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const filterSelect = document.querySelector('#smallSelect');
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

    const detailDivShow = ({amount, expenseDate, purpose}) => {
        return `
            <h6>Date</h6> <p>${expenseDate}</p> <br>
            <h6>Amount</h6> <p>GH₵ ${amount}</p> <br>
            <h6>Workshop worker's name</h6> <p>${workshopN}</p> <br>
            <h6>Workshop worker's contact</h6> <p>${workshopC}</p> <br>
            <h6>Purpose</h6> <p>${purpose ? purpose : '-'}</p>
            
        `;
    }

    const tableTr = ({amount, expenseDate, id, purpose, workshopN}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${expenseDate}</strong></td>
                <td>GH₵ ${amount}</td>
                <td>${workshopN}</td>
                <td>${purpose ? truncate(purpose, 20) : '-'}</td>
                <td>
                    <button id="workshopShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable"><i class="bx bx-show"></i></button>
                    <button id="workshopDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${expenseDate}</strong></td>
                <td>GH₵ ${amount}</td>
                <td>GH₵ ${workshopN}</td>
                <td>${purpose ? truncate(purpose, 20) : '-'}</td>
                <td>
                    <button id="workshopShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable"><i class="bx bx-show"></i></button>
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
        const request = await fetch('/api/workshop?type=expenses&&page='+page+'&&filter='+newFilter);
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((workshop) => {
                tBody.innerHTML += tableTr(workshop, response.role);
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
        const request = await fetch('/api/workshop', {
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
        if(document.querySelectorAll('#workshopDeleteBtn')){
            workshopDeleteBtns = document.querySelectorAll('#workshopDeleteBtn');
            workshopDeleteBtns.forEach((workshopDeleteBtn) => {
                workshopDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const workshopId = workshopDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workshopId', workshopId);
                    formData.append('type', 'DELETE');
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

        
        if(document.querySelectorAll('#workshopShowBtn')){
            workshopShowBtns = document.querySelectorAll('#workshopShowBtn');
            workshopShowBtns.forEach((workshopShowBtn) => {
                workshopShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const workshopId = workshopShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    detailsBody.innerHTML = loadingDiv;
                    formData.append('workshopId', workshopId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/workshop', formData);
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
        await APIGetData(page, filter);
        if(document.querySelectorAll('#workshopDeleteBtn')){
            workshopDeleteBtns = document.querySelectorAll('#workshopDeleteBtn');
            workshopDeleteBtns.forEach((workshopDeleteBtn) => {
                workshopDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const workshopId = workshopDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workshopId', workshopId);
                    formData.append('type', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
        
        if(document.querySelectorAll('#workshopShowBtn')){
            workshopShowBtns = document.querySelectorAll('#workshopShowBtn');
            workshopShowBtns.forEach((workshopShowBtn) => {
                workshopShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const workshopId = workshopShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workshopId', workshopId);
                    formData.append('method', 'POST');
                    formData.append('type', 'expense');
                    const response = await APIGet('/api/workshop', formData);
                    if(response.message && response.message == "Redirect"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                        }, 1000);
                    }else{
                        
                        detailsBody.innerHTML = response.message;
                    }
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