//설치 목록

처음에는 node_modules 설치
npm install

npm install axios socket.io-client react-router-dom


npm install react-bootstrap bootstrap
Stylesheets
중요 - 최상단의 루트파일인 src/index.js 또는 App.js 파일에 다음 스타일을 추가해줍니다.
import 'bootstrap/dist/css/bootstrap.min.css';
만약 추가하지 않는다면 부트스트랩의 스타일은 적용되지 않습니다.


아이콘 설치
npm install react-icons --save


부트스트랩 UI 예쁘게
bootstrap.min.css 파일 src 밑에 추가 (어디서 다운받은지 모름)
import './bootstrap.min.css'; //index.js에 추가

//24.02.19 캘린더 추가
npm install react-calendar moment

//24.02.19 Chart 추가
npm i react-minimal-pie-chart

//24.03.05 redux 추가
redux 최신은 toolkit 시용함
npm install react-redux redux
npm i redux @reduxjs/toolkit react-redux

//24.03.07 calendar 추가
npm install --save @fullcalendar/react @fullcalendar/daygrid

//24.03.11 cookie 추가
npm install js-cookie

//////////////////////////////////
단축 rfce //js 기본 작성해줌