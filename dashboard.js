
let conntoken;
var jpdbBaseURL="http://api.login2explore.com:5577"
var irlpart="/api/irl"
var imlpart="/api/iml"
const getURL = async () => {
    
    conntoken = localStorage.getItem("token_no")
    // console.log(localStorage.getItem("token_no"))
    document.getElementById("showtoken").value=conntoken;
    // console.log("error here")
}

function createGET_ALL_DBRequest(token) {
    var req = "{\n"
            + "\"token\" :"
            + token
            + ",\n" + "\"cmd\" : \"GET_ALL_DB\"\n"
            + "}";
           return req;
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


function createREMOVERecordReques(token, dbName, relName, reqId) {
    var req = "{\n"
            + "\"token\" : "
            + token
            + ","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"REMOVE\",\n"
            + "\"rel\" : \""
            + relName
            + "\",\n" + "\"record\":"
            + reqId
            + "\n"
            + "}";
    return req;
}


function createGET_ALL_RELATIONRequest(token, dbName) {
    var req = "{\n"
            + "\"token\" : "
            + token
            +  ","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GET_ALL_RELATION\"\n"
            + "}";
    return req;
}
function createGETALLCOLReques(token, dbName, relName) {
    var req = "{\n"
            + "\"token\" : "
            + token
            + ","
            + "\"dbName\": \""
            + dbName
            + "\",\n" + "\"cmd\" : \"GET_ALL_COL\",\n"
            + "\"rel\" : \""
            + relName
            + "\"\n"
            + "}";
    return req;
}
function executeCommand(reqString, apiEndPointUrl) {
    var url = jpdbBaseURL + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function showDBname(array){
    return array
    .map(element => (
            `
            <li class="nav-item">
            <a href="#" class="nav-link">
            <i class="nav-icon fas fa-tachometer-alt"></i>
            <p>
            ${element}
            <i class="right fas fa-angle-left"></i>
            </p>
            </a>
            <ul class="nav nav-treeview">
            <li class="nav-item" id="${element}">
           
            </li>
            </ul>
            </li>
            `
        ))
    .join("");
    }



    function showRelName(db,relation){
        
        // console.log(db,"hjhhh");
        // console.log(relation,"hhjhgg");
        return relation
        .map(element =>(
                       `
            <span class="nav-link" >
            <i class="far fa-circle nav-icon"></i>
            <p id="${element.relName}" onclick="getTablehead('${db}','${element.relName}')">${element.relName}</p>
            </span>
            `
        ))
        .join("");
    }
    function showTableHead(arr){
        return Object.keys(arr)
        .map(element =>(
            `
            <th id="${element}">${element}</th>

            `
        ))
        .join("");
    }

function getDBname(){
    var Dbreq=createGET_ALL_DBRequest(conntoken);
    // // console.log(Dbreq);
        jQuery.ajaxSetup({async:false})
        var result=executeCommand(Dbreq,irlpart);
        // console.log(document.getElementById("database"))
        document.getElementById("database").innerHTML=showDBname(result.data);
        jQuery.ajaxSetup({async:true})
        var arr=result.data; 
        // // console.log(arr);
        jQuery.ajaxSetup({async:false})
        // console.log(arr,"arr")  
        arr.forEach(element => {
        // console.log(element);
        getDbRelName(element)
         } )
        // jQuery.ajaxSetup({async:true})   
}
function getDbRelName(dbObj){
    var RelReq=createGET_ALL_RELATIONRequest(conntoken,dbObj);
    // // console.log(RelReq)
    jQuery.ajaxSetup({async:false})
    var result=executeCommand(RelReq,irlpart);
    // // console.log(result)
    jQuery.ajaxSetup({async:true})
    // console.log(dbObj,typeof(dbObj),"dbobj")
    document.getElementById(dbObj).innerHTML=showRelName(dbObj,result.data)
   
}



function getTablehead(dbName,dbRel){
    // console.log(dbRel)
        localStorage.setItem("DB_Name",dbName);
        localStorage.setItem("DB_Rel",dbRel);
    var headreq=createGET_ALL_Data(conntoken,dbName,dbRel);
    // console.log(headreq)
    jQuery.ajaxSetup({async:false})
    var result=executeCommand(headreq,irlpart);
    // console.log(result)
    jQuery.ajaxSetup({async:true})
    obj=JSON.parse(result.data)['json_records']
    let ind;
    for(let index = 0; index < obj.length; index++){
        if(obj[index]!=null){
            ind=index;
        }
    }
    obj[ind]['record'] = {...obj[ind]['record'], edit: 0}
    obj[ind]['record'] = {...obj[ind]['record'], remove: 0}
    obj[ind]['record'] = {rec_no:0,...obj[ind]['record']}
    // console.log(obj[1]['record'])
  
    // obj[0]['record'].push({remove:""})
    document.getElementById("table-head").innerHTML= showTableHead(obj[ind]['record'])
    getAllData(dbName,dbRel)
}
let obj;
function getTableBody(obj){
        // console.log(Object.keys(obj));
        return Object.keys(obj)
        .map(element=>(
           `
            <td>${obj[element]}</td>
           `
        ))
        .join("")
}
function fun(rec){
    localStorage.setItem("rec_no",rec);
    location.href = "./form.html";
}
function deleteItem(rec_no){
    var db= localStorage.getItem("DB_Name");
    var rel= localStorage.getItem("DB_Rel");
    var removeReqStr = createREMOVERecordReques(conntoken,db,rel, rec_no);
    console.log(removeReqStr);
    jQuery.ajaxSetup({async:false})
    var result=executeCommand(removeReqStr,imlpart);
    jQuery.ajaxSetup({async:true});
    window.location.reload();

}

function getAllData(db,rel){
        var req=createGET_ALL_Data(conntoken,db,rel);
        // console.log(req);
        jQuery.ajaxSetup({async:false})
        var result=executeCommand(req,irlpart);
        jQuery.ajaxSetup({async:true})
        // console.log(result)

      obj=JSON.parse(result.data)['json_records']
// console.log(JSON.parse(result.data)['rec_no'])
// let obj1=JSON.parse(result.data)['rec_no'];
// console.log(Object.keys(obj));
        document.getElementById("table-body").innerHTML = ""
        for (let index = 0; index < obj.length; index++) {
            // console.log(JSON.parse(result.data)['json_records'][index]['rec_no'])
            console.log(obj[index]['rec_no']);
            // console.log(obj[index]['record'])
            if(obj[index]['record']!=null){

                document.getElementById("table-body").innerHTML += 
                `
    
                     <tr>
                     <td>${obj[index]['rec_no']}</td>
                    ${getTableBody(obj[index]['record'])}
                    <td ><i onclick="fun(${obj[index]['rec_no']})" class="fa-solid fa-pen-to-square"></i></td>
                <td><i onclick="deleteItem('${obj[index]['rec_no']}')" class="fa-solid fa-trash"></i></td> 
                    </tr>
                `
            }
            // console.log(obj[index]['record']['da'])
            // <td><i class="fa-solid fa-pen-to-square"></i></td>
            // <td><i class="fa-solid fa-trash"></i></td> 
            
        }
}



 getURL();
  getDBname();
document.addEventListener('DOMContentLoaded', async () => {
    
    
})
// getDbRelName();
// getTablehead();
// getAllData();
