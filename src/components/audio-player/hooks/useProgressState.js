//useProgress 여러번 사용 시 부하가 심함.. Seekbar에서 한번 호출 하고 전역으로 저장
let position = 0;

export const useSettingPos = (pos) => {
    position = pos;
}

export const useGettingPos = () => {
    return position;
}

