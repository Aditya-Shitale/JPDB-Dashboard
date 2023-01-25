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

// function createGET_BY_RECORDRequest(token, dbName, relName, reqId) {
  
//     var req = "{\n"
//             + "\"token\" : "
//             + token
//             + ","
//             + "\"dbName\": \""
//             + dbName
//             + "\",\n" + "\"cmd\" : \"GET_BY_RECORD\",\n"
//             + "\"rel\" : \""
//             + relName
//             + "\",\n" + "\"record\":"
//             + reqId
//             + ""
//             + "\n"
//             + "}";
//     return req;
// }


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
    // console.log(obj)
    
    return Object.keys(obj)
    .map(element=>{
        let temp='#'+element;
        `
        ${$(temp).val(obj[element])}
        `
    }).join("")

}

function setLastRecNo2LS(jsonObj){
    // var data =JSON.parse(jsonObj);
    if(jsonObj.rec_no===undefined){
        localStorage.setItem("last_rec_no","0");
    }else{
        localStorage.setItem("last_rec_no",jsonObj.rec_no);
    }
    // console.log(localStorage.getItem("last_rec_no"))
}

function setFirstRecNo2LS(jsonObj){
    // var data=JSON.parse(jsonObj.data);
    if(jsonObj.rec_no===undefined){
        localStorage.setItem("first_rec_no","0");
    }else{
        localStorage.setItem("first_rec_no",jsonObj.rec_no );
    }
    // console.log(localStorage.getItem("first_rec_no"))

}

function setCurrRecNo2LS(jsonObj){
    console.log(jsonObj)
    if(typeof jsonObj === typeof 3){console.log("rech1");var t=toString(jsonObj);console.log(typeof t); localStorage.setItem("recno",t);}
    else console.log("rech2"); localStorage.setItem("recno",jsonObj.rec_no);
}
function getCurrRecNoFromLS(){
    return localStorage.getItem("recno");
}
function getLastRecNoFromLS(){
    return localStorage.getItem("last_rec_no");
}

function createNavReq(token, dbName, relName,nav,rec_no) {
    var partNavReq = "";

    if (nav === "NEXT_RECORD" || nav === "PREV_RECORD") {
        partNavReq = ",\n"
                + "\"record\":"
                + rec_no;
    }
    var req = "{\n"
    + "\"token\" : "
    + token
    + ","
    + "\"dbName\": \""
    + dbName
    + "\",\n" + "\"cmd\" : \"" + nav + "\",\n"
    + "\"rel\" : \""
    + relName
    + '"'
    + partNavReq
    + "\,"
    + "\n}";
    // console.log(req)
return req;
}
function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
            + "\"token\" : "
            + connToken
            + ","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"PUT\",\n"
            + "\"rel\" : \""
            + relName + "\","
            + "\"jsonStr\": \n"
            + jsonObj
            + "\n"
            + "}";
    return putRequest;
}
function disableform(bValue){

    $("#empId").prop('disabled',bValue);
    $("#empname").prop('disabled',bValue);
    $("#empsal").prop('disabled',bValue);
    $("#hrd").prop('disabled',bValue);
    $("#da").prop('disabled',bValue);
    $("#deduct").prop('disabled',bValue);
}

function createFIRST_RECORDRequest(token, dbName, relName,) {
    return createNavReq(token, dbName, relName,"FIRST_RECORD",0);
}


function getData(){
  var req=createGET_BY_RECORDRequest(connToken,DBName,RelName,rec_no)
//   console.log(req)
  jQuery.ajaxSetup({async:false})
  var result=executeCommand(req,irlPartUrl)
  jQuery.ajaxSetup({async:true})
  var resObj = JSON.parse(result.data)['record']
  $("#da").val("here");
  showData(resObj)
}


function getFirst(){
    var getFirstreq =createFIRST_RECORDRequest(connToken, DBName,RelName);
    // console.log(getFirstreq)
    jQuery.ajaxSetup({async:false});
    var result=executeCommand(getFirstreq,irlPartUrl);
    showData(JSON.parse(result.data)['record']);
    setFirstRecNo2LS(JSON.parse(result.data));

    setCurrRecNo2LS(JSON.parse(result.data));
    // console.log(JSON.parse(result.data))
    $('#empId').prop('disabled',true);
    $('#first').prop('disabled',true);
    $('#prev').prop('disabled',true);
    $('#next').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#last').prop('disabled',false);

    // console.log(JSON.parse(result.data)['record'])
}

function getLast(){
    var getLastreq =createLAST_RECORDRequest(connToken, DBName,RelName);
    jQuery.ajaxSetup({async:false});
    var result=executeCommand(getLastreq,irlPartUrl);
    setLastRecNo2LS( JSON.parse(result.data));
    setCurrRecNo2LS( JSON.parse(result.data));
    showData( JSON.parse(result.data)['record']);
    jQuery.ajaxSetup({async:true});
    $('#first').prop('disabled',false);
    $('#prev').prop('disabled',false);
    $('#last').prop('disabled',true);
    $('#next').prop('disabled',true);
    $('#save').prop('disabled',true);
}
function goToHome(){
    location.href = "./dashboard.html";}

