import config from "./apikey.js"

const MOUNTAINS_KEY = config.KEY.mountains_key
const MOUNTAINS_URL = config.URL.mountains_url

let mntList = [];

let url = new URL(`${MOUNTAINS_URL}?_type=json&serviceKey=${MOUNTAINS_KEY}`)

// 산 이름만 뽑을 경우
const getData = async() => {
    url = new URL(`${MOUNTAINS_URL}?_type=json&serviceKey=${MOUNTAINS_KEY}`)
    const response = await fetch(url);
    const data = await response.json();
    mntList = data.response.body.items.item
    console.log(mntList)
    const mntHTML = mntList.map((mnt) => {
        const mntiName = mnt.mntiname;

        return `
        <li class="list-group-item" mntName="${mntiName}">${mntiName}</li>
        `
    }).join("");

    document.getElementById("mnt-list").innerHTML = mntHTML;
}
getData()
