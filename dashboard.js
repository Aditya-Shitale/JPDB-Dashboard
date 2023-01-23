
var conntoken="";
var jpdbBaseURL="http://api.login2explore.com:5577"
var irlpart="/api/irl"
var imlpart="/api/iml"
function getURL(){
    document.getElementById("showtoken").value = localStorage.getItem("token_no")
    conntoken=localStorage.getItem("token_no")
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

function fun(r,d){
    // console.log({r,d});
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
        return arr
        .map(element =>(
            `
            <th id="${element.colName}">${element.colName}</th>

            `
        ))
        .join("");
    }

function getDBname(){
    var Dbreq=createGET_ALL_DBRequest(conntoken);
    // // console.log(Dbreq);
        jQuery.ajaxSetup({async:false})
        var result=executeCommand(Dbreq,irlpart);
        document.getElementById("database").innerHTML=showDBname(result.data);
        jQuery.ajaxSetup({async:true})
        var arr=result.data; 
        // // console.log(arr);
        // jQuery.ajaxSetup({async:false})
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
    // console.log({dbName,dbRel})
    
    var headreq=createGETALLCOLReques(conntoken,dbName,dbRel);
    // console.log(headreq)
    jQuery.ajaxSetup({async:false})
    var result=executeCommand(headreq,irlpart);
    // console.log(result)
    jQuery.ajaxSetup({async:true})
    result.data.push({colName: 'edit', colType: 'String'})
    result.data.push({colName: 'remove', colType: 'String'})
    result.data.unshift({colName: 'rec_no', colType: 'String'})
    // // console.log(result.data)
    document.getElementById("table-head").innerHTML=showTableHead(result.data)
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
// console.log(obj);
        document.getElementById("table-body").innerHTML = ""
        for (let index = 0; index < obj.length; index++) {
            // console.log(JSON.parse(result.data)['json_records'][index]['rec_no'])
            console.log(obj[index]['record'])
            
            document.getElementById("table-body").innerHTML += 
            `

                 <tr>
                 <td>${obj[index]['rec_no']}</td>
                ${getTableBody(obj[index]['record'])}
                <td><i class="fa-solid fa-pen-to-square"></i></td>
            <td><i class="fa-solid fa-trash"></i></td> 
                </tr>
            `
            // console.log(obj[index]['record']['da'])
            // <td><i class="fa-solid fa-pen-to-square"></i></td>
            // <td><i class="fa-solid fa-trash"></i></td> 
            
        }


}




getURL();
getDBname();
// getDbRelName();
// getTablehead();
// getAllData();