function getNext(){
    var r=getCurrRecNoFromLS();
    console.log(r)
    console.log(typeof r)
    var getnextReq=createNEXT_RECORDRequest(connToken,DBName,RelName,r);
    jQuery.ajaxSetup({async:false});
    var result=executeCommand(getnextReq,irlPartUrl);
    showData(JSON.parse(result.data)['record'])
    jQuery.ajaxSetup({async:true})
    setCurrRecNo2LS( JSON.parse(result.data))
    var r=getCurrRecNoFromLS();
    var t=getLastRecNoFromLS();
    // console.log({r,t})
    if(r===t){
        $('#first').prop('disabled',false);
        $('#prev').prop('disabled',false);
        $('#next').prop('disabled',true);
        $('#last').prop('disabled',true);
    }
    $('#save').prop('disabled',true);
    $('#first').prop('disabled',false);
    $('#prev').prop('disabled',false);
}

function getPrev(){
    var r=getCurrRecNoFromLS();
    // console.log(r)
    if(r===localStorage.getItem("first_rec_no")){
        $('#prev').prop('disabled',true);
        $('#first').prop('disabled',true);
    }
    var getPrevReq=createPREV_RECORDRequest(connToken,DBName,RelName,r);
    jQuery.ajaxSetup({async:false});
    var result=executeCommand(getPrevReq,irlPartUrl);
    setCurrRecNo2LS(JSON.parse(result.data))
    showData(JSON.parse(result.data)['record']);
    // console.log(JSON.parse(result.data)['record'])
    jQuery.ajaxSetup({async:true});
    var r=getCurrRecNoFromLS();
    if(r===localStorage.getItem("first_rec_no")){
        $('#first').prop('disabled',true);
        $('#prev').prop('disabled',true);
    }
    $("save").prop('disabled',true);

}

function makeDataFormEmpty(){
    return Object.keys(arr)
    .map(element=>{
        let temp='#'+element;
        `
        
        ${$(temp).val("")}
        `
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
    }).join("")
}


function newForm(){
    makeDataFormEmpty();
    // disableform(false);
    // disablenav(true);
    // disableCtrl(true);

    $('#save').prop('disabled',false);
    $('#reset').prop('disabled',false);

}

function resetForm(){
   
    var getCurrRequest =createGET_BY_RECORDRequest(connToken,DBName,RelName,getCurrRecNoFromLS());
    jQuery.ajaxSetup({async:false});
    var result =executeCommand(getCurrRequest,irlPartUrl);
    // console.log(result)
    showData(result)
    jQuery.ajaxSetup({async:true})
    if(isOnlyRecordPresent()||isNoRecordPresentLS()){
        disablenav(true)
    }
    $("#new").prop('disabled',false);
    if(isNoRecordPresentLS()){
        makeDataFormEmpty();
        $("#edit").prop("disabled",true);
    }else{
        $("#edit").prop("disabled",false);
    }
    disableform(true);
}


function validateData(){

    // console.log(arr)
    let jsonObj= {}
    for (let key in arr){
        let temp='#'+key;
        let val = $(temp).val()
        if (val === ''){
            alert("Data Missing");
            return ''
        }
        jsonObj[key] = val

    }
    return JSON.stringify(jsonObj)


}

function savedata(){
    var jsonStrObj =validateData();
    // console.log(jsonStrObj)
    if(jsonStrObj===""){
        return "";
    }
    var putRequest =createPUTRequest(connToken,jsonStrObj,DBName,RelName);
    // console.log(putRequest)
    jQuery.ajaxSetup({async:false});
    var jsonObj=executeCommand(putRequest,imlPartUrl);
    jQuery.ajaxSetup({async: true});
    // if(isNoRecordPresentLS()){
    //     setFirstRecNo2LS(jsonObj);
    // }
    setLastRecNo2LS(jsonObj);
    setCurrRecNo2LS(jsonObj);
    // console.log(jsonObj)
    window.location.assign("./dashboard.html");
    // resetForm();
   
}


function showTableHead(arr){
    return Object.keys(arr)
    .map(element =>(
        `
        <div class="form-group row">
          <label class="col-form-label col-sm-3 text-center my-auto" >${element}</label>
          <div class="col-sm-9">
            <input type="text" id="${element}" class="form-control" required>
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
    setCurrRecNo2LS(obj[ind]['rec_no']);
    // console.log(typeof obj[ind]['rec_no'])
    // validateData(obj[ind]['record']);
    arr=obj[ind]['record'];
    

}




// console.log(localStorage.getItem("rec_no"))
setForm();
getData();
// getFirst();
// console.log( empDBName)
// console.log( empRelName)
// console.log(connToken)
// initEmpForm();
// getFirst();
// getLast();
// checkForNoOrOneRecord();




