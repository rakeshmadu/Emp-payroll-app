let isUpdate = false;
let employeePayrollObj = {};

window.addEventListener('DOMContentLoaded', (event) =>{
const name = document.querySelector('#name');
name.addEventListener('input', function() {
   if(name.value.length == 0){
    setTextValue('.text-error',"");
       return;
   } 
   try{
       (new EmployeePayRollData()).name = name.value;
       setTextValue('.text-error',"");
   }catch(e){
    setTextValue('.text-error',e);
   }
});

const date = document.querySelector('#date');
date.addEventListener('input', function() {
    let year = getInputValueById('#year');
    let month = parseInt(getInputValueById('#month'))-1;
    let day = getInputValueById('#day');
    try{
        (new EmployeePayRollData()).startDate = new Date(year,month,day);
        setTextValue('.date-error',"");
    }catch(e){
        setTextValue('.date-error',e);
    }
});

const salary = document.querySelector('#salary');
setTextValue('.salary-output',salary.value); 
salary.addEventListener('input',function () {
    setTextValue('.salary-output',salary.value); 
});

checkForUpdate();

});


const save = (event) => {
    event.preventDefault();
    event.stopPropagation();
    try{
        setEmployeePayrollObject();
        createAndUpdateStorage();
        resetForm();
        window.location.replace(site_properties.home_page);
    }catch(e){
        console.log("problem");
        return;
    }
}

const setEmployeePayrollObject = () => {
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObj._department = getSelectedValues('[name=department]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let year = getInputValueById('#year');
    let month = parseInt(getInputValueById('#month'))-1;
    let day = getInputValueById('#day');
    employeePayrollObj._startDate = new Date(year,month,day);
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

const getSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if(item.checked)
        selItems.push(item.value);
    });
    return selItems;
}

const createAndUpdateStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    console.log(employeePayrollList);
    if(employeePayrollList){
        let empPayrollData = employeePayrollList.
                            find(employee => employee._id == employeePayrollObj._id);
        if(!empPayrollData)
        employeePayrollList.push(createEmployeePayrollData());
        else{
            const index = employeePayrollList.map(emp => emp._id)
                                             .indexOf(empPayrollData._id);
            employeePayrollList.splice(index,1,createEmployeePayrollData(empPayrollData._id));
        }
    }
    else{
        employeePayrollList = [createEmployeePayrollData()];
    }
    localStorage.setItem("EmployeePayrollList",JSON.stringify(employeePayrollList));
}

const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayRollData();
    if(!id)
    employeePayrollData.id = createNewEmployeeId();
    else
    employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const createNewEmployeeId = () => {
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID",empID);
    return empID;
}

const setEmployeePayrollData = (employeePayrollData) => {
    try{
        employeePayrollData.name = employeePayrollObj._name;
    }catch(e){
        setTextValue('.text-error',e);
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    try{
        employeePayrollData.startDate = employeePayrollObj._startDate;
    }catch(e){
        setTextValue('.date-error',e);
    }

    alert(employeePayrollData.toString());
}

const resetForm = () => {
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary','');
    setValue('#notes','');
    setSelectedIndex('#day',0);
    setSelectedIndex('#month',0);
    setSelectedIndex('#year',0);
}

const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.selectedIndex = index;
}

const setValue = (id,value) => {
    const element = document.querySelector(id);
    element.value = value;
}

const setTextValue = (id,value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if(Array.isArray(value)){
            if(value.includes(item.value)){
                item.checked = true;
            }
        }
        else if(item.value === value)
        item.checked = true;
    });
}

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem("editEmp");
    isUpdate = employeePayrollJson ? true : false;
    if(!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}

const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary-output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = convertDate(employeePayrollObj._startDate).split("/");
    setValue('#day',parseInt(date[0]));
    setValue('#month',parseInt(date[1]));
    setValue('#year',date[2]);
}