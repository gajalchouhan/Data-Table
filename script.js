var tableData;
var paginatedData = [];
var globalIndex = 0;
var getPaginatedData;
var currentPage = 1;
var maxPage = 0;
var sort = [
  {
    id : 0,
    asc : false,
    dsc : false,
    key : 'nativeName'
  },
  {
    id : 1,
    asc : false,
    dsc : false,
    key : 'alpha2Code'
  },
  {
    id : 2,
    asc : false,
    dsc : false,
    key : 'alpha3Code'
  },
  {
    id : 3,
    asc : false,
    dsc : false,
    key : 'capital'
  }
]

document.addEventListener('DOMContentLoaded' , function() {
  $.ajax({
    url: "https://restcountries.eu/rest/v2/all",
    context: document.body,
    success: function(response){
       tableData = response;
       getPaginatedData = getPagination(response);
       getBaseData(getPaginatedData[globalIndex]);
       getPages(currentPage);
    }
  });
});


function getPagination(response){
  var count = 0;
  var newTempArr;
  var tempArr = [];

  newTempArr = response.map(item => {
     return {
       name : item.name,
       nativeName : item.nativeName,
       alpha2Code : item.alpha2Code,
       alpha3Code : item.alpha3Code,
       capital : item.capital
     } 
  });

  for(let i=0; i<newTempArr.length; i++){
      if(count <= 10){
        tempArr.push(newTempArr[i]);
      }
    else{
          count = 0;
          paginatedData.push(tempArr);
          tempArr= [];
      }
      count++;
  }
  return paginatedData;
}

function getBaseData(data){
    var addCountries = '';
   for(let i=0; i<data.length; i++){
       addCountries += `<tr><td>${data[i].name}</td><td>${data[i].nativeName}</td><td>${data[i].alpha2Code}</td><td>${data[i].alpha3Code}</td><td>${data[i].capital}</td></tr>`;
   }
   document.querySelector("#baseData").innerHTML = addCountries;
}

function matchAnyKey(pattern, obj) {
  console.log(pattern);
  console.log(obj);
  let keys = Object.keys(obj);
  pattern = pattern.toLowerCase();
  for (let j = 0; j < keys.length; ++j) {
    if (obj[keys[j]].toLowerCase().match(pattern)) return true;
  }
  return false;
}

// Search by name....
function searchByName(e) {
  table = getPaginatedData[globalIndex];
  let ans = [];
  for (let i = 0; i < table.length; ++i) {
    if (matchAnyKey(e.target.value, table[i])) ans.push(table[i]);
  }
  getBaseData(ans);
}


// This function go next page
function next(){
  currentPage++;
  if(currentPage > getPaginatedData.length-2){
    currentPage = getPaginatedData.length-2;
  }
  getPages(currentPage);
}

// This function go previous page
function previous(){
   currentPage--;
   if(currentPage <= 0){
     currentPage = 1;
   }
   getPages(currentPage);
}

// This function is used to page data.
function getPageData(index){
  globalIndex = index;
  getBaseData(getPaginatedData[index]);
}

// get pages data
function getPages(currentIndex){
    var addPages = '';
    addPages = addPages + `<div onclick="getPageData(${currentIndex})" class="pageIndex">${currentIndex}</div>
      <div onclick="getPageData(${currentIndex+1})" class="pageIndex">${currentIndex+1}</div>
      <div onclick="getPageData(${currentIndex+2})" class="pageIndex">${currentIndex+2}</div>`;
      document.getElementById('pages').innerHTML = addPages;
}

// Sort Function got Implemented.
function sortTable(data , type , key){
  if(type === 'asc'){
    data.sort((a, b) =>{
      var nameA = a[key].toLowerCase(), nameB=b[key].toLowerCase()
      if (nameA < nameB) //sort string ascending
          return -1 
      if (nameA > nameB)
          return 1
      return 0 //default return value (no sorting)
  });
  }else{
    data.sort((a, b) =>{
      var nameA=a[key].toLowerCase(), nameB=b[key].toLowerCase()
      if (nameA > nameB) //sort string ascending
          return -1 
      if (nameA < nameB)
          return 1
      return 0 //default return value (no sorting)
  });
  }
  getBaseData(data);
}

// Sort Function table sort.
function tableSort(n) {
  sort.forEach(element => {
    if(element.id === n){
      if(element.asc === false && element.dsc === false){
        element.asc = true;
        sortTable( getPaginatedData[globalIndex] , 'asc' , element.key)
      }
      else if(element.asc === true && element.dsc === false){
        element.asc = false;
        element.dsc = true;
        sortTable( getPaginatedData[globalIndex] , 'dsc' , element.key)
      }
      else if(element.asc === false && element.dsc === true){
        element.asc = true;
        element.dsc = false;
        sortTable( getPaginatedData[globalIndex] , 'asc' , element.key)
      }
    }
  });    
}