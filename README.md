# Javascript로 작성된 디스코드 음악 봇
discord.js 라이브러리와 discord.js-commando 프레임워크를 이용하여 작성되었습니다.

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

### 준비물

node.js, git, 기반 프로그램(Dependency)

### 기반 프로그램 설치 명령어

`npm i`

### 준비하기

config.json 파일을 수정하여 API 토큰을 추가해야 합니다.

```
{
  "prefix": "!",  // You can change the prefix to whatever you want it doesn't have to be - !
  "token": "디스코드 봇 토큰",
  "tenorAPI": "tenor 사이트 API 토큰",
  "youtubeAPI": "유튜브 API 토큰",
  "geniusLyricsAPI": "genius 가사사이트 API 토큰"
}
```
Open index.js and change the ID in line 30 to your discord user ID
index.js를 열고 31번 줄의  `owner: '266500442610073602'`에서 숫자를 관리자의 디스코드 유저 ID로 바꿔주세요. 디스코드 봇의 관리자를 설정해야 합니다.

### 명령어 목록

- 음악 관련 명령어

| 명령어       | 설명                                                                                                               | 사용례                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| !play         | 유튜브에 업로드 된 음악 또는 재생목록을 재생합니다. 검색 기능을 지원합니다. URL을 이용한 재생도 지원합니다.         | !play URL 또는 검색어 |
| !pause        | 현재 재생 중인 곡을 일시정지합니다.                                                                                            | !pause                 |
| !resume       | 일시정지된 곡을 다시 재생시킵니다.                                                                                            | !resume                |
| !leave        | 봇이 음성 채널을 나가도록 합니다.                                                                                            | !leave                 |
| !remove       | 재생 대기열의 특정한 순서의 곡을 제거합니다.                                                                  | !remove 4              |
| !queue        | 재생 대기열을 표시합니다.                                                                                                    | !queue                 |
| !shuffle      | 곡 재생 순서를 셔플합니다.                                                                                                    | !shuffle               |
| !skip         | 현재 곡을 넘깁니다. 다음 곡이 없을 시 재생이 중지됩니다.                                                                                             | !skip                  |
| !skipall      | 모든 곡을 넘깁니다.                                                                                                   | !skipall               |
| !skipto       | 특정한 순서의 곡으로 넘어갑니다.                                              | !skipto 5              |
| !volume       | 볼륨을 조절합니다. (1-100)                                                                                                        | !volume 80             |
| !loop         | 한 곡 반복 기능을 실행합니다. 한 번 더 명령어를 실행하면 기능을 중지합니다.                                                                                          | !loop                 |

- 기타 명령어

| 명령어      | 설명                                                                                                                                                         | 사용례                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| !random      | 랜덤 정수값을 표시합니다. 최솟값, 최댓값을 제시해야 합니다.                                                                                                              | !random 0 100         |

### 도움말

[유튜브 API 키 만드는 법](https://developers.google.com/youtube/v3/getting-started)


## 기여자들

[encoder-glitch](https://github.com/encoder-glitch) - uptime command

[chimaerra](https://github.com/chimaerra) - minor command tweaks
