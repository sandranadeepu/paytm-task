


class discussions {
	constructor(id, user,discussion, votes, parentId) {
		this.id = id;
		
		this.discussion = discussion;
        this.date = new Date();
        this.user=user;
		this.votes = votes;
		this.childIds = [];
		this.parentId = parentId;
	}
	static toJSONform(discussions) { // created JSON string to send/save on server
		return `{
			"id" : "${discussions.id}",
            "discussion" : "${discussions.discussion}",
            "user":"${discussions.user}",
			"votes" : "${discussions.votes}",
			"date": "${discussions.date}",
			"parentId": "${discussions.parentId}",
			"childIds": "${JSON.stringify(discussions.childIds)}"
		}`;
  	}
}





let discussionArray = new Array();

(()=> { 
    let discussionobject = localStorage.getItem("discussion");
    console.log(discussionobject,"test local")
	if(discussionobject!=null) {
		discussionArray = JSON.parse(discussionobject);
		for(let i=0; i<discussionArray.length; i++) {
			discussionArray[i].lastUpdated = new Date(discussionArray[i].lastUpdated); // converting to Date Object
			discussionArray[i].votes = parseInt(discussionArray[i].votes);	// Converting string to Int
			discussionArray[i].childIds = JSON.parse(discussionArray[i].childIds); // converting string back to array form
		}
	}
})();




function myFunction() {
    users=['sandeep','kumar','vishnu'];
    localStorage.setItem('users',JSON.stringify(users));

loadDiscussions();


}




function onReply(event,main){
    event.preventDefault();
    console.log(main,"onReply");
    // return false;
    var discussionElem;
    var userList = JSON.parse(localStorage.getItem("users"));
    var userListLength=userList.length;
    var index=Math.floor(Math.random() * userListLength);
    var dt=new Date();
    var id;

    discussionElem=document.forms["replyForm"]['discussion'].value;

//    console.log('discussion',discussonElem,discussionArray,userListLength)

if(discussionElem==''){
document.getElementById("error").innerHTML="Enter discussion";

setTimeout(function(){
document.getElementById("error").innerHTML="";
},2000)
return false;
}
console.log(userList[index]+dt.getTime());
id=discussionArray.length;
console.log('discussion',discussionElem,typeof(discussionElem),dt)
console.log(userList[index],index,discussion,discussionArray.length-1); 
addDiscussionreply(main,userList[index],discussionElem,discussionArray.length-1);
// discussionArray.map(m=>{
//     console.log(m.parentId,m.childIds)
//     if(parent != null) {
// 		discussionArray[parent].childIds.push(discussionArray.length-1);
// 	} 
// })
loadDiscussions();

// discussionElem=document.forms["replyForm"].reset();
}






function onEnter(event){
    event.preventDefault();
    var discussionElem;
    var userList = JSON.parse(localStorage.getItem("users"));
    var userListLength=userList.length;
    var index=Math.floor(Math.random() * userListLength);
    var dt=new Date();
    var id;

    discussionElem=document.forms["discussionForm"]['discussion'].value;

//    console.log('discussion',discussonElem,discussionArray,userListLength)

if(discussionElem==''){
document.getElementById("error").innerHTML="Enter discussion";

setTimeout(function(){
document.getElementById("error").innerHTML="";
},2000)
return false;
}
console.log(userList[index]+dt.getTime());
id=discussionArray.length;
console.log('discussion',discussionElem,typeof(discussionElem),dt)
console.log(userList[index],index,discussion); 
addDiscussion(id,userList[index],discussionElem,null);
loadDiscussions();

discussionElem=document.forms["discussionForm"].reset();
}


function addDiscussion(id,user,discussion,parent){
    console.log(id,user,discussion,parent,"add")
    let discussionobj = new discussions(id,user,discussion,0, parent);
    discussionArray.push(discussionobj);
        console.log("hihhii",id)
    
    saveDiscussions();
}

