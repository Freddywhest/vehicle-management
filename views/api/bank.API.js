if(new URL(document.location.href).pathname === '/bank-deposit'){
    const depositErr = document.getElementById('depositErr');
    const bankBalance = document.getElementById('bank-bal');
    const bankDeposits = document.getElementById('bank-dep');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Deposit`;
    const amount = document.querySelector('[name="amount"]');
    const depositForm = document.forms.depositForm;

    const APIPostRequest = async(url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const response = await request.json();
        return response;
    };

    const APIGetRequest = async(url) => {
        const request = await fetch(url)
        const response = await request.json();
        return response;
    };

    document.addEventListener('DOMContentLoaded', async () => {
        const response = await APIGetRequest('/api/totals?type=bank');
        bankBalance.style.color = parseInt(response.data.bankBalance) < 0 ? 'red' : ''
        bankBalance.innerText = `GH₵ ${response.data.bankBalance}`;
        bankDeposits.innerText = `GH₵ ${response.data.totalDeposit}`;
    })

    depositForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        depositForm.querySelector('button').setAttribute('disabled', true);
        depositForm.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
        formData.append('type', 'deposit');
        formData.append('method', 'POST');
        formData.append('amount', amount.value);
        const response = await APIPostRequest('/api/bank', formData);
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            depositForm.querySelector('button').removeAttribute('disabled');
            depositForm.querySelector('button').innerHTML = loadedBtn;
            depositErr.innerText = response.message;
            depositErr.style.color = 'red';

        }else{
            depositErr.innerText = response.message;
            depositErr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/bank-transactions'
            }, 1000);
        }
    })

}else if(new URL(document.location.href).pathname === '/bank-withdraw'){
    const withdrawErr = document.getElementById('withdrawErr');
    const bankBalance = document.getElementById('bank-bal');
    const bankWithdrawals = document.getElementById('bank-with');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Withdraw`;
    const amount = document.querySelector('[name="amount"]');
    const purpose = document.querySelector('[name="purpose"]');
    const withdrawForm = document.forms.withdrawForm;

    const APIPostRequest = async(url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const response = await request.json();
        return response;
    };

    const APIGetRequest = async(url) => {
        const request = await fetch(url)
        const response = await request.json();
        return response;
    };

    document.addEventListener('DOMContentLoaded', async () => {
        const response = await APIGetRequest('/api/totals?type=bank');
        bankBalance.style.color = parseInt(response.data.bankBalance) < 0 ? 'red' : ''
        bankBalance.innerText = `GH₵ ${response.data.bankBalance}`;
        bankWithdrawals.innerText = `GH₵ ${response.data.totalWithdraw}`;
    })

    withdrawForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        withdrawForm.querySelector('button').setAttribute('disabled', true);
        withdrawForm.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
        formData.append('type', 'withdraw');
        formData.append('purpose', purpose.value);
        formData.append('method', 'POST');
        formData.append('amount', amount.value);
        const response = await APIPostRequest('/api/bank', formData);
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            withdrawForm.querySelector('button').removeAttribute('disabled');
            withdrawForm.querySelector('button').innerHTML = loadedBtn;
            withdrawErr.innerText = response.message;
            withdrawErr.style.color = 'red';

        }else{
            withdrawErr.innerText = response.message;
            withdrawErr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/bank-transactions'
            }, 1000);
        }
    })

}else if(new URL(document.location.href).pathname === '/bank-transactions'){
    let bankDeleteBtns;
    let bankShowBtns;
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

    const detailDivShow = ({amount, fullName, purpose, transactionDate, transactionType}) => {
        return `
            <h6>Date</h6> <p>${transactionDate}</p> <br>
            <h6>Amount</h6> <p>${amount}</p> <br>
            <h6>Transaction Type</h6> <p>${transactionType}</p> <br>
            <h6>Made By</h6> <p>${fullName ? fullName : 'Unknown'}</p> <br>
            ${transactionType === 'withdraw' ? `<h6>Purpose</h6> <p>${purpose ? purpose : '-'}</p>` : ''}
            
        `;
    }

    const tableTr = ({amount, transactionDate, transactionType, fullName, id, purpose}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${transactionDate}</strong></td>
                <td>GH₵ ${amount}</td>
                <td>${transactionType}</td>
                <td>${fullName ? fullName : 'Unknown'}</td>
                <td>${purpose ? truncate(purpose, 20) : '-'}</td>
                <td>
                    <button id="bankShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable"><i class="bx bx-show"></i></button>
                    <button id="bankDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${transactionDate}</strong></td>
                <td>GH₵ ${amount}</td>
                <td>${transactionType}</td>
                <td>${fullName ? fullName : 'Unknown'}</td>
                <td>${purpose ? truncate(purpose, 20) : '-'}</td>
                <td>
                    <button id="bankShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable"><i class="bx bx-show"></i></button>
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
        const request = await fetch('/api/bank?page='+page+'&&filter='+newFilter);
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((bank) => {
                tBody.innerHTML += tableTr(bank, response.role);
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
        const request = await fetch('/api/bank', {
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
        if(document.querySelectorAll('#bankDeleteBtn')){
            bankDeleteBtns = document.querySelectorAll('#bankDeleteBtn');
            bankDeleteBtns.forEach((bankDeleteBtn) => {
                bankDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const bankId = bankDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('bankId', bankId);
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

        
        if(document.querySelectorAll('#bankShowBtn')){
            bankShowBtns = document.querySelectorAll('#bankShowBtn');
            bankShowBtns.forEach((bankShowBtn) => {
                bankShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const bankId = bankShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('bankId', bankId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/bank', formData);
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
        if(document.querySelectorAll('#bankDeleteBtn')){
            bankDeleteBtns = document.querySelectorAll('#bankDeleteBtn');
            bankDeleteBtns.forEach((bankDeleteBtn) => {
                bankDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const bankId = bankDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('bankId', bankId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
        
        if(document.querySelectorAll('#bankShowBtn')){
            bankShowBtns = document.querySelectorAll('#bankShowBtn');
            bankShowBtns.forEach((bankShowBtn) => {
                bankShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const bankId = bankShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('bankId', bankId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/bank', formData);
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

    filterSelect.addEventListener('change', (e) => {
        e.preventDefault();
        const page = 1;
        const filter = filterSelect.value;
        setQueryStringParameter('filter', filter)
        setQueryStringParameter('page', page)
        APIGetData(page, filter);
    })
}
