import config from "../apikey.js"

const MOUNTAINS_KEY = config.KEY.mountains_key;
const MOUNTAINS_URL = config.URL.mountains_url;
const TRAIL_URL = config.URL.trail_url;
const WEATHER_URL = config.URL.weather_url;
const WEATHER_KEY = config.KEY.weather_key;

let url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}`)

const mountain_keyword = '한라산'

// 산 정보만 뽑을 경우
const getMntData = async() => {
    url = new URL(`${MOUNTAINS_URL}1400000/service/cultureInfoService2/mntInfoOpenAPI2?_type=json&serviceKey=${MOUNTAINS_KEY}&searchWrd=${mountain_keyword}`)
    const response = await fetch(url);
    const data = await response.json();
    console.log('getMntData',data)
    const mntilistNo = data.response.body.items.item.mntilistno; // 산 코드
    const mntiadd = Array.isArray(data.response.body.items.item)?data.response.body.items.item[0].mntiadd: data.response.body.items.item.mntiadd
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
        console.log(`y : ${x} x : ${y}`);
        // return initMap(y, x)
        return callWeather(y, x)
    });
}

// 지도 생성
var map = null;

// function initMap(x, y) {
//     var map = new naver.maps.Map('map', {
//         center: new naver.maps.LatLng(x, y),
//         zoom: 15
//     });
    
//     var marker = new naver.maps.Marker({
//         position: new naver.maps.LatLng(x, y),
//         map: map
//     });
// }

const callWeather = async (y, x) => {
    url = new URL(`${WEATHER_URL}data/2.5/weather?lat=${y}&lon=${x}&lang=kr&units=metric&appid=${WEATHER_KEY}`)
    const response = await fetch(url);
    const data = await response.json();
    console.log('callWeather',data)
    const currTemp = Math.round(data.main.temp * 10) / 10;
  const weatherType = data.weather[0].description;
//   const currTime = getYmd10(data.dt);
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  console.log("temp:", currTemp);
  console.log("날씨:", weatherType);
//   console.log("기준시간:", getYmd10(data.dt));
  console.log("아이콘", iconUrl);
}


