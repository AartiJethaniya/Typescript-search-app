const getUserName = document.querySelector("#user") as HTMLInputElement
const formSubmit = document.querySelector("#form") as HTMLFormElement
const main_container = document.querySelector(".main_container") as HTMLElement


//define the contract of an object
interface UserData{
    id : number;
    login:string;
    avatar_url : string;
    location: string;
    url : string ;
}

//resuable function

async function myCustomFetcher<T>(url:string,options?:RequestInit):Promise<T>{
    const response = await fetch(url,options);
    if(!response.ok){
        throw new Error(
            `Network response was not ok - status : ${response.status}`
        )
    }

    const data= await response.json();
    console.log(data);
    return data;
}
const showResultUI = (signleUser:UserData)=>{
    const {avatar_url,login,url,location} = signleUser;
    main_container.insertAdjacentHTML(
        "beforeend",
        `<div class='card'>
            <img src=${avatar_url} alt=${login} />
            <hr/>
            <div class = 'card-footer'>
                <img src="${avatar_url}" alt="${login}" />
                <a href="${url}">Github</a>
            </div>
        </div>`
    )
}
function fetchUserData(url:string){
    myCustomFetcher<UserData[]>(url,{}).then((userInfo)=>{
        for(const signleUser of userInfo){
            showResultUI(signleUser);
            console.log(`Login : ${signleUser.login}`)
        }
    });
}

fetchUserData("https://api.github.com/users")

// Search functionalities

formSubmit.addEventListener("submit",async (e)=>{
    e.preventDefault();
    const searchTerm = getUserName.value.toLowerCase();

    try{
        const url = "https://api.github.com/users"
        const allUserData = await myCustomFetcher<UserData[]>(url,{});

        const matchingUsers = allUserData.filter(user =>{
            return user.login.toLowerCase().includes(searchTerm);
        }) 

        //we need to clear previous data
        main_container.innerHTML = "";

        if(matchingUsers.length ===0){
            main_container?.insertAdjacentHTML(
                "beforeend",
                `
                <p class="empty-msg">No mathing user foudnd</>
                `
            )
        }else{
            for(const signleUser of matchingUsers){
                showResultUI(signleUser)
                console.log(signleUser);
            }
        }
    }catch(err) {
        console.log(err)
    }
})