var jpdbBaseURL= 'http://api.login2explore.com:5577';
var jpdbIRL ='/api/irl';
var jpdbIML ='/api/iml';
var DBName = localStorage.getItem("DB_Name");
var irlPartUrl='/api/irl';
var imlPartUrl ='/api/iml';
var RelName = localStorage.getItem("DB_Rel");
var connToken =localStorage.getItem("token_no");
let arr;
var rec_no=localStorage.getItem("rec_no")


setBaseUrl(jpdbBaseURL);
var baseUrl = "http://api.login2explore.com:5577";

//To set the baseUrl 
function setBaseUrl(baseUrlArg) {
    baseUrl = baseUrlArg;
}

function createGET_ALL_Data(token,dbName,relName){
    var req = "{\n"
    + "\"token\" : "
    + token
    + ","
    + "\"dbName\": \""
    + dbName
    + "\",\n" + "\"cmd\" : \"GET_ALL\",\n"
    + "\"rel\" : \""
    + relName
    + "\"\n" 
    + "\n"
    + "}";
return req;
}

function createGET_BY_RECORDRequest(token, dbName, relName, reqId) {

    var req = "{\n"
            + "\"token\" : "
            + token
            + ","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GET_BY_RECORD\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n" + "\"record\":"
            + reqId
            + "\,"
            + "\n"
            + "}";
    return req;
}

function showData(obj){
    return Object.keys(obj)
    .map(element=>{
        let temp='#'+element;
        `
        ${$(temp).val(obj[element])}
        `
    }).join("")

}

function getData(){
  var req=createGET_BY_RECORDRequest(connToken,DBName,RelName,rec_no)
  console.log(req)
  jQuery.ajaxSetup({async:false})
  var result=executeCommand(req,irlPartUrl)
  jQuery.ajaxSetup({async:true})
  var resObj = JSON.parse(result.data)['record']
  $("#da").val("here");
  showData(resObj)
 

}


function showTableHead(arr){
    return Object.keys(arr)
    .map(element =>(
        `
        <div class="form-group row">
          <label class="col-form-label col-sm-3 text-center my-auto" >${element}</label>
          <div class="col-sm-9">
            <input type="text" id="${element}" class="form-control" >
          </div>
        </div>

        `
    ))
    .join("");
}




function setForm(){
    var headreq=createGET_ALL_Data(connToken,DBName,RelName);
    // console.log(headreq)
    jQuery.ajaxSetup({async:false})
    var result=executeCommand(headreq,irlPartUrl);
    // console.log(result)
    jQuery.ajaxSetup({async:true})
    obj=JSON.parse(result.data)['json_records']
    let ind;
    for(let index = 0; index < obj.length; index++){
        if(obj[index]!=null){
            ind=index;
          
        }
    }
    // console.log(obj[ind]['record'])
    document.getElementById("empform").innerHTML= showTableHead(obj[ind]['record'])
    // validateData(obj[ind]['record']);
    arr=obj[ind]['record'];
    

}




console.log(localStorage.getItem("rec_no"))
setForm();
getData();
// console.log( empDBName)
// console.log( empRelName)
// console.log(connToken)
// initEmpForm();
// getFirst();
// getLast();
// checkForNoOrOneRecord();




