const addSchoolBtn = document.getElementById('addSchool');
const schoolBtnDivs = document.getElementById('schoolFieldDiv');
let addCompanyBtn;

const workExpDiv = document.getElementById('experienceFieldDiv');
const expBtnDiv = document.getElementById('expBtnDiv');
const workExpRadio = document.querySelectorAll('[name="workingExp-radio"]');


const schoolInputs = `
<div class="row g-2 mt-2 mb-2" id="schoolInputDivs">
  <div class="col-sm-5 mb-0" id="inputParent">
    <label for="" class="form-label">School Name</label>
    <input type="text" id="workerSchName" class="form-control" placeholder="" required> 
    <small></small>
  </div>
  <div class="col-sm-4 mb-0" id="inputParent">
    <label for="" class="form-label">Location</label>
    <input type="text" id="workerSchLoc" class="form-control" placeholder="" required>
    <small></small>
  </div>
  <div class="col-sm-3 mb-2" id="inputParent">
    <label for="" class="form-label">Date Graduated</label>
    <input type="date" id="workerSchGrad" class="form-control" placeholder="" required>
    <small></small>
  </div>
  <div class="col-3 mt-2">
    <button type="button" id="removeSchool" class="btn btn-danger mb-3"><i class="bx bx-trash"></i></button>
  </div>
</div>
`

const companyInputs = `
<div class="row g-2 mt-2 mb-2" id="experienceInputDiv">
    <div class="col-sm-6 mb-0"  id="inputParent">
      <label for="" class="form-label">Company Name</label>
      <input type="text" id="workerExpCompany" name="workerExpCompany" class="form-control" placeholder="" required>
      <small></small>
    </div>
    <div class="col-sm-3 mb-0"  id="inputParent">
      <label for="" class="form-label">Period (From)</label>
      <input type="number" id="workerExpFrom" name="workerExpFrom" class="form-control" placeholder="" required>
      <small></small>
    </div>
    <div class="col-sm-3 mb-2"  id="inputParent">
      <label for="" class="form-label">Period (To)</label>
      <input type="number" id="workerExpTo" name="workerExpTo" class="form-control" placeholder="" required>
      <small></small>
    </div>
    <div class="col-sm-12 mb-2"  id="inputParent">
      <label for="" class="form-label">Position</label>
      <input type="text" id="workerExpPosition" name="workerExpPosition" class="form-control" placeholder="" required>
      <small></small>
    </div>
    <div class="col-sm-12 mb-1" id="textareaParent">
      <label for="" class="form-label">Reason for Leaving</label>
      <textarea type="number" id="reasonForLeaving" name="reasonForLeaving" class="form-control" required></textarea>
      <small></small>
    <div class="col-3 mt-2">
        <button type="button" id="removeCompany" class="btn btn-danger mb-3"><i class="bx bx-trash"></i></button>
    </div>
    </div>
</div>
`;


const crimeDiv = document.querySelector('#crimeDiv');
const crimeRadios = document.querySelectorAll("[name='crime-radio']");
const companyInputsBtn = `<button type="button" id="addExp" class="btn btn-secondary mb-3">+ Add Another Experience Field</button>`

crimeRadios.forEach((crimeRadio) => {
  crimeRadio.addEventListener('change', (e) => {
    if(e.target.value === 'yes'){
      crimeDiv.innerHTML = crimeTextArea;
    }else{
      crimeDiv.innerHTML = '';
    }

  })
})

for (let i = 0; i < workExpRadio.length; i++) {
    workExpRadio[i].addEventListener('change', (e) => {
      if(e.target.value === 'yes'){
        workExpDiv.innerHTML = companyInputsFirst;
        expBtnDiv.innerHTML = !document.getElementById('addExp') ? companyInputsBtn : '';
        addCompanyBtn = document.getElementById('addExp');
        if(addCompanyBtn){
          addCompanyBtn.addEventListener('click', (e) => {
            workExpDiv.insertAdjacentHTML('beforeend',companyInputs);
          })
        }
      }else{
        workExpDiv.innerHTML = '';
        expBtnDiv.innerHTML = '';
      }
   });
    
  }

  addSchoolBtn.addEventListener('click', (e) => {
    e.preventDefault();
    schoolBtnDivs.insertAdjacentHTML('beforeend',schoolInputs);
  })
  
  document.addEventListener('click', (e) => {
    e.stopPropagation();
    const rmSchoolBtn = document.querySelectorAll('#removeSchool');
    const removeCompany = document.querySelectorAll('#removeCompany');
    const schoolInputDivs = document.querySelectorAll('#schoolInputDivs');
    const companyBtnDivs = document.querySelectorAll('#experienceInputDiv');
    if(rmSchoolBtn){
      for(let i=0; i < rmSchoolBtn.length; i++){
        rmSchoolBtn[i].addEventListener('click', () => {
          schoolInputDivs[i].remove();
        })
      }

    }

    if(removeCompany) {
      for(let i=0; i < removeCompany.length; i++){
        removeCompany[i].addEventListener('click', () => {
          companyBtnDivs[i].remove();
        })
      }
    }

  });

  document.addEventListener('DOMContentLoaded', () => {
    const schoolInputDivs = document.querySelectorAll('#schoolInputDivs');
    const companyBtnDivs = document.querySelectorAll('#experienceInputDiv');
    if(document.getElementById('addExp')){
    addCompanyBtn = document.getElementById('addExp') 
      addCompanyBtn.addEventListener('click', (e) => {
        workExpDiv.insertAdjacentHTML('beforeend',companyInputs);
      })
    };

    if(document.querySelectorAll('#removeSchool')){
      const rmSchoolBtn = document.querySelectorAll('#removeSchool');
      for(let i=0; i < rmSchoolBtn.length; i++){
        rmSchoolBtn[i].addEventListener('click', () => {
          schoolInputDivs[i].remove();
        })
      }

    }

    if(document.querySelectorAll('#removeCompany')) {
      const removeCompany = document.querySelectorAll('#removeCompany');
      for(let i=0; i < removeCompany.length; i++){
        removeCompany[i].addEventListener('click', () => {
          companyBtnDivs[i].remove();
        })
      }
    }

  
  })

