/* ?uid='+new URL(document.location.href).pathname.split('/').filter(n => n)[1]  */
if(document.forms.addDriver){
    const successDiv = document.getElementById('successDiv');
    const pageNumbers = document.querySelector('.pagination');
    const addDriverBtn = document.querySelector('#addDriverBtn');
    const canDriverBtn = document.querySelector('#canDriverBtn');
    const tBody = document.querySelector('.table-border-bottom-0');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const addDriver = document.forms.addDriver;
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
    const searchDriverForm =document.forms.searchDriverForm;
    
        
    const APIGet = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const response = await request.json();
        return response;
    }

    
    const loadingDiv = `
    <div class="text-center fs-3">
        <i class='bx bx-loader-alt bx-spin fs-1'></i>
    </div>
    `;
    
    closeDetails.addEventListener('click', () => {
        detailsBody.innerHTML = loadingDiv;
    })
    
    const detailDivShow = ({accidentRecord, bateOfBirth, convictedFelony, crime, curAddress, currentlyEmp, dateAdded, driverFullName, driverIdNo, driverPhoto, drivingLicense, email, emergence, expBus, expTaxi, expTractor, expTrailer, expTruck, expVan, fullKnowledge, highestEdu, idNumber, model, phoneHome, phoneMobile, position, prevAddress, prevCity, prevRegion, preventedLawful, regisNumber, salary, traffic, workedInCompany}) => {
    
    const curAddresses = curAddress ? curAddress.split('|') : curAddress;
    const prevAddresses = prevAddress ? prevAddress.split('|') : prevAddress;
    const prevFroms = prevCity ? prevCity.split('|') : prevCity;
    const prevTos = prevRegion ? prevRegion.split('|') : prevRegion;
    const emergences = emergence ? emergence.split('|') : emergence;
    const workedInCompanys = workedInCompany ? workedInCompany.split('|') : workedInCompany;
    const drivingLicenses = drivingLicense ? drivingLicense.split('|') : drivingLicense;
    const highestEdus = highestEdu ? highestEdu.split('|') : highestEdu;
    
    const expBuss = expBus ? expBus.split('|') : expBus;
    const expTaxis = expTaxi ? expTaxi.split('|') : expTaxi;
    const expTractors = expTractor ? expTractor.split('|') : expTractor;
    const expTrailers = expTrailer ? expTrailer.split('|') : expTrailer;
    const expTrucks = expTruck ? expTruck.split('|') : expTruck;
    const expVans = expVan ? expVan.split('|') : expVan;
    
    const accidentRecords = accidentRecord ? accidentRecord.split('|') : accidentRecord;
    const traffics = traffic ? traffic.split('|') : traffic;
    return `
        <h6>Photo</h6> <a href="/uploads/drivers/${driverPhoto}" target="_blank"><img src="/uploads/drivers/${driverPhoto}" alt="user-avatar" class="d-block rounded" height="100" width="100" id="uploadedAvatar" /></a> <br>
        <h6>Name</h6> <p>${driverFullName}</p> <br>
        <h6>Date driver was registered </h6> <p>${dateAdded}</p> <br>
        <h6>Driver's Identity Number </h6> <p>${driverIdNo}</p> <br>
        <h6>Date Of birth</h6> <p>${bateOfBirth}</p> <br>
        <h6>Phone Number(Home)</h6> <p>${phoneHome}</p> <br>
        <h6>Phone Number (Mobile)</h6> <p>${phoneMobile}</p> <br>
        <h6>I.D Card Number</h6> <p>${idNumber}</p> <br>
        <h6>Email</h6> <p>${email}</p>
        <h6>Position Applied</h6> <p>${position}</p>
        <h6>Salary</h6> <p>${salary}</p><hr />
        <h6>Current Address</h6> <p>${curAddresses[0] ? curAddresses[0] : '-'}</p>
        <h6>From </h6> <p>${curAddresses[1] ? curAddresses[1] : '-'}</p>
        <h6>To</h6> <p>${curAddresses[2] ? curAddresses[2] : '-'}</p> <hr>
    
        <h6>Driver's Previous Addresses</h6> <br>
        ${prevAddresses ? prevAddresses.map((prevAddress, index) => {return `<h6>Previous Address ${index+1}</h6> <p>${prevAddress}</p> <br><h6>From ${index+1}</h6> <p>${prevFroms[index]}</p> <br><h6>To ${index+1}</h6> <p>${prevTos[index]}</p> <hr>`}) : 'No Previous Addresses <hr>'}
    
        <h6>In case of emergency, notify:</h6><br />
        <h6>Name</h6> <p>${emergences[0] ? emergences[0] : '-'}</p> <br>
        <h6>Contact Number</h6> <p>${emergences[1] ? emergences[1] : '-'}</p> <hr>
        
        <h6>Driver's Previous Working Company</h6>
        ${workedInCompanys ? `<h6>Yes</h6> <br /> <h6>From</h6> <p>${workedInCompanys[0] ? workedInCompanys[0] : '-'}</p> <hr>
        <h6>To</h6> <p>${workedInCompanys[1] ? workedInCompanys[1] : '-'}</p> <hr>` : 'No Previous Working Company <hr />'}
    
        <h6>Is driver prevented from lawful employment as a driver as profession?</h6> <p>${preventedLawful}</p> <hr />
    
        <h6>Has driver ever been convicted of a felony, misdemeanor or criminal violation?</h6> <p>${convictedFelony}</p> <hr />
        <h6>Do driver has full knowledge of the Federal Motor Carreer Safety Regulation?</h6> <p>${fullKnowledge}</p> <hr />
    
        <h4>DRIVER'S LICENSE INFORMATION  </h4><br>
        <h6>Driver's license number</h6> <p>${drivingLicenses[0] ? drivingLicenses[0] : '-'}</p> <br>
        <h6>City/Town</h6> <p>${drivingLicenses[1] ? drivingLicenses[1] : '-'}</p> <br>
        <h6>Expiration date</h6> <p>${drivingLicenses[2] ? drivingLicenses[2] : '-'}</p> <br>
        <h6>License Type</h6> <p>${drivingLicenses[3] ? drivingLicenses[3] : '-'}</p> <hr>
    
        <h4>EDUCATION</h4><br>
        <h6>Driver's Highest Education</h6> <p>${highestEdus[0] ? highestEdus[0] : '-'}</p> <br>
        <h6>Completed On</h6> <p>${highestEdus[1] ? highestEdus[1] : '-'}</p> <hr>
    
        <h4>DRIVING EXPERIENCE</h4><br>
        <h6>Tractor</h6>
        ${expTractors ? `<h6>Type of equipment</h6> <p>${expTractors[0] ? expTractors[0] : '-'}</p>
        <h6>Number of years</h6> <p>${expTractors[1] ? expTractors[1] : '-'}</p> <br> <h6>States driven in</h6> <p>${expTractors[2] ? expTractors[2] : '-'}</p>` : 'No Tractor Experience'} <br> <br>
    
        <h6>Truck</h6>
        ${expTrucks ? `<h6>Type of equipment</h6> <p>${expTrucks[0] ? expTrucks[0] : '-'}</p>
        <h6>Number of years</h6> <p>${expTrucks[1] ? expTrucks[1] : '-'}</p> <br> <h6>States driven in</h6> <p>${expTrucks[2] ? expTrucks[2] : '-'}</p>` : 'No Truck Experience'} <br> <br>
    
        <h6>Trailer</h6>
        ${expTrailers ? `<h6>Type of equipment</h6> <p>${expTrailers[0] ? expTrailers[0] : '-'}</p>
        <h6>Number of years</h6> <p>${expTrailers[1] ? expTrailers[1] : '-'}</p> <br> <h6>States driven in</h6> <p>${expTrailers[2] ? expTrailers[2] : '-'}</p> ` : 'No Trailer Experience'} <br> <br>
    
        <h6>Bus</h6>
        ${expBuss ? `<h6>Type of equipment</h6> <p>${expBuss[0] ? expBuss[0] : '-'}</p>
        <h6>Number of years</h6> <p>${expBuss[1] ? expBuss[1] : '-'}</p> <br> <h6>States driven in</h6> <p>${expBuss[2] ? expBuss[2] : '-'}</p>` : 'No Bus Experience'} <br> <br>
    
        <h6>Van</h6>
        ${expVans ? `<h6>Type of equipment</h6> <p>${expVans[0] ? expVans[0] : '-'}</p>
        <h6>Number of years</h6> <p>${expVans[1] ? expVans[1] : '-'}</p> <br> <h6>States driven in</h6> <p>${expVans[2] ? expVans[2] : '-'}</p>` : 'No Van Experience'} <br> <br>
    
        <h6>Taxi cab</h6>
        ${expTaxis ? `<h6>Type of equipment</h6> <p>${expTaxis[0] ? expTaxis[0] : '-'}</p>
        <h6>Number of years</h6> <p>${expTaxis[1] ? expTaxis[1] : '-'}</p> <br> <h6>States driven in</h6> <p>${expTaxis[2] ? expTaxis[2] : '-'}</p>` : 'No Taxi cab Experience'} <br> <br>
        <hr />
    
        <h4>ACCIDENT RECORD LAST 3 YEARS</h4>
        ${accidentRecords ? `<h6>Date of accident</h6> <p>${accidentRecords[0] ? accidentRecords[0] : '-'}</p>
        <h6>Nature of accident</h6> <p>${accidentRecords[1] ? accidentRecords[1] : '-'}</p> <br> <h6>Number of fatalities</h6> <p>${accidentRecords[2] ? accidentRecords[2] : '-'}</p> <br> <h6>Number of injuries</h6> <p>${accidentRecords[3] ? accidentRecords[3] : '-'}</p> <br>` : 'No Accident Record'} <hr />
    
        <h4>TRAFFIC CONVICTIONS LAST 3 YEARS OTHER THAN PARKING</h4>
        ${traffics ? `<h6>Date of violation</h6> <p>${traffics[0] ? traffics[0] : '-'}</p>
        <h6>Violation</h6> <p>${traffics[1] ? traffics[1] : '-'}</p> <br> <h6>State</h6> <p>${traffics[2] ? traffics[2] : '-'}</p> <br> <h6>Penalty</h6> <p>${traffics[3] ? traffics[3] : '-'}</p> <br>` : 'No Traffic Convictions'} <hr />
    `;
    }
    
    
    const tableTr = (driver) => {
        return `
        <tr>
            <td> <strong>${driver.driverFullName}</strong></td>
            <td>${driver.driverIdNo}</td>
            <td>${driver.email}</td>
            <td>${driver.model ? driver.model : 'No Vehicle Yet'}</td>
            <td>${driver.regisNumber ? driver.regisNumber : '-'}</td>
            <td>
                <div class="d-flex">
                    <a class="btn w-30 btn-outline-secondary me-2" href="/drivers/${driver.driverUuid}"><i class="bx bx-edit-alt me-1"></i> </a>
                    <button id="driverShowBtn" type="button"  data-bs-toggle="modal" data-bs-target="#modalScrollable2" class="btn w-30 btn-info me-2" data-tid="${driver.driverUuid}"><i class="bx bx-show me-1"></i> </button>
                    <button id="driverDeleteBtn" data-tid=${driver.driverUuid} class="btn btn-danger"><i class="bx bx-trash "></i></button>
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
    };
    
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Add Driver`;
    
    const fetchDrivers = async (page, search) => {
        tBody.innerHTML = '';
        const fetchDrivers = await fetch('/api/drivers?search='+search+'&&page='+page);
        const drivers = await fetchDrivers.json();
        console.log(drivers);
        if(drivers.message && drivers.message == "Redirect"){
            document.location.href = "/logout"
        }else if(drivers.status){
    
            drivers.data.map((driver) => {
                tBody.innerHTML += tableTr(driver);
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
            for(let i = 1; i <= drivers.totalPages; i++){
                pageNumbers.innerHTML += pagination(i, page);
            }
            page++;
            if(page > drivers.totalPages){
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
        const request = await fetch('/api/drivers', {
            method: 'POST',
            body: data
        });
        const response = await request.json();
        if(response.message && response.message == "Redirect"){
            document.location.href = "/logout"
            return;
        }

        if(!response.status){
            successDiv.innerHTML = response.message;
            successDiv.style.color = 'red';
        }else{
            const params = new URLSearchParams(window.location.search);
            const page = 1;
            const search = params.get('search') ? params.get('search') : '';
            successDiv.innerHTML = "Driver successfully deleted!";
            successDiv.style.color = 'green';
            await fetchDrivers(page, search);
        }
    }
    
    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        await fetchDrivers(page, search);
    });
    
    function setQueryStringParameter(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    }
    
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        searchDriver.value = search;
        await fetchDrivers(page, search);
    
        if(document.querySelectorAll('#driverShowBtn')){
            driverShowBtns = document.querySelectorAll('#driverShowBtn');
            driverShowBtns.forEach((driverShowBtn) => {
                driverShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const driverId = driverShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('driverId', driverId);
                    formData.append('method', 'GET');
                    console.log(driverId);
                    const response = await APIGet('/api/drivers', formData);
                    console.log(response);
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
    
    
    document.addEventListener('mouseover', (e) => {
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        
        pageNums = document.querySelectorAll('#pageNums');
        pageNums.forEach((pageNum) => {
            pageNum.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                await fetchDrivers(parseInt(pageNum.getAttribute('page-number')), search);
                pageNums = document.querySelectorAll('#pageNums');
                setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')));
            }, false)
        });

        if(document.querySelectorAll('#driverDeleteBtn')){
            let driverDeleteBtns = document.querySelectorAll('#driverDeleteBtn');
            driverDeleteBtns.forEach((driverDeleteBtn) => {
                driverDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const driverId = driverDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('driverId', driverId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                    /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
                });
            });
        }

        if(document.querySelector('.prev')){
            document.querySelector('.prev').addEventListener('click', async () => {
                if(document.querySelector('.prev').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.prev').classList.add('disabled');
                await fetchDrivers(page - 1, search)
                setQueryStringParameter('page', page - 1)
                document.querySelector('.prev').classList.remove('disabled');
            });
        }
    
        if(document.querySelector('.next')){
            document.querySelector('.next').addEventListener('click',async () => {
                if(document.querySelector('.next').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.next').classList.add('disabled');
                await fetchDrivers(page + 1, search)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }
    
        if(document.querySelectorAll('#driverShowBtn')){
            driverShowBtns = document.querySelectorAll('#driverShowBtn');
            driverShowBtns.forEach((driverShowBtn) => {
                driverShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const driverId = driverShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('driverId', driverId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/drivers', formData);
                    console.log(response);
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
    
    addDriver.addEventListener('submit', async (e) => {
        addDriverBtn.innerHTML = loadingBtn;
        addDriverBtn.setAttribute('disabled', true)
        canDriverBtn.style.display = 'none';
        e.preventDefault();
     
            const formData = new FormData();
            const d = new Date();
    
            const fullName = document.querySelector("[name='driverName']");
            const DoB = document.querySelector("[name='dob']");
            const phoneOne = document.querySelector("[name='phoneOne']");
            const phoneTwo = document.querySelector("[name='phoneTwo']");
            const idNumber = document.querySelector("[name='idNumber']");
            const driverEmail = document.querySelector("[name='driverEmail']");
            const curAddress = document.querySelector("[name='curAddress']");
            const curFrom = document.querySelector("[name='curFrom']");
            const curTo = document.querySelector("[name='curTo']");
            const addressRadio = document.querySelector("[name='address-radio']");
            const notifyName = document.querySelector("[name='notifyName']");
            const nContact = document.querySelector("[name='nContact']");
            const position = document.querySelector("[name='position']");
            const salary = document.querySelector("[name='salary']");
            const workedRadio = document.querySelector("[name='worked-radio']");
            const employedRadio = document.querySelector("[name='employed-radio']");
            const preventedRadio = document.querySelector("[name='prevented-radio']:checked");
            const convictedRadio = document.querySelector("[name='convicted-radio']:checked");
            const carreerRadio = document.querySelector("[name='carreer-radio']:checked");
            const tractorRadio = document.querySelector("[name='employed-radio']");
            const truckRadio = document.querySelector("[name='truck-radio']");
            const trailerRadio = document.querySelector("[name='trailer-radio']");
            const busRadio = document.querySelector("[name='bus-radio']");
            const vanRadio = document.querySelector("[name='van-radio']");
            const taxiRadio = document.querySelector("[name='taxi-radio']");
            const accidentRadio = document.querySelector("[name='accident-radio']");
            const trafficRadio = document.querySelector("[name='traffic-radio']");
            const lNumber = document.querySelector("[name='lNumber']");
            const lCity = document.querySelector("[name='lCity']");
            const lExpDate = document.querySelector("[name='lExpDate']");
            const lType = document.querySelector("[name='lType']");
            const hEdu = document.querySelector("[name='hEdu']");
            const compOn = document.querySelector("[name='compOn']");
            const prevOne = document.querySelector("[name='prevOne']");
            const prevFrom1 = document.querySelector("[name='prevFrom1']");
            const prevTo1 = document.querySelector("[name='prevTo1']");
            const prevTwo = document.querySelector("[name='prevTwo']");
            const prevFrom2 = document.querySelector("[name='prevFrom2']");
            const prevTo2 = document.querySelector("[name='prevTo2']");
            const prevThree = document.querySelector("[name='prevThree']");
            const prevFrom3 = document.querySelector("[name='prevFrom3']");
            const prevTo3 = document.querySelector("[name='prevTo3']");
            const availableOn = document.querySelector("[name='availableOn']");
            const prevFromWorked = document.querySelector("[name='prevFromWorked']");
            const prevToWorked = document.querySelector("[name='prevToWorked']");
            const truckEquipType = document.querySelector("[name='truckEquipType']");
            const truckYears = document.querySelector("[name='truckYears']");
            const truckStates = document.querySelector("[name='truckStates']");
            const trailerEquipType = document.querySelector("[name='trailerEquipType']");
            const trailerYears = document.querySelector("[name='trailerYears']");
            const trailerStates = document.querySelector("[name='trailerStates']");
            const tractorEquipType = document.querySelector("[name='tractorEquipType']");
            const tractorYears = document.querySelector("[name='tractorYears']");
            const tractorStates = document.querySelector("[name='tractorStates']");
            const busEquipType = document.querySelector("[name='tractorStates']");
            const busYears = document.querySelector("[name='busYears']");
            const busStates = document.querySelector("[name='tractorStates']");
            const vanEquipType = document.querySelector("[name='tractorStates']");
            const vanYears = document.querySelector("[name='vanYears']");
            const vanStates = document.querySelector("[name='vanStates']");
            const taxiEquipType = document.querySelector("[name='taxiEquipType']");
            const taxiYears = document.querySelector("[name='taxiYears']");
            const taxiStates = document.querySelector("[name='taxiStates']");
            const dateAccidentNature = document.querySelector("[name='dateAccidentNature']");
            const accidentNature = document.querySelector("[name='accidentNature']");
            const fatalities = document.querySelector("[name='fatalities']");
            const injuries = document.querySelector("[name='injuries']");
            const dateViolation = document.querySelector("[name='dateViolation']");
            const violation = document.querySelector("[name='violation']");
            const state = document.querySelector("[name='state1']");
            const penalty = document.querySelector("[name='penalty']");
            const photo = document.querySelector("[name='driverPhoto']");
    
            formData.append('fullName', fullName.value);
            formData.append('DoB', DoB.value);
            formData.append('phoneOne', phoneOne.value);
            formData.append('phoneTwo', phoneTwo.value);
            formData.append('idNumber', idNumber.value);
            formData.append('driverEmail', driverEmail.value);
            formData.append('curAddress', curAddress.value);
            formData.append('curFrom', curFrom.value);
            formData.append('curTo', curTo.value);
            formData.append('notifyName', notifyName.value);
            formData.append('nContact', nContact.value);
            formData.append('position', position.value);
            formData.append('salary', salary.value);
            formData.append('lNumber', lNumber.value);
            formData.append('lCity', lCity.value);
            formData.append('lExpDate', lExpDate.value);
            formData.append('lType', lType.value);
            formData.append('hEdu', hEdu.value);
            formData.append('compOn', compOn.value);
            formData.append('prevOne', prevOne && prevOne.value ? prevOne.value : '');
            formData.append('prevFrom1', prevFrom1 && prevFrom1.value ? prevFrom1.value : '');
            formData.append('prevTo1', prevTo1 && prevTo1.value ? prevTo1.value : '');
            formData.append('prevTwo', prevTwo && prevTwo.value ? prevTwo.value : '');
            formData.append('prevFrom2', prevFrom2 && prevFrom2.value ? prevFrom2.value : '');
            formData.append('prevTo2', prevTo2 && prevTo2.value ? prevTo2.value : '');
            formData.append('prevThree', prevThree && prevThree.value ? prevThree.value : '');
            formData.append('prevFrom3', prevFrom3 && prevFrom3.value ? prevFrom3.value : '');
            formData.append('prevTo3', prevTo3 && prevTo3.value ? prevTo3.value : '');
            formData.append('prevFromWorked',  prevFromWorked &&  prevFromWorked.value ? prevFromWorked.value : '');
            formData.append('prevToWorked', prevFromWorked && prevFromWorked.value ? prevToWorked.value : '');
            formData.append('availableOn', availableOn && availableOn.value ? availableOn.value :  d.toISOString().split('T')[0]);
            formData.append('truckEquipType', truckEquipType && truckEquipType.value ? truckEquipType.value : '');
            formData.append('truckYears', truckYears && truckYears.value  ? truckYears.value : '');
            formData.append('truckStates', truckStates && truckStates.value ? truckStates.value : '');
            formData.append('trailerEquipType', trailerEquipType && trailerEquipType.value ? trailerEquipType.value : '');
            formData.append('trailerYears', trailerYears && trailerYears.value ? trailerYears.value : '');
            formData.append('trailerStates', trailerStates && trailerStates.value ? trailerStates.value : '');
            formData.append('busEquipType', busEquipType && busEquipType.value ? busEquipType.value : '');
            formData.append('busYears', busYears && busYears.value ? busYears.value : '');
            formData.append('busStates', busStates && busStates.value ? busStates.value : '');
            formData.append('tractorEquipType', tractorEquipType && tractorEquipType.value ? tractorEquipType.value : '');
            formData.append('tractorYears',tractorYears && tractorYears.value ? tractorYears.value : '');
            formData.append('tractorStates', tractorStates && tractorStates.value ? tractorStates.value : '');
            formData.append('vanEquipType', vanEquipType && vanEquipType.value ? vanEquipType.value : '');
            formData.append('vanYears', vanYears && vanYears.value ? vanYears.value : '');
            formData.append('vanStates', vanStates && vanStates.value ? vanStates.value : '');
            formData.append('taxiEquipType', taxiEquipType && taxiEquipType.value ? taxiEquipType.value : '');
            formData.append('taxiYears', taxiYears && taxiYears.value ? taxiYears.value : '');
            formData.append('taxiStates', taxiStates && taxiStates.value ? taxiStates.value : '');
            formData.append('dateAccidentNature', dateAccidentNature && dateAccidentNature.value ? dateAccidentNature.value : '');
            formData.append('accidentNature', accidentNature && accidentNature.value  ? accidentNature.value : '');
            formData.append('fatalities', fatalities && fatalities.value  ? fatalities.value : '');
            formData.append('injuries', injuries && injuries.value  ? injuries.value : '');
            formData.append('dateViolation', dateViolation && dateViolation.value  ? dateViolation.value : '');
            formData.append('violation', violation && violation.value ? violation.value : '');
            formData.append('state', state && state.value ? state.value : '');
            formData.append('penalty', penalty && penalty.value ? penalty.value : '');
            formData.append('preventedRadio', preventedRadio.value);
            formData.append('convictedRadio', convictedRadio.value);
            formData.append('carreerRadio', carreerRadio.value);
            formData.append('driverPhoto', photo.files[0]);
            formData.append('method', 'POST');
            
            const fetching = await fetch('/api/add-driver', {
                method: 'POST',
                body: formData
            });
            const response = await fetching.json();
            console.log(response);
            document.querySelector('#pError').innerHTML = '';
            
           if(response.message == "Redirect"){
                document.location.href = "/logout" 
            }else if(response.status){
                setTimeout(async () => {
                    const inputParent = addDriver.querySelectorAll('#inputParent');
                    const selectParent = addDriver.querySelectorAll('#selectParent');
                    addDriverBtn.innerHTML = loadedBtn;
                    addDriverBtn.removeAttribute('disabled')
                    canDriverBtn.style.display = 'block';
    
                    successDiv.innerHTML = alertMsg('info', `<p>${response.message}</p> <p>Driver's Identity Number: <strong>${response.driverId}</strong></p>`)
    
                    inputParent.forEach((child) => {
                        child.querySelector('input').value = '';
                    })
                
                    selectParent.forEach((child) => {
                        child.querySelector('select').value = '';
                    })
        
    
                    document.querySelectorAll('[value="no"]').forEach((child) => {
                        child.click();
                    })
                    document.querySelector("#resetPhoto").click();
                    document.querySelector("#defaultRadio2").click();
                    await fetchDrivers(1, '');
                    document.querySelector("#canDriverBtn").click();
                },1500);
            }else{
                document.querySelector('#pError').innerHTML = response.message;
                document.querySelector('#pError').style.color = 'red';
                addDriverBtn.innerHTML = loadedBtn;
                addDriverBtn.removeAttribute('disabled')
                canDriverBtn.style.display = 'block';
            }
    });

    
    searchDriver.addEventListener('input', async function(e) {
        if(e.target.value && e.target.value.trim() !== ''){
            searchDriverBtn.removeAttribute('disabled');
            return;
        }
        searchDriverBtn.setAttribute('disabled', true);
        const searchValue = e.target.value ? e.target.value : '';
        const params = new URLSearchParams(window.location.search);
        const page = 1;
        params.delete('search');
        setQueryStringParameter('page', 1);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
        fetchDrivers(page, searchValue);
        
    });

    searchDriverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchValue = searchDriver.value ? searchDriver.value : '';
        const page = 1;
        setQueryStringParameter('search', searchValue);
        setQueryStringParameter('page', 1);
        fetchDrivers(page, searchValue);
    });

}else if(document.forms.updateDriver){
    const updateDriver = document.forms.updateDriver;
    const updateDriverBtn = document.getElementById('updateDriverBtn');
    
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Save changes`;

    updateDriver.addEventListener('submit', async (e) => {
        e.preventDefault();
        updateDriverBtn.innerHTML = loadingBtn;
        updateDriverBtn.setAttribute('disabled', true)
     
            const formData = new FormData();
    
            const fullName = document.querySelector("[name='driverName']");
            const DoB = document.querySelector("[name='dob']");
            const phoneOne = document.querySelector("[name='phoneOne']");
            const phoneTwo = document.querySelector("[name='phoneTwo']");
            const idNumber = document.querySelector("[name='idNumber']");
            const driverEmail = document.querySelector("[name='driverEmail']");
            const curAddress = document.querySelector("[name='curAddress']");
            const curFrom = document.querySelector("[name='curFrom']");
            const curTo = document.querySelector("[name='curTo']");
            const addressRadio = document.querySelector("[name='address-radio']");
            const notifyName = document.querySelector("[name='notifyName']");
            const nContact = document.querySelector("[name='nContact']");
            const position = document.querySelector("[name='position']");
            const salary = document.querySelector("[name='salary']");
            const workedRadio = document.querySelector("[name='worked-radio']");
            const employedRadio = document.querySelector("[name='employed-radio']");
            const preventedRadio = document.querySelector("[name='prevented-radio']:checked");
            const convictedRadio = document.querySelector("[name='convicted-radio']:checked");
            const carreerRadio = document.querySelector("[name='carreer-radio']:checked");
            const tractorRadio = document.querySelector("[name='employed-radio']");
            const truckRadio = document.querySelector("[name='truck-radio']");
            const trailerRadio = document.querySelector("[name='trailer-radio']");
            const busRadio = document.querySelector("[name='bus-radio']");
            const vanRadio = document.querySelector("[name='van-radio']");
            const taxiRadio = document.querySelector("[name='taxi-radio']");
            const accidentRadio = document.querySelector("[name='accident-radio']");
            const trafficRadio = document.querySelector("[name='traffic-radio']");
            const lNumber = document.querySelector("[name='lNumber']");
            const lCity = document.querySelector("[name='lCity']");
            const lExpDate = document.querySelector("[name='lExpDate']");
            const lType = document.querySelector("[name='lType']");
            const hEdu = document.querySelector("[name='hEdu']");
            const compOn = document.querySelector("[name='compOn']");
            const prevOne = document.querySelector("[name='prevOne']");
            const prevFrom1 = document.querySelector("[name='prevFrom1']");
            const prevTo1 = document.querySelector("[name='prevTo1']");
            const prevTwo = document.querySelector("[name='prevTwo']");
            const prevFrom2 = document.querySelector("[name='prevFrom2']");
            const prevTo2 = document.querySelector("[name='prevTo2']");
            const prevThree = document.querySelector("[name='prevThree']");
            const prevFrom3 = document.querySelector("[name='prevFrom3']");
            const prevTo3 = document.querySelector("[name='prevTo3']");
            const prevFromWorked = document.querySelector("[name='prevFromWorked']");
            const prevToWorked = document.querySelector("[name='prevToWorked']");
            const truckEquipType = document.querySelector("[name='truckEquipType']");
            const truckYears = document.querySelector("[name='truckYears']");
            const truckStates = document.querySelector("[name='truckStates']");
            const trailerEquipType = document.querySelector("[name='trailerEquipType']");
            const trailerYears = document.querySelector("[name='trailerYears']");
            const trailerStates = document.querySelector("[name='trailerStates']");
            const tractorEquipType = document.querySelector("[name='tractorEquipType']");
            const tractorYears = document.querySelector("[name='tractorYears']");
            const tractorStates = document.querySelector("[name='tractorStates']");
            const busEquipType = document.querySelector("[name='tractorStates']");
            const busYears = document.querySelector("[name='busYears']");
            const busStates = document.querySelector("[name='tractorStates']");
            const vanEquipType = document.querySelector("[name='tractorStates']");
            const vanYears = document.querySelector("[name='vanYears']");
            const vanStates = document.querySelector("[name='vanStates']");
            const taxiEquipType = document.querySelector("[name='taxiEquipType']");
            const taxiYears = document.querySelector("[name='taxiYears']");
            const taxiStates = document.querySelector("[name='taxiStates']");
            const dateAccidentNature = document.querySelector("[name='dateAccidentNature']");
            const accidentNature = document.querySelector("[name='accidentNature']");
            const fatalities = document.querySelector("[name='fatalities']");
            const injuries = document.querySelector("[name='injuries']");
            const dateViolation = document.querySelector("[name='dateViolation']");
            const violation = document.querySelector("[name='violation']");
            const state = document.querySelector("[name='state1']");
            const penalty = document.querySelector("[name='penalty']");
            const photo = document.querySelector("[name='driverPhoto']");
    
    
            formData.append('fullName', fullName.value);
            formData.append('DoB', DoB.value);
            formData.append('phoneOne', phoneOne.value);
            formData.append('phoneTwo', phoneTwo.value);
            formData.append('idNumber', idNumber.value);
            formData.append('driverEmail', driverEmail.value);
            formData.append('curAddress', curAddress.value);
            formData.append('curFrom', curFrom.value);
            formData.append('curTo', curTo.value);
            formData.append('notifyName', notifyName.value);
            formData.append('nContact', nContact.value);
            formData.append('position', position.value);
            formData.append('salary', salary.value);
            formData.append('lNumber', lNumber.value);
            formData.append('lCity', lCity.value);
            formData.append('lExpDate', lExpDate.value);
            formData.append('lType', lType.value);
            formData.append('hEdu', hEdu.value);
            formData.append('compOn', compOn.value);
            formData.append('prevOne', prevOne && prevOne.value ? prevOne.value : '');
            formData.append('prevFrom1', prevFrom1 && prevFrom1.value ? prevFrom1.value : '');
            formData.append('prevTo1', prevTo1 && prevTo1.value ? prevTo1.value : '');
            formData.append('prevTwo', prevTwo && prevTwo.value ? prevTwo.value : '');
            formData.append('prevFrom2', prevFrom2 && prevFrom2.value ? prevFrom2.value : '');
            formData.append('prevTo2', prevTo2 && prevTo2.value ? prevTo2.value : '');
            formData.append('prevThree', prevThree && prevThree.value ? prevThree.value : '');
            formData.append('prevFrom3', prevFrom3 && prevFrom3.value ? prevFrom3.value : '');
            formData.append('prevTo3', prevTo3 && prevTo3.value ? prevTo3.value : '');
            formData.append('prevFromWorked',  prevFromWorked &&  prevFromWorked.value ? prevFromWorked.value : '');
            formData.append('prevToWorked', prevFromWorked && prevFromWorked.value ? prevToWorked.value : '');
            formData.append('truckEquipType', truckEquipType && truckEquipType.value ? truckEquipType.value : '');
            formData.append('truckYears', truckYears && truckYears.value  ? truckYears.value : '');
            formData.append('truckStates', truckStates && truckStates.value ? truckStates.value : '');
            formData.append('trailerEquipType', trailerEquipType && trailerEquipType.value ? trailerEquipType.value : '');
            formData.append('trailerYears', trailerYears && trailerYears.value ? trailerYears.value : '');
            formData.append('trailerStates', trailerStates && trailerStates.value ? trailerStates.value : '');
            formData.append('busEquipType', busEquipType && busEquipType.value ? busEquipType.value : '');
            formData.append('busYears', busYears && busYears.value ? busYears.value : '');
            formData.append('busStates', busStates && busStates.value ? busStates.value : '');
            formData.append('tractorEquipType', tractorEquipType && tractorEquipType.value ? tractorEquipType.value : '');
            formData.append('tractorYears',tractorYears && tractorYears.value ? tractorYears.value : '');
            formData.append('tractorStates', tractorStates && tractorStates.value ? tractorStates.value : '');
            formData.append('vanEquipType', vanEquipType && vanEquipType.value ? vanEquipType.value : '');
            formData.append('vanYears', vanYears && vanYears.value ? vanYears.value : '');
            formData.append('vanStates', vanStates && vanStates.value ? vanStates.value : '');
            formData.append('taxiEquipType', taxiEquipType && taxiEquipType.value ? taxiEquipType.value : '');
            formData.append('taxiYears', taxiYears && taxiYears.value ? taxiYears.value : '');
            formData.append('taxiStates', taxiStates && taxiStates.value ? taxiStates.value : '');
            formData.append('dateAccidentNature', dateAccidentNature && dateAccidentNature.value ? dateAccidentNature.value : '');
            formData.append('accidentNature', accidentNature && accidentNature.value  ? accidentNature.value : '');
            formData.append('fatalities', fatalities && fatalities.value  ? fatalities.value : '');
            formData.append('injuries', injuries && injuries.value  ? injuries.value : '');
            formData.append('dateViolation', dateViolation && dateViolation.value  ? dateViolation.value : '');
            formData.append('violation', violation && violation.value ? violation.value : '');
            formData.append('state', state && state.value ? state.value : '');
            formData.append('penalty', penalty && penalty.value ? penalty.value : '');
            formData.append('preventedRadio', preventedRadio.value);
            formData.append('convictedRadio', convictedRadio.value);
            formData.append('carreerRadio', carreerRadio.value);
            formData.append('driverPhoto', photo.files[0]);
            formData.append('method', 'UPDATE');
            
            const fetching = await fetch('/api/drivers?did='+new URL(document.location.href).pathname.split('/').filter(n => n)[1] , {
                method: 'POST',
                body: formData
            });
            const response = await fetching.json();
            console.log(response);
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
                updateDriverBtn.innerHTML = loadedBtn;
                updateDriverBtn.removeAttribute('disabled')
                canDriverBtn.style.display = 'block';
            }
    })

    document.addEventListener('DOMContentLoaded', () => {
        let params = (new URL(document.location)).searchParams;
        if(params.get("s")){
            document.querySelector('#pError').innerHTML = "Driver updated successfully!";
            document.querySelector('#pError').style.color = 'green';

        }
    })
}