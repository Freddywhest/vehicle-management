if(document.forms.addWorkerFrom){
    let workerSchGrads;
    let workerSchNames;
    let workerSchLocs;
    let workerGrad;
    let workerSchoolName;
    let workerSchoolLoc;
    let inputParent;
    let selectParent;
    let textareaParent;
    let input;
    let small;
    
    let schoolGradErr;
    let schoolNameErr;
    let schoolLocErr;
    
    let genPassBtn;
    let schoolLocLabel;
    let schoolGradLabel;
    
    let workerExpCompany;
    let workerExpFrom;
    let workerExpTo;
    let workerExpPosition;
    let reasonForLeaving;
    let workerDeleteBtns;
    
    const tBody = document.querySelector('.table-border-bottom-0');
    const deleteErr =document.getElementById('deleteErr');
    
    let explainCrime;
    let pageNums;
    
    
    const addWorkerForm = document.forms.addWorkerFrom;
    const canWorkerBtn = document.getElementById('canWorkerBtn');
    const addWorkerBtn = document.getElementById('addWorkerBtn');
    const successDiv = document.getElementById('successDiv');
    const pageNumbers = document.querySelector('.pagination');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const genNewPassDiv =document.getElementById('genPass');
    const genPassBtnDiv =document.getElementById('genPassBtnDiv');
    document.addEventListener('click', () => {
        workerExpCompany = document.querySelectorAll('#workerExpCompany') ? document.querySelectorAll('#workerExpCompany') : null;
        workerExpFrom = document.querySelectorAll('#workerExpFrom') ? document.querySelectorAll('#workerExpFrom') : null;
        workerExpTo = document.querySelectorAll('#workerExpTo') ? document.querySelectorAll('#workerExpTo') : null;
        workerExpPosition = document.querySelectorAll('#workerExpPosition') ? document.querySelectorAll('#workerExpPosition') : null;
        reasonForLeaving = document.querySelectorAll('#reasonForLeaving') ? document.querySelectorAll('#reasonForLeaving') : null;
        
        explainCrime = document.querySelector('#explainCrime') ? document.querySelector('#explainCrime') : null;
    
        workerSchGrads = document.querySelectorAll('#workerSchGrad');
        workerSchNames = document.querySelectorAll('#workerSchName');
        workerSchLocs = document.querySelectorAll('#workerSchLoc');
    
        schoolGradErr = document.querySelectorAll('#schoolGradErr');
        schoolNameErr = document.querySelectorAll('#schoolNameErr');
        schoolLocErr = document.querySelectorAll('#schoolLocErr');
    
        schoolNameLabel = document.querySelectorAll('#schoolNameLabel');
        schoolLocLabel = document.querySelectorAll('#schoolLocLabel');
        schoolGradLabel = document.querySelectorAll('#schoolGradLabel');
    
        inputParent = document.querySelectorAll('#inputParent');
        selectParent = document.querySelectorAll('#selectParent');
        textareaParent = document.querySelectorAll('#textareaParent');
    
        pageNums = document.querySelectorAll('#pageNums');
    
        inputParent.forEach((child) => {
            const msg = `${child.querySelector('label').innerText.toLowerCase()} should not be empty`;
            child.querySelector('input').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('input').setAttribute('oninput', `this.setCustomValidity('')`)
        })
    
        selectParent.forEach((child) => {
            const msg = `Please select ${child.querySelector('label').innerText.toLowerCase()}`;
            child.querySelector('select').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('select').setAttribute('oninput', `this.setCustomValidity('')`)
        })
    
        textareaParent.forEach((child) => {
            const msg = `${child.querySelector('label').innerText.toLowerCase()} should not be empty`;
            child.querySelector('textarea').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('textarea').setAttribute('oninput', `this.setCustomValidity('')`)
        })
        
    });
    const loadingDiv = `
            <div class="text-center fs-3">
                <i class='bx bx-loader-alt bx-spin fs-1'></i>
            </div>
    `;
    
    closeDetails.addEventListener('click', () => {
        detailsBody.innerHTML = loadingDiv;
    })
    
    const detailDivShow = ({fullName, bateOfBirth, phoneOne, phoneTwo, idNumber, userEmail, address, city, employmentType, region,position,photo, salary, dateToStart, schoolName, schoolLocation, dateGrad, crime, companyName, periodFrom, periodTo, companyPosition, reason, majorSkills}) => {
    
        const schNames = schoolName ? schoolName.split('|') : schoolName;
        const schLocs = schoolLocation ? schoolLocation.split('|') : schoolLocation;
        const dateGrads = dateGrad ? dateGrad.split('|') : dateGrad;
        const companyNames = companyName ? companyName.split('|') : companyName;
        const periodFroms = periodFrom ? periodFrom.split('|') : periodFrom;
        const periodTos = periodTo ? periodTo.split('|') : periodTo;
        const companyPositions = companyPosition ? companyPosition.split('|') : companyPosition;
        const reasons = reason ? reason.split('|') : reason;
        return `
            <h6>Photo</h6> <a href="/uploads/users/${photo}" target="_blank"><img src="/uploads/users/${photo}" alt="user-avatar" class="d-block rounded" height="100" width="100" id="uploadedAvatar" /></a> <br>
            <h6>Name</h6> <p>${fullName}</p> <br>
            <h6>Date Of birth</h6> <p>${bateOfBirth}</p> <br>
            <h6>Phone Number One</h6> <p>${phoneOne}</p> <br>
            <h6>Phone Number Two</h6> <p>${phoneTwo}</p> <br>
            <h6>I.D Card Number</h6> <p>${idNumber}</p> <br>
            <h6>Email</h6> <p>${userEmail}</p> <br>
            <h6>Address</h6> <p>${address}</p> <br>
            <h6>City/Town</h6> <p>${city}</p> <br>
            <h6>Region</h6> <p>${region}</p> <br>
            <h6>Have you ever been convicted of a crime other than a minor traffic incident?</h6> <p>${crime ? 'Yes: ' + crime : 'No'}</p> <br>
            <h6>Employment Type</h6> <p>${employmentType}</p> <br>
            <h6>Position Applied For</h6> <p>${position}</p> <br>
            <h6>Desired Salary</h6> <p>${salary}</p> <br>
            <h6>Date you can start</h6> <p>${dateToStart}</p> <br>
            <h4>EDUCATION </h4><br>
            ${schoolName ? schNames.map((schName, index) => {return `<h6>School Name ${index+1}</h6> <p>${schName}</p> <br><h6>School Location ${index+1}</h6> <p>${schLocs[index]}</p> <br><h6>Date Graduated ${index+1}</h6> <p>${dateGrads[index]}</p> <hr>`}) : 'No Education background'}
    
            <h4>WORK EXPERIENCE </h4><br>
            ${companyName ? companyNames.map((companyName, index) => {return `<h6>Company Name ${index+1}</h6> <p>${companyName}</p> <br><h6>Period (From) ${index+1}</h6> <p>${periodFroms[index]}</p> <br><h6>Period (To) ${index+1}</h6> <p>${periodTos[index]}</p> <br /> <h6>Position ${index+1}</h6> <p>${companyPositions[index]}</p> <br><h6>Reason for leaving ${index+1}</h6> <p>${reasons[index]}</p><hr>`}) : 'No working experience <hr>'}
            
            <h6>Major Skills</h6> <p>${majorSkills}</p> <br>
            `;
    }
    
    const tableTr = (admin) => {
        return `
        <tr>
            <td> <strong>${admin.fullName}</strong></td>
            <td>${admin.userEmail}</td>
            <td>
            <ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                <li data-bs-toggle="tooltip" data-popup="tooltip-custom" data-bs-placement="top" class="avatar avatar-xs pull-up" title="${admin.fullName}'s Photo">
                <img src="/uploads/users/${admin.photo}" alt="${admin.photo}" class="rounded-circle">
                </li>
            </ul>
            </td>
            <td><span class="badge bg-label-primary me-1">${admin.userStatus}</span></td>
            <td>${admin.userRole}</td>
            <td>
                <div class="d-flex gap-10">
                    <a class="btn w-30 btn-outline-secondary me-2" href="workers/${admin.userUuid}"><i class="bx bx-edit-alt me-1"></i></a>
                    <button id="workerShowBtn" data-tid=${admin.userUuid} class="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                    <button id="workerDeleteBtn" data-tid=${admin.userUuid} class="btn btn-danger"><i class="bx bx-trash "></i></button>

                </div>
            </td>
        </tr>
    `;
    }
    
    const pagination  = (i, currentPage) => (`
        <li class="page-item ${ currentPage == i ? 'active' : ''}" page-number="${i}" id="pageNums">
            <a class="page-link" href="javascript:void(0);" id="pageNumsA">${i}</a>
        </li>
    `);
    
    const alertMsg = (alertColor, message) => {
        return `
            <div class="alert alert-${alertColor} alert-dismissible p-3" role="alert">
                ${message}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
              </button>
            </div>
        `
    }
    
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Add Worker`;
    
    
    const eduSchoolName = () => {
        let eduSchName = [];
        workerSchNames.forEach((workerSchName) => {
            eduSchName.push(workerSchName.value);
        });
        return eduSchName;
    }
    
    const eduSchoolLocation = () => {
        let eduSchLoc = [];
        workerSchLocs.forEach((workerSchLoc) => {
            eduSchLoc.push(workerSchLoc.value);
        });
        return eduSchLoc;
    }
    
    const eduSchoolGrad = () => {
        let eduSchGrad = [];
        workerSchGrads.forEach((workerSchGrad) => {
            eduSchGrad.push(workerSchGrad.value);
        });
        return eduSchGrad;
    }
    
    const workerExpCompanyName = () => {
        let workerExpComp = [];
        workerExpCompany.forEach((workerExpCom) => {
            workerExpComp.push(workerExpCom.value);
        });
        return workerExpComp;
    }
    
    const workerExpeFrom = () => {
        let workerExpF = [];
        workerExpFrom.forEach((workerExpFr) => {
            workerExpF.push(workerExpFr.value);
        });
        return workerExpF;
    }
    
    const workerExpeTo = () => {
        let workerExpT = [];
        workerExpTo.forEach((workerExpeT) => {
            workerExpT.push(workerExpeT.value);
        });
        return workerExpT;
    }
    
    const workerExpePosition = () => {
        let workerExpPos = [];
        workerExpPosition.forEach((workerExpPosi) => {
            workerExpPos.push(workerExpPosi.value);
        });
        return workerExpPos;
    }
    
    const reasonLeaving = () => {
        let reasonForLea = [];
        reasonForLeaving.forEach((reasonForLe) => {
            reasonForLea.push(reasonForLe.value);
        });
        return reasonForLea;
    }
    
    const APIGet = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const response = await request.json();
        return response;
    }
    
    const fetchWorkers = async (page) => {
        tBody.innerHTML = '';
        const fetchWorkers = await fetch('/api/workers?page='+page);
        const workers = await fetchWorkers.json();
        if(workers.message && workers.message == "Redirect"){
            document.location.href = "/logout"
        }else if(workers.status){
    
            workers.data.map((worker) => {
                tBody.innerHTML += tableTr(worker);
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
            for(let i = 1; i <= workers.totalPages; i++){
                pageNumbers.innerHTML += pagination(i, page);
            }
            page++;
            if(page > workers.totalPages){
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
    
    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        await fetchWorkers(page);
    });
    
    function setQueryStringParameter(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    }

    const APIDeleteData = async (data) => {
        const request = await fetch('/api/workers', {
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
            await fetchWorkers(page);
        }
    }
    
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        await fetchWorkers(page);

        if(document.querySelectorAll('#workerDeleteBtn')){
            workerDeleteBtns = document.querySelectorAll('#workerDeleteBtn');
            workerDeleteBtns.forEach((workerDeleteBtn) => {
                workerDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const workerId = workerDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workerId', workerId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                    /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
                });
            });
        }
    
        if(document.querySelectorAll('#workerShowBtn')){
            workerShowBtns = document.querySelectorAll('#workerShowBtn');
            workerShowBtns.forEach((workerShowBtn) => {
                workerShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    genPassBtnDiv.innerHTML = '';
                    genNewPassDiv.innerHTML = '';
                    const workerId = workerShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workerId', workerId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/workers', formData);
                    if(response.message && response.message == "Redirect"){
                        document.location.href = "/logout"
                        return;
                    }
    
                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                            if(!document.getElementById('genPassBtn')){
                                genPassBtnDiv.innerHTML += `<button type="button" id="genPassBtn" class="btn btn-primary">Set New Password For Worker</button>`

                            }
                            genPassBtn = document.getElementById('genPassBtn');
                            genPassBtn.addEventListener('click', async (e) => {
                                genPassBtn.innerHTML = loadingBtn;
                                genPassBtn.setAttribute('disabled', true);
                                    const dataB = new FormData();
                                try {
                                    dataB.append('workerId', workerId);
                                    dataB.append('method', 'UPDATEPASS');
                                    const genRequest = await fetch('/api/workers', {
                                        method: 'POST',
                                        body: dataB
                                    });
                                    const genResponse = await genRequest.json();
                                    if(genResponse.message && genResponse.message == "Redirect"){
                                        document.location.href = "/logout"
                                        return;
                                    }
                    
                                    if(genResponse.status){
                                        genNewPassDiv.innerHTML = `
                                        <div class="alert alert-info">
                                            <p>A new password is successfully set.</p>
                                            <p>New Password: <strong>${genResponse.newPassword}</strong></p>
                                        </div>`;

                                        genPassBtn.innerHTML = 'Set New Password For Worker';
                                        genPassBtn.removeAttribute('disabled');
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            })
                        }, 1500);
                    }
                });
            });
        }
    });
    
    
    document.addEventListener('mouseover', (e) => {
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        
        pageNums = document.querySelectorAll('#pageNums');
        pageNums.forEach((pageNum) => {
            pageNum.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                await fetchWorkers(parseInt(pageNum.getAttribute('page-number')));
                pageNums = document.querySelectorAll('#pageNums');
                setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')));
            }, false)
        });

        if(document.querySelectorAll('#workerDeleteBtn')){
            workerDeleteBtns = document.querySelectorAll('#workerDeleteBtn');
            workerDeleteBtns.forEach((workerDeleteBtn) => {
                workerDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const workerId = workerDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workerId', workerId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                    /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
                });
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
                await fetchWorkers(page - 1)
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
                await fetchWorkers(page + 1)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }
    
        if(document.querySelectorAll('#workerShowBtn')){
            workerShowBtns = document.querySelectorAll('#workerShowBtn');
            workerShowBtns.forEach((workerShowBtn) => {
                workerShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const workerId = workerShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workerId', workerId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/workers', formData);
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
        
    })
    
    
    
    addWorkerForm.addEventListener('submit', async (e) => {
        addWorkerBtn.innerHTML = loadingBtn;
        addWorkerBtn.setAttribute('disabled', true)
        canWorkerBtn.style.display = 'none';
        e.preventDefault();
     
            const formData = new FormData();
    
            const fullName = document.querySelector("[name='workerName']").value;
            const DoB = document.querySelector("[name='dob']").value;
            const workerRole = document.querySelector("[name='workerRole']").value;
            const workerPhone1 = document.querySelector("[name='workerPhone1']").value;
            const workerPhone2 = document.querySelector("[name='workerPhone2']").value;
            const workerId = document.querySelector("[name='workerId']").value;
            const workerEmail = document.querySelector("[name='workerEmail']").value;
            const workerAddress = document.querySelector("[name='workerAddress']").value;
            const workerCity = document.querySelector("[name='workerCity']").value;
            const workerRegion = document.querySelector("[name='workerRegion']").value;
            const workerEmpType = document.querySelector("[name='workerEmpType']").value;
            const workerEmpPosition = document.querySelector("[name='workerEmpPosition']").value;
            const workerEmpSalary = document.querySelector("[name='workerEmpSalary']").value;
            const workerStartDate = document.querySelector("[name='workerStartDate']").value;
            const workingExpRadio = document.querySelector("[name='workingExp-radio']").value;
            const workerMajorSkills = document.querySelector("[name='workerMajorSkills']").value;
            const workerPhoto = document.querySelector("[name='workerPhoto']").files[0];
            const eduSchoolNameValue = eduSchoolName().join('~');
            const eduSchoolLocationValue = eduSchoolLocation().join('~');
            const eduSchoolGradValue = eduSchoolGrad().join('~');
            const workerExpCompanyNameValue = workerExpCompanyName().join('~');
            const workerExpeFromValue = workerExpeFrom().join('~');
            const workerExpeToValue = workerExpeTo().join('~');
            const workerExpePositionValue = workerExpePosition().join('~');
            const reasonLeavingValue = reasonLeaving().join('~');
    
            formData.append('fullName', fullName);
            formData.append('DoB', DoB);
            formData.append('userRole', workerRole);
            formData.append('workerPhone1', workerPhone1);
            formData.append('workerPhone2', workerPhone2);
            formData.append('workerId', workerId);
            formData.append('workerEmail', workerEmail);
            formData.append('workerAddress', workerAddress);
            formData.append('workerCity', workerCity);
            formData.append('workerRegion', workerRegion);
            formData.append('crimeExplain', addWorkerForm.elements['crime-radio'].value === 'yes' ? explainCrime.value : '');
            formData.append('workerEmpType', workerEmpType);
            formData.append('workerEmpPosition', workerEmpPosition);
            formData.append('workerEmpSalary', workerEmpSalary);
            formData.append('workerStartDate', workerStartDate);
            formData.append('workerExpCompany', workingExpRadio === 'yes' ? workerExpCompanyNameValue : '');
            formData.append('workerExpFrom', workingExpRadio === 'yes' ? workerExpeFromValue : '');
            formData.append('workerExpTo', workingExpRadio === 'yes' ? workerExpeToValue : '');
            formData.append('workerExpPosition', workingExpRadio === 'yes' ? workerExpePositionValue : '');
            formData.append('reasonLeaving', workingExpRadio === 'yes' ? reasonLeavingValue : '');
            formData.append('eduSchoolName', eduSchoolNameValue);
            formData.append('eduSchoolLocation', eduSchoolLocationValue);
            formData.append('eduSchoolGrad', eduSchoolGradValue);
            formData.append('majorSkills', workerMajorSkills);
            formData.append('workerPhoto', workerPhoto);
            formData.append('method', 'POST');
            
            const fetching = await fetch('/api/add-worker', {
                method: 'POST',
                body: formData
            });
            const response = await fetching.json();
            document.querySelector('#pError').innerHTML = '';
            
            if(response.message == "Redirect"){
                document.location.href = "/logout"
            }else if(response.status){
                setTimeout(async () => {
                    addWorkerBtn.innerHTML = loadedBtn;
                    addWorkerBtn.removeAttribute('disabled')
                    canWorkerBtn.style.display = 'block';
    
                    successDiv.innerHTML = alertMsg('info', `<p>${response.message}</p> <p>Default Password: <strong>${response.Password}</strong></p>`)
    
                    inputParent.forEach((child) => {
                        child.querySelector('input').value = '';
                    })
                
                    selectParent.forEach((child) => {
                        child.querySelector('select').value = '';
                    })
                
                    textareaParent.forEach((child) => {
                        child.querySelector('textarea').value = '';
                    })
                    document.querySelector("#resetPhoto").click();
                    document.querySelector("#defaultRadio4").click();
                    document.querySelector("#defaultRadio2").click();
                    document.querySelectorAll("#removeSchool").forEach((closeBtn) => {
                        closeBtn.click();
                    });
                    await fetchWorkers(1);
                    document.querySelector("#canWorkerBtn").click();
                },1500);
            }else{
                document.querySelector('#pError').innerHTML = response.message;
                document.querySelector('#pError').style.color = 'red';
                addWorkerBtn.innerHTML = loadedBtn;
                addWorkerBtn.removeAttribute('disabled')
                canWorkerBtn.style.display = 'block';
            }
    })

}else if(document.forms.updateWorkerFrom){
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Update Worker`;
    const updateWorkerFrom = document.forms.updateWorkerFrom;
    let workerSchGrads;
    let workerSchNames;
    let workerSchLocs;
    let inputParent;
    let selectParent;
    let textareaParent;
    
    let workerExpCompany;
    let workerExpFrom;
    let workerExpTo;
    let workerExpPosition;
    let reasonForLeaving;
    
    let explainCrime;
    const addWorkerBtn = document.getElementById('addWorkerBtn');
    const successDiv = document.getElementById('successDiv');
    document.addEventListener('click', () => {
        workerExpCompany = document.querySelectorAll('#workerExpCompany') ? document.querySelectorAll('#workerExpCompany') : null;
        workerExpFrom = document.querySelectorAll('#workerExpFrom') ? document.querySelectorAll('#workerExpFrom') : null;
        workerExpTo = document.querySelectorAll('#workerExpTo') ? document.querySelectorAll('#workerExpTo') : null;
        workerExpPosition = document.querySelectorAll('#workerExpPosition') ? document.querySelectorAll('#workerExpPosition') : null;
        reasonForLeaving = document.querySelectorAll('#reasonForLeaving') ? document.querySelectorAll('#reasonForLeaving') : null;
        
        explainCrime = document.querySelector('#explainCrime') ? document.querySelector('#explainCrime') : null;
    
        workerSchGrads = document.querySelectorAll('#workerSchGrad');
        workerSchNames = document.querySelectorAll('#workerSchName');
        workerSchLocs = document.querySelectorAll('#workerSchLoc');
    
        schoolGradErr = document.querySelectorAll('#schoolGradErr');
        schoolNameErr = document.querySelectorAll('#schoolNameErr');
        schoolLocErr = document.querySelectorAll('#schoolLocErr');
    
        schoolNameLabel = document.querySelectorAll('#schoolNameLabel');
        schoolLocLabel = document.querySelectorAll('#schoolLocLabel');
        schoolGradLabel = document.querySelectorAll('#schoolGradLabel');
    
        inputParent = document.querySelectorAll('#inputParent');
        selectParent = document.querySelectorAll('#selectParent');
        textareaParent = document.querySelectorAll('#textareaParent');
    
        pageNums = document.querySelectorAll('#pageNums');
    
        inputParent.forEach((child) => {
            const msg = `${child.querySelector('label').innerText.toLowerCase()} should not be empty`;
            child.querySelector('input').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('input').setAttribute('oninput', `this.setCustomValidity('')`)
        })
    
        selectParent.forEach((child) => {
            const msg = `Please select ${child.querySelector('label').innerText.toLowerCase()}`;
            child.querySelector('select').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('select').setAttribute('oninput', `this.setCustomValidity('')`)
        })
    
        textareaParent.forEach((child) => {
            const msg = `${child.querySelector('label').innerText.toLowerCase()} should not be empty`;
            child.querySelector('textarea').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('textarea').setAttribute('oninput', `this.setCustomValidity('')`)
        })
        
    });
    const eduSchoolName = () => {
        let eduSchName = [];
        workerSchNames.forEach((workerSchName) => {
            eduSchName.push(workerSchName.value);
        });
        return eduSchName;
    }
    
    const eduSchoolLocation = () => {
        let eduSchLoc = [];
        workerSchLocs.forEach((workerSchLoc) => {
            eduSchLoc.push(workerSchLoc.value);
        });
        return eduSchLoc;
    }
    
    const eduSchoolGrad = () => {
        let eduSchGrad = [];
        workerSchGrads.forEach((workerSchGrad) => {
            eduSchGrad.push(workerSchGrad.value);
        });
        return eduSchGrad;
    }
    
    const workerExpCompanyName = () => {
        let workerExpComp = [];
        workerExpCompany.forEach((workerExpCom) => {
            workerExpComp.push(workerExpCom.value);
        });
        return workerExpComp;
    }
    
    const workerExpeFrom = () => {
        let workerExpF = [];
        workerExpFrom.forEach((workerExpFr) => {
            workerExpF.push(workerExpFr.value);
        });
        return workerExpF;
    }
    
    const workerExpeTo = () => {
        let workerExpT = [];
        workerExpTo.forEach((workerExpeT) => {
            workerExpT.push(workerExpeT.value);
        });
        return workerExpT;
    }
    
    const workerExpePosition = () => {
        let workerExpPos = [];
        workerExpPosition.forEach((workerExpPosi) => {
            workerExpPos.push(workerExpPosi.value);
        });
        return workerExpPos;
    }
    
    const reasonLeaving = () => {
        let reasonForLea = [];
        reasonForLeaving.forEach((reasonForLe) => {
            reasonForLea.push(reasonForLe.value);
        });
        return reasonForLea;
    }

    updateWorkerFrom.addEventListener('submit', async (e) => {
        e.preventDefault();
        addWorkerBtn.innerHTML = loadingBtn;
        addWorkerBtn.setAttribute('disabled', true)
     
            const formData = new FormData();
    
            const fullName = document.querySelector("[name='workerName']").value;
            const DoB = document.querySelector("[name='dob']").value;
            const workerRole = document.querySelector("[name='workerRole']").value;
            const workerPhone1 = document.querySelector("[name='workerPhone1']").value;
            const workerPhone2 = document.querySelector("[name='workerPhone2']").value;
            const workerId = document.querySelector("[name='workerId']").value;
            const workerEmail = document.querySelector("[name='workerEmail']").value;
            const workerAddress = document.querySelector("[name='workerAddress']").value;
            const workerCity = document.querySelector("[name='workerCity']").value;
            const workerRegion = document.querySelector("[name='workerRegion']").value;
            const workerEmpType = document.querySelector("[name='workerEmpType']").value;
            const workerEmpPosition = document.querySelector("[name='workerEmpPosition']").value;
            const workerEmpSalary = document.querySelector("[name='workerEmpSalary']").value;
            const workerStartDate = document.querySelector("[name='workerStartDate']").value;
            const workingExpRadio = document.querySelector("[name='workingExp-radio']").value;
            const workerMajorSkills = document.querySelector("[name='workerMajorSkills']").value;
            const workerPhoto = document.querySelector("[name='workerPhoto']").files[0];
            const eduSchoolNameValue = eduSchoolName().join('~');
            const eduSchoolLocationValue = eduSchoolLocation().join('~');
            const eduSchoolGradValue = eduSchoolGrad().join('~');
            const workerExpCompanyNameValue = workerExpCompanyName().join('~');
            const workerExpeFromValue = workerExpeFrom().join('~');
            const workerExpeToValue = workerExpeTo().join('~');
            const workerExpePositionValue = workerExpePosition().join('~');
            const reasonLeavingValue = reasonLeaving().join('~');
    
            formData.append('fullName', fullName);
            formData.append('DoB', DoB);
            formData.append('userRole', workerRole);
            formData.append('workerPhone1', workerPhone1);
            formData.append('workerPhone2', workerPhone2);
            formData.append('workerId', workerId);
            formData.append('workerEmail', workerEmail);
            formData.append('workerAddress', workerAddress);
            formData.append('workerCity', workerCity);
            formData.append('workerRegion', workerRegion);
            formData.append('crimeExplain', updateWorkerFrom.elements['crime-radio'].value === 'yes' ? explainCrime.value : '');
            formData.append('workerEmpType', workerEmpType);
            formData.append('workerEmpPosition', workerEmpPosition);
            formData.append('workerEmpSalary', workerEmpSalary);
            formData.append('workerStartDate', workerStartDate);
            formData.append('workerExpCompany', workingExpRadio === 'yes' ? workerExpCompanyNameValue : '');
            formData.append('workerExpFrom', workingExpRadio === 'yes' ? workerExpeFromValue : '');
            formData.append('workerExpTo', workingExpRadio === 'yes' ? workerExpeToValue : '');
            formData.append('workerExpPosition', workingExpRadio === 'yes' ? workerExpePositionValue : '');
            formData.append('reasonLeaving', workingExpRadio === 'yes' ? reasonLeavingValue : '');
            formData.append('eduSchoolName', eduSchoolNameValue);
            formData.append('eduSchoolLocation', eduSchoolLocationValue);
            formData.append('eduSchoolGrad', eduSchoolGradValue);
            formData.append('majorSkills', workerMajorSkills);
            formData.append('workerPhoto', workerPhoto);
            formData.append('method', 'UPDATE');
            
            const fetching = await fetch('/api/workers?uid='+new URL(document.location.href).pathname.split('/').filter(n => n)[1], {
                method: 'POST',
                body: formData
            });
            const response = await fetching.json();
            document.querySelector('#pError').innerHTML = '';
            
            if(response.message == "Redirect"){
                document.location.href = "/logout"
            }else if(response.status){
                window.scrollTo({ 
                    top: 0, 
                    behavior: "smooth" });
                document.querySelector('#pError').innerHTML = "Worker updating......";
                document.querySelector('#pError').style.color = 'green';
                setTimeout(async () => {
                    window.location.search = 's=u'
                },1500);
            }else{
                document.querySelector('#pError').innerHTML = response.message;
                document.querySelector('#pError').style.color = 'red';
                addWorkerBtn.innerHTML = loadedBtn;
                addWorkerBtn.removeAttribute('disabled')
            }
    });

    document.addEventListener('DOMContentLoaded', () => {
        let params = (new URL(document.location)).searchParams;
        if(params.get("s")){
            document.querySelector('#pError').innerHTML = "Worker updated successfully!";
            document.querySelector('#pError').style.color = 'green';

        }
    })
}