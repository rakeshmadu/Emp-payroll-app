let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
  empPayrollList = getEmployeePayrollDataFromStorage();
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHtml();
  localStorage.removeItem('editEmp');
});

const getEmployeePayrollDataFromStorage = () => {
  return localStorage.getItem("EmployeePayrollList") ?
    JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
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
  if (empPayrollList.length == 0) return;
  let innerHtml = `${headerHtml}`;
  for (const empPayrollData of empPayrollList) {
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
      <img id="${empPayrollData._id}" onclick="remove(this)" alt="delete" 
              src="../assets/icons/delete-black-18dp.svg">
      <img id="${empPayrollData._id}" alt="edit" onclick="update(this)"
              src="../assets/icons/create-black-18dp.svg">
      </td>
  </tr>
  `;
  }
  document.querySelector('#table-display').innerHTML = innerHtml;
}

const getDeptHtml = (deptList) => {
  let deptHtml = '';
  for (const dept of deptList) {
    deptHtml = `${deptHtml} <div class="dept-label">${dept}</div>`
  }
  return deptHtml;
}

const remove = (node) => {
  let empPayrollData = empPayrollList.find(employee => node.id == employee._id);
  if (!empPayrollData) return;
  const index = empPayrollList.map(employee => employee._id)
    .indexOf(empPayrollData._id);
  empPayrollList.splice(index, 1);
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
  createInnerHtml();
}

const update = (node) => {
  let empPayrollData = empPayrollList.find(employee => node.id == employee._id);
  if (!empPayrollData) return;
  localStorage.setItem("editEmp", JSON.stringify(empPayrollData));
  window.location.replace(site_properties.add_employee_page);
}