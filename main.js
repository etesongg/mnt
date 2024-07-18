import config from "../apikey.js"

const MOUNTAINS_KEY = config.KEY.mountains_key;
const MOUNTAINS_URL = config.URL.mountains_url;
const TRAIL_URL = config.URL.trail_url;

let url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}`)

const mountain_keyword = '지리산'

// 산 정보만 뽑을 경우
const getMntData = async() => {
    url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}&searchWrd=${mountain_keyword}`)
    const response = await fetch(url);
    const data = await response.json();
    console.log('getMntData',data)
    const mntilistNo = data.response.body.items.item.mntilistno; // 산 코드
    const mntiadd = data.response.body.items.length != 1?data.response.body.items.item[0].mntiadd: data.response.body.items.item.mntiadd
    // await getMntImgData(mntilistNo);
    await translateToAddress(mntiadd);
    // getTrailData()
}
getMntData()

// const getMntImgData = async (mntilistNo) => {
//     url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoImgOpenAPI2?_type=json&mntiListNo=${mntilistNo}&ServiceKey=${MOUNTAINS_KEY}`)
//     const response = await fetch(url);
//     const data = await response.json();
//     const MntImgFile = data.response.body.items.item[0].imgfilename
//     displayMntInfoFigure(MntImgFile)
// }

// const displayMntInfoFigure = (MntImgFile) => {
//     document.querySelector(".details-mnt-information figure").innerHTML = `<img src="http://www.forest.go.kr/images/data/down/mountain/${MntImgFile}" alt="">`;
// }

const getTrailData = async () => {
    url = new URL(`${TRAIL_URL}openapi/service/cultureInfoService/gdTrailInfoOpenAPI?_type=json&searchMtNm=${mountain_keyword}&serviceKey=${MOUNTAINS_KEY}`)
    const response = await fetch(url);
    const data = await response.json();
    console.log('getTrailData',data)
    const { mntncd, areanm } = data.response.body.items.item

    // await getMntTrail(mntncd);
    // await translateToAddress(areanm);
}
// mntncd	산코드
// mntnm 	산명
// subnm 	산정보부제
// areanm 	산정보소재지
// mntheight 	산정보높이
// aeatreason 	100대명산 선정이유
// overview 	산정보개관
// details 	산정보내용
// transport 	대중교통정보설명
// tourisminf 	주변관광정보설명
// etccourse	산정보주변관광정보기타코스설명


const translateToAddress = async (mntAdress) => {
    naver.maps.Service.geocode({ address: mntAdress }, function(status, response) {
        console.log(mntAdress)
        if (status === naver.maps.Service.Status.ERROR) {
            console.log('Something wrong!');
            console.log('Status:', status);
            console.log('Response:', response);
            return;
        }
        // 성공 시의 response 처리
        const {x, y} = response.v2.addresses[0]
        console.log(`x : ${x} y : ${y}`);
        return initMap(y, x)
    });
}

// 지도 생성
var map = null;

function initMap(x, y) {
    var map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(x, y),
        zoom: 15
    });
    
    var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(x, y),
        map: map
    });
}


