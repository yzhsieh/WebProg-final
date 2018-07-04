# WebProg Final - Trtris 線上對戰系統



## final presentation
Demo link : https://youtu.be/fSjUkLFYrIQ


### 心得：
原先以為只是單純的俄羅斯方塊，難度不會很高，因此選擇自幹。結果沒想到在處理多人遊戲


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


