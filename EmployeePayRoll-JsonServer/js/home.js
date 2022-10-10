let empPayrollList;
window.addEventListener('DOMContentLoaded',(event) => {
  if(site_properties.use_local_storage.match("true")){
    getEmployeePayrollDataFromStorage();
  }else{
    getEmployeePayrollDataFromServer();
  }
});

const processEmployeePayrollDataResponse = () => {
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHtml();
  localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromStorage = () => {
  empPayrollList = localStorage.getItem("EmployeePayrollList") ?
                      JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
  processEmployeePayrollDataResponse();
}

const getEmployeePayrollDataFromServer = () => {
  makeServiceCall("GET",site_properties.server_url,true)
  .then(data => {
    empPayrollList = JSON.parse(data);
    processEmployeePayrollDataResponse();
}).catch(error =>{
  console.log("GET Error Status: "+JSON.stringify(error));
  empPayrollList = [];
  processEmployeePayrollDataResponse();
});
}

const createInnerHtml = () => {
  const headerHtml = ` 
    <th></th>
    <th>Name</th>
    <th>Gender</th>
    <th>Department</th>
    <th>Salary</th>
    <th>Start Date</th>
    <th>Actions</th>
  `;
  if(empPayrollList.length == 0) return;
  let innerHtml = `${headerHtml}`;
  for(const empPayrollData of empPayrollList)
  {
  innerHtml = `${innerHtml}
  <tr>
      <td>
      <img class="profile" alt="" src="${empPayrollData._profilePic}">
      </td>
      <td>${empPayrollData._name}</td>
      <td>${empPayrollData._gender}</td>
      <td>${getDeptHtml(empPayrollData._department)}</td>
      <td>${empPayrollData._salary}</td>
      <td>${stringifyDate(empPayrollData._startDate)}</td>
      <td>
      <img id="${empPayrollData.id}" onclick="remove(this)" alt="delete" 
              src="../assets/icons/delete-black-18dp.svg">
      <img id="${empPayrollData.id}" alt="edit" onclick="update(this)"
              src="../assets/icons/create-black-18dp.svg">
      </td>
  </tr>
  `;
  }
document.querySelector('#table-display').innerHTML = innerHtml;
}

const getDeptHtml = (deptList) => {
let deptHtml = '';
for(const dept of deptList){
  deptHtml = `${deptHtml} <div class="dept-label">${dept}</div>`
}
return deptHtml;
}

const remove = (node) => {
  let empPayrollData = empPayrollList.find(employee => node.id == employee.id);
  if(!empPayrollData) return;
  const index = empPayrollList.map(employee => employee.id)
                              .indexOf(empPayrollData.id);
  empPayrollList.splice(index,1);
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  localStorage.setItem("EmployeePayrollList",JSON.stringify(empPayrollList));
  createInnerHtml();
}

const update = (node) => {
  let empPayrollData = empPayrollList.find(employee => node.id == employee.id);
  if(!empPayrollData) return;
  localStorage.setItem("editEmp",JSON.stringify(empPayrollData));
  window.location.replace(site_properties.add_employee_page);
}