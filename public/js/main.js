const chatform=document.getElementById("chat-form");
const chatmessages=document.querySelector(".chat-messages");
const roomname=document.getElementById("room-name");
const userList=document.getElementById("users");

const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

const socket=io();

socket.emit("joinRoom",{username,room});


socket.on("roomusers",({room,users})=>{
    outputRoomNmae(room);
    outputUsers(users);
})


socket.on("message",message=>{
    console.log(message);
    outputMessage(message);
    chatmessages.scrollTop=chatmessages.scrollHeight;
    
});

chatform.addEventListener("submit",(e)=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;
   socket.emit("chatmessage",msg);

   e.target.elements.msg.value="";
    e.target.elements.msg.focus();
});


function outputMessage(message){
    const div=document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`
    <p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>
    `;
    document.querySelector(".chat-messages").appendChild(div);
}


function outputRoomNmae(room){
    roomname.innerText=room;
}

function outputUsers(users){
    userList.innerHTML=`
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `
}

