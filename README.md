# WebProg Final - Trtris 線上對戰系統



## 07/05 final presentation
Github link :  https://github.com/yzhsieh/WebProg-final/tree/final
Demo link : https://webprog-tetris-fullstack.herokuapp.com/
(網站極不穩定，若助教測試時是掛掉的請跟我說一聲><)
Demo video link : https://youtu.be/fSjUkLFYrIQ

### 功能說明：
1. 登入畫面： 首次登入請輸入想要的帳號及密碼(建議用生日)之後按register之後再按login，若無反應請再嘗試一次
    !!注意密碼傳輸沒有經過加密，請不要使用自己平常用的密碼
2. 進入大廳之後可以選擇右上角創立房間或是點大廳中已創立的房間加入
3. 在房間中必須要有兩個人才能按開始遊戲 (若助教測試時可以自己辦兩個帳號用XD)
4. 本俄羅斯方塊規則是兩人共用一個盤面，每放下一個方塊可以獲得10分，消除一排可獲得100分，其中一方先獲得800分或是卡死即結束。雙方方塊落下途中不會互相碰撞。

### 分工：
謝宜展： 100%

### 心得：
原本想說可以透過final做一些有用的東西，然而所想到的功能都太過複雜，期末又有一堆東西要寫(明明都大四了....)，因此最後選擇以線上小遊戲作為目標(因為socketio實在太神奇了想要多玩玩XD)
不過原本以為只是單純的俄羅斯方塊，難度不會很高，因此選擇自幹。結果沒想到在處理多人同時遊戲的部分花了極大量的時間，導致最後沒能實作一些小功能出來(如聊天室、自動加入等等)。如果暑假還有閒情逸致應該會把它補完。
這次實作一整個題目發現寫網頁要考量的比想像中的還要多很多，不是只有尻code就好了，還要想辦法去優化速度，前後端傳遞資料也要想辦法減少，才能確保速度。雖然最後再deploy時遇到不少問題，不過當作品可以在網路上跑的時候成就感還蠻高的。


## in class hackathon (06/06)
### 題目：會員系統以及大廳系統
說明：
final要做線上對決遊戲，因此在黑克松先做出會員系統和大廳系統
登入介面在輸入完之後可以按register直接註冊，若註冊過則按login登入
大廳介面有目前在線人員名單、遊戲大廳列表、聊天室(尚未做)及個人資料
因為mysql目前是用local端的，尚不能在其他地方reproduce，我正在找線上mysql資源或是其他代替方案
### 心得
原本認為排版很簡單，結果到最後切版/寫react/寫server 各佔了三分之一，前端使用reactstrap當作樣板，不過還只有用到其中幾個東西而已。
因為還不太懂redux所以把大部分東西都塞在index的state裡，顯得有點混亂
另外我覺得架mysql server的坑比想像中大QQ，原本想用Azure的資源架設，可是設定完之後卻連不上。之後還是不行可能就要換別種資料庫了


#### checklist

- [x] 簡易帳號系統(存入database)
- [x] 簡易登入介面
- [x] 遊戲大廳、開房、加入房間功能
- [ ] 錯誤資訊 (目前只完成一半)
- [ ] 聊天室
- [ ] 尋找網路資料庫