function addDiscussionreply(id,user,discussion,parent){
    console.log(id,user,discussion,parent,"add")
    let discussionobj = new discussions(discussionArray.length,user,discussion,0, parent);
    discussionArray.push(discussionobj);
	if(parent != null) {
        console.log("hihhii",id)
		discussionArray[id].childIds.push(discussionArray.length-1);
    } 
    saveDiscussions();
}
function saveDiscussions(){ 
	// Storing comments in stringified array in local storage
	let val = "[";
	for(let i in discussionArray) {
		val += discussions.toJSONform(discussionArray[i]);
		(i != discussionArray.length - 1) ? val += "," : val += "";
	}
	val += "]";
	localStorage.setItem('discussion', val);
}
























function loadDiscussions() {
    let realdiscussion = [];
    let discussionList = '';

	discussionArray.forEach(discussion=> {
        console.log(discussion,'mapppp')
		if(discussion.parentId == null || discussion.parentId == "null") {
            realdiscussion.push(discussion);
        }
     
    });
    console.log(realdiscussion,'real')
	realdiscussion.forEach(discussion=> {
        console.log(discussion,'mapppp')
        console.log(discussion.parentId,"test",discussion.childIds)
		discussionList += loaddomDisussion(discussion);
    });
    console.log(discussionList,'dis');

	document.getElementById("discussionResult").innerHTML = discussionList 
}



function comment(id){
    console.log('comment'+id,'reply comment');
    var append=`<form name="replyForm" onsubmit=onReply(event,${id})>
   <div class="discussion">
           <input type="text" id="discussion" name="comment" placeholder="Reply to discussion..">
           <p id="error"></p>
         </div>
         </form`
         document.getElementById('comment'+id).innerHTML=append;
   }


   
function loaddomDisussion(discussion){
    console.log(discussion,'disscussiondom');
     let listelements= `<ul class=list><li >
    <p class="user">${discussion.user}   <span class="time">${duration(discussion.date)} </span></p>
    <p class="disc"> ${discussion.discussion}</p>
    <div><span>${discussion.votes}</span> <span>
    <button class="btnvote"><i class="fa fa-angle-up" onclick=incrementVote(event,"${discussion.id}")></i></button>
    <button class="btnvote"><i class="fa fa-angle-down" onclick=decrementVote(event,"${discussion.id}")></i></button>
    <button class="btnvote" onclick=comment("${discussion.id}")>reply</button>
    </span><div id=comment${discussion.id}></div></div>`
    if(discussion.childIds.length != 0) {
		listelements += `<ul class="list" id="childlist-${discussion.id}">`;
		discussion.childIds.forEach(disId=> {
			listelements += loaddomDisussion(discussionArray[disId]);
		});
	}		
	listelements += `</li></ul>`;
	return listelements;
    


}

 
function incrementVote(event,id){
    event.preventDefault()
    console.log(id,"incre")
    discussionArray.map(m=>{
        if(m.id==id){
            console.log(m,id,"inc");
             m.votes++
        }
        console.log(m,id,"inc");
        saveDiscussions();
         loadDiscussions();
    })
}
function decrementVote(event,id){
    event.preventDefault();
    discussionArray.map(m=>{
        console.log(m);
        if(m.id==id){
            if(m.votes>0){

             m.votes--;
            }
            console.log(m,id,"dec");

        }
        saveDiscussions();
         loadDiscussions();
    })
}



function duration(date){
    var theevent = new Date(date);
now = new Date();
var sec_num = (now-theevent) / 1000;
var days    = Math.floor(sec_num / (3600 * 24));
var hours   = Math.floor((sec_num - (days * (3600 * 24)))/3600);
var minutes = Math.floor((sec_num - (days * (3600 * 24)) - (hours * 3600)) / 60);
var seconds = Math.floor(sec_num - (days * (3600 * 24)) - (hours * 3600) - (minutes * 60));
if(days<1){days=''}
if (hours   < 1) {hours   = "";}
else{
    hours   = hours+" hrs";
}
if (minutes < 1) {minutes = "";}
else{
    minutes   = minutes+" min";
}
if (seconds < 1) {seconds = "";}
else{
    seconds   = seconds+" sec";
}
if(days==0&&hours==0&&minutes==0&&seconds==0){
    return 'just now'
}
else{
    return  days+' '+ hours+' '+minutes+' '+seconds+' ago';

}


}