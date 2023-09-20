"use strict";
const getUserName = document.querySelector("#user");
const formSubmit = document.querySelector("#form");
const main_container = document.querySelector(".main_container");
//resuable function
async function myCustomFetcher(url, options) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Network response was not ok - status : ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
}
const showResultUI = (signleUser) => {
    const { avatar_url, login, url, location } = signleUser;
    main_container.insertAdjacentHTML("beforeend", `<div class='card'>
            <img src=${avatar_url} alt=${login} />
            <hr/>
            <div class = 'card-footer'>
                <img src="${avatar_url}" alt="${login}" />
                <a href="${url}">Github</a>
            </div>
        </div>`);
};
function fetchUserData(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        for (const signleUser of userInfo) {
            showResultUI(signleUser);
            console.log(`Login : ${signleUser.login}`);
        }
    });
}
fetchUserData("https://api.github.com/users");
// Search functionalities
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = getUserName.value.toLowerCase();
    try {
        const url = "https://api.github.com/users";
        const allUserData = await myCustomFetcher(url, {});
        const matchingUsers = allUserData.filter(user => {
            return user.login.toLowerCase().includes(searchTerm);
        });
        //we need to clear previous data
        main_container.innerHTML = "";
        if (matchingUsers.length === 0) {
            main_container?.insertAdjacentHTML("beforeend", `
                <p class="empty-msg">No mathing user foudnd</>
                `);
        }
        else {
            for (const signleUser of matchingUsers) {
                showResultUI(signleUser);
                console.log(signleUser);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
