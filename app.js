// B方案黑洞粒子模块
const canvas = document.querySelector('#blackholeCanvas');
const ctx = canvas.getContext('2d');
let cw, ch;
let stars = [];
let collapse = false;
let expanse = false;
let startTime;
let animationId;
let aiIsLoading = false;

class Star {
    constructor() {
        const maxorbit = 255;
        const rands = [];
        rands.push(Math.random() * (maxorbit / 2) + 1);
        rands.push(Math.random() * (maxorbit / 2) + maxorbit);
        this.orbital = (rands.reduce((p, c) => p + c, 0) / rands.length);
        this.x = cw / 2;
        this.y = ch / 2 + this.orbital;
        this.yOrigin = ch / 2 + this.orbital;
        this.speed = (Math.floor(Math.random() * 2.5) + 1.5) * Math.PI / 180;
        this.startRotation = (Math.floor(Math.random() * 360) + 1) * Math.PI / 180;
        this.rotation = 0;
        this.id = stars.length;
        this.collapseBonus = this.orbital - (maxorbit * 0.7);
        if(this.collapseBonus < 0) this.collapseBonus = 0;
        this.hoverPos = ch / 2 + (maxorbit / 2) + this.collapseBonus;
        this.expansePos = ch / 2 + (this.id % 100) * -10 + (Math.floor(Math.random() * 20) + 1);
        this.prevR = this.startRotation;
        this.prevX = this.x;
        this.prevY = this.y;
        this.originalY = this.yOrigin;
        this.color = 'rgba(255,255,255,' + (1 - ((this.orbital) / 255)) + ')';
        this.breathPhase = Math.random() * Math.PI * 2;
        this.breathSpeed = 0.012 + Math.random() * 0.018;
        this.baseOpacity = 1 - ((this.orbital) / 255);
        stars.push(this);

    }
       draw(currentTime) {
           this.breathPhase += this.breathSpeed;
           const breathVal = 0.65 + 0.35 * Math.sin(this.breathPhase);
           const realAlpha = this.baseOpacity * breathVal;
           this.color = 'rgba(255,255,255,' + realAlpha + ')';

           const centerx = cw / 2;
           const centery = ch / 2;
           this.rotation = this.startRotation + (currentTime * this.speed);

                if (!expanse) {
                if (!collapse) {
                if (this.y > this.yOrigin) this.y -= 2.5;
                if (this.y < this.yOrigin - 4) this.y += (this.yOrigin - this.y) / 10;
            } else {
                if (this.y > this.hoverPos) this.y -= (this.hoverPos - this.y) / -5;
                if (this.y < this.hoverPos - 4) this.y += 2.5;
            }
        } else {
            if (this.y > this.expansePos) {
                this.y -= Math.floor(this.expansePos - this.y) / -60;
            }
        }

        function rotate(cx, cy, x, y, angle) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
            const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
            return [nx, ny];
        }

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        const oldPos = rotate(centerx, centery, this.prevX, this.prevY, -this.prevR);
        ctx.moveTo(oldPos[0], oldPos[1]);
        ctx.translate(centerx, centery);
        ctx.rotate(this.rotation);
        ctx.translate(-centerx, -centery);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        ctx.restore();
        this.prevR = this.rotation;
        this.prevX = this.x;
        this.prevY = this.y;
    }
}

function resizeCanvas() {
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;
}

function loop() {
    animationId = requestAnimationFrame(loop);
    const now = Date.now();
    const currentTime = (now - startTime) / 50;
    ctx.fillStyle = 'rgba(25,25,25,0.22)';
    ctx.fillRect(0, 0, cw, ch);
    for (let s of stars) s.draw(currentTime);
}

function initBlackHole() {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    startTime = Date.now();
    stars = [];
    for (let i = 0; i < 2500; i++) new Star();
    loop();
    canvas.onmouseenter = ()=>{ if(!expanse) collapse = true; };
    canvas.onmouseleave = ()=>{ if(!expanse) collapse = false; };
}

function triggerExplodeAndEnter() {
    expanse = true;
    setTimeout(()=>{
        enterApp();
    },600);
}

function enterApp() {
    document.getElementById('homeLayer').classList.add('hidden');
    document.getElementById('contentLayer').classList.add('active');
}

function returnHome() {
    document.getElementById('homeLayer').classList.remove('hidden');
    document.getElementById('contentLayer').classList.remove('active');
}

// 塔罗业务常量
const ELEMENT_MAP = {
    '火': { name: '火', icon: '🔥', class: 'fire', color: '#e67e22' },
    '风': { name: '风', icon: '💨', class: 'air', color: '#95a5a6' },
    '水': { name: '水', icon: '💧', class: 'water', color: '#3498db' },
    '土': { name: '土', icon: '🌍', class: 'earth', color: '#d4a574' }
};
const RANK_ELEMENT = { '侍从': '土', '骑士': '火', '王后': '水', '国王': '风' };
const MIX_ELEMENT_DESC = {
    '火+火': '纯粹的火焰，行动与意志的极致表达',
    '火+土': '火中之土，行动力扎根于现实',
    '火+水': '火中之水，热情与情感的交融',
    '火+风': '火中之风，行动受思维引导',
    '水+火': '水中之火，情感驱动行动',
    '水+水': '纯粹的水流，情感与直觉的深渊',
    '水+土': '水中之土，情感稳定扎根',
    '水+风': '水中之风，情感与思维的流动',
    '风+火': '风中之火，思维点燃行动',
    '风+水': '风中之水，思维渗透情感',
    '风+风': '纯粹的风，思维与沟通的极致',
    '风+土': '风中之土，思维落地实践',
    '土+火': '土中之火，物质中孕育行动',
    '土+水': '土中之水，物质滋养情感',
    '土+风': '土中之风，物质承载思维',
    '土+土': '纯粹的土，物质与现实的极致'
};

let currentPosition = 'upright';
let currentCard = null;
let favorites = JSON.parse(localStorage.getItem('tarot_favorites') || '[]');
let notes = JSON.parse(localStorage.getItem('tarot_notes') || '{}');
let history = JSON.parse(localStorage.getItem('tarot_history') || '[]');
let dailyCard = JSON.parse(localStorage.getItem('tarot_daily') || 'null');
let toastTimer = null;
let currentFilter = 'all';
let currentView = 'browse';
let currentSpread = 'three';
let currentSymbolFilter = 'all';

const SPREAD_DEFS = {
    three:{label:'三牌阵',count:3,slots:['过去','现在','未来'],meanings:['已发生之事，造就当下的因','此刻之局，需直面之境','即将显现，可望之势'],desc:'过去‑现在‑未来，最基础的线性时间之镜'},
    heartVoice:{label:'心之声牌阵',count:8,slots:['感情现状','不久的将来','他/她对你的看法(内)','他/她对你的看法(外)','对方的状态','他/她希望的结果','自己的状态','建议'],meanings:['当下的核心状态','即将到来的进展','他/她内心的潜意识','他/她外在的表现','对方现在的生活状态','对方期望的走向','你自己的内心状态','接下来的行动指南'],desc:'适用于两个人的感情走向，探索双方视角与内心'},
    relationship:{label:'关系牌阵',count:6,slots:['能量流动','你对感情的态度','对方对感情的态度','这段关系的本质','未来面临的问题','建议'],meanings:['你们之间的情感交互','你当下的心态','对方当下的心态','关系的核心议题','未来的阻碍','破局的指引'],desc:'探索感情全貌，适合总览一段关系'},
    choice:{label:'二选一选择牌阵',count:5,slots:['你当下的情况','选A的发展情况','选A的结果','选B的发展情况','选B的结果'],meanings:['现状与你的状态','A路线的进程','A路线的终点','B路线的进程','B路线的终点'],desc:'你有两个或三个选择，需要看如何做抉择'},
    breakupReunion:{label:'分手复合X牌阵',count:9,slots:['过去基础','你的现状','对方现状','你的真实想法','对方的真实想法','分手的具体原因','帮助复合的建议','你不知道的事情','未来两人会如何'],meanings:['关系的基础和起因','你现在的处境','对方现在的处境','你内心的真实诉求','对方内心的真实想法','导致分离的根本原因','促进复合的行动','被隐瞒的真相','未来的发展趋势'],desc:'分手后的感情看复合，基于当下双方状态探索可能性'},
    loversVenus:{label:'恋人维纳斯',count:8,slots:['你的表现','对方表现','感情的过去','感情的现状','因果(障碍)','你的内心','对方内心','感情的未来'],meanings:['你展现出的态度','对方展现出的态度','前期的基础','当下的状态','遇到的阻碍','你对关系的期许','对方对关系的期许','最终的发展方向'],desc:'长期恋爱关系/婚姻，重点挖掘双方表现与潜在想法'},
    loversCross:{label:'恋人十字牌阵',count:5,slots:['你现在的心境','对方对这段关系的看法','你们过去的关系情况','你们现在的关系情况','你们关系的未来走向'],meanings:['你当前的内心状态','对方视角下的关系','彼此的历史根源','当下的相处模式','未来的发展轨迹'],desc:'针对两人的爱情进行快速交叉占卜'},
    celtic:{label:'凯尔特十字',count:10,slots:['当下','阻挡','根基','过去','未来','上方','下方','建议','他人','结局'],meanings:['当前位置','面对的障碍','内在基石','近因','发展趋势','理想/意识','潜意识/恐惧','行动指引','外部影响','最终结果'],desc:'十张牌构成十字与权杖，全景式深层解读'}
};

const TAROT_DATA = [
{"id":0,"name":"愚者","emoji":"🃏","element":"风","number":"0","type":"major","age":"青年","role":"冒险者","time":"黎明","mood":"无畏","event":"启程","desc":"无限可能性。脚下悬崖，白玫瑰代表纯真，小狗提醒现实。","reverseDesc":"鲁莽轻率，不计后果。盲目冒险，或者恐惧迈出第一步。","highlight":"悬崖·白玫瑰·小狗","imgUrl":"https://pic1.imgdb.cn/i/0345qr49zJCvB89GbuZSlS.jpg"},
{"id":1,"name":"魔术师","emoji":"✨","element":"风","number":"1","type":"major","age":"成年","role":"创造者","time":"正午","mood":"专注","event":"显化","desc":"意志与资源。四元素摆在桌上，无限符号代表潜能。","reverseDesc":"诡计欺骗，资源浪费。滥用能力，或者意志涣散无法行动。","highlight":"无限符号·四元素·权杖","imgUrl":"https://pic1.imgdb.cn/i/0345qr49tGBwaXWYBpOnxJ.jpg"},
{"id":2,"name":"女祭司","emoji":"🌙","element":"水","number":"2","type":"major","age":"中年","role":"沉思者","time":"子夜","mood":"静默","event":"直觉","desc":"内在的智慧。门帘遮住秘密，黑白柱子代表二元。","reverseDesc":"直觉闭塞，回避真相。压抑内心感受，或者被情绪迷惑。","highlight":"门帘·月亮·黑白柱","imgUrl":"https://pic1.imgdb.cn/i/0345qr4Wb9w9bCCPEPPKJs.jpg"},
{"id":3,"name":"女皇","emoji":"🌷","element":"土","number":"3","type":"major","age":"成年","role":"孕育者","time":"午后","mood":"丰饶","event":"滋养","desc":"大地的孕育。麦穗象征丰收，金星代表爱与美。","reverseDesc":"创造力枯竭，忽视自我。过度沉溺感官，或者贫瘠停滞。","highlight":"麦穗·金星·花冠","imgUrl":"https://pic1.imgdb.cn/i/0345qr4KJvnO54hmwybRUV.jpg"},
{"id":4,"name":"皇帝","emoji":"🏛️","element":"土","number":"4","type":"major","age":"中年","role":"统治者","time":"正午","mood":"秩序","event":"建构","desc":"结构与权威。公羊象征力量，四方代表稳固的现实。","reverseDesc":"专断独裁，僵化固执。滥用权力，或者无力建立秩序。","highlight":"公羊·四方王座","imgUrl":"https://pic1.imgdb.cn/i/0345qr4RvDPxzDDzXbBlbP.jpg"},
{"id":5,"name":"教皇","emoji":"📜","element":"土","number":"5","type":"major","age":"老年","role":"导师","time":"清晨","mood":"传统","event":"传授","desc":"传统与教诲。两个信徒聆听教诲，教会的仪式。","reverseDesc":"墨守教条，虚伪说教。盲目服从权威，或者拒绝精神指引。","highlight":"三重冠·信徒·钥匙","imgUrl":"https://pic1.imgdb.cn/i/0345qpnZdNscsoj5YDeVIF.jpg"},
{"id":6,"name":"恋人","emoji":"💞","element":"风","number":"6","type":"major","age":"青年","role":"选择者","time":"黄昏","mood":"爱慕","event":"抉择","desc":"选择与结合。天使祝福，亚当夏娃面对善恶树。","reverseDesc":"感情失衡，错误抉择。价值观冲突，逃避重要选择。","highlight":"天使·善恶树·男女","imgUrl":"https://pic1.imgdb.cn/i/0345qr4rATJjgbeISqkj9M.jpg"},
{"id":7,"name":"战车","emoji":"🏇","element":"水","number":"7","type":"major","age":"青年","role":"征服者","time":"正午","mood":"斗志","event":"前进","desc":"意志驾驭对立。黑白狮身人面兽，靠意志平衡矛盾。","reverseDesc":"失去控制，内耗拉扯。被情绪驱动，强行推进而根基不稳。","highlight":"狮身人面·星冠","imgUrl":"https://pic1.imgdb.cn/i/0345qr4rYhMv4aszeFe6oS.jpg"},
{"id":8,"name":"力量","emoji":"🦁","element":"火","number":"8","type":"major","age":"成年","role":"驯服者","time":"午后","mood":"勇气","event":"接纳","desc":"温柔的力量。手轻合上狮子嘴巴，不是暴力而是内心的接纳。","reverseDesc":"怯懦软弱，压抑情绪。被恐惧支配，或者粗暴压制本能。","highlight":"狮子·无限符号·花冠","imgUrl":"https://pic1.imgdb.cn/i/0345qr5A4rafXy9Yprpjc7.jpg"},
{"id":9,"name":"隐士","emoji":"🏔️","element":"土","number":"9","type":"major","age":"老年","role":"智者","time":"深夜","mood":"内省","event":"独行","desc":"内在之光。提灯照亮脚下，权杖是经验的重量。","reverseDesc":"孤立退缩，拒绝指引。过度孤独导致迷失，或拒绝他人帮助。","highlight":"提灯·雪山","imgUrl":"https://pic1.imgdb.cn/i/0345qqXdhqrnTLysebzE7c.jpg"},
{"id":10,"name":"命运之轮","emoji":"🎡","element":"风","number":"10","type":"major","age":"无常","role":"循环","time":"永恒","mood":"转变","event":"轮回","desc":"一切流转。轮上三兽代表过去现在未来，上升与坠落都是命运。","reverseDesc":"厄运循环，抗拒改变。陷入负面循环，或拒绝接受变化。","highlight":"轮盘·天使·三兽","imgUrl":"https://pic1.imgdb.cn/i/0345qqXgpPnYYwE8kV2Hlb.jpg"},
{"id":11,"name":"正义","emoji":"⚖️","element":"风","number":"11","type":"major","age":"成年","role":"裁决者","time":"正午","mood":"平衡","event":"审判","desc":"因果之剑。天秤衡量，双刃剑切断虚妄。","reverseDesc":"不公不义，逃避责任。偏见影响判断，或拒绝面对后果。","highlight":"天秤·王冠·双刃剑","imgUrl":"https://pic1.imgdb.cn/i/0345qqXcRQfeOupUn8MJZf.jpg"},
{"id":12,"name":"倒吊人","emoji":"🙃","element":"水","number":"12","type":"major","age":"青年","role":"牺牲者","time":"黄昏","mood":"臣服","event":"逆转","desc":"逆向视角。自愿倒悬，光环在头顶，平静即是力量。","reverseDesc":"抗拒牺牲，徒劳挣扎。拒绝改变视角，或无谓的牺牲。","highlight":"倒悬·树·光晕","imgUrl":"https://pic1.imgdb.cn/i/0345qqXcpUXnpzRYrrYQZ4.jpg"},
{"id":13,"name":"死神","emoji":"💀","element":"水","number":"13","type":"major","age":"暮年","role":"终结者","time":"黄昏","mood":"蜕变","event":"结束","desc":"结束即新生。甲胄之下是慈悲，旗帜上玫瑰绽放于废墟。","reverseDesc":"停滞不变，抗拒结束。害怕改变导致僵化，或无法放手。","highlight":"骷髅·旗帜·河流·落日","imgUrl":"https://pic1.imgdb.cn/i/0345qqXeaDbmhsWPIbVa3w.jpg"},
{"id":14,"name":"节制","emoji":"🌊","element":"火","number":"14","type":"major","age":"成年","role":"调和者","time":"黎明","mood":"平衡","event":"融合","desc":"融合与流动。金杯交错，光芒从头顶倾泻。","reverseDesc":"极端失衡，过度放纵。失去节制导致混乱，或矫枉过正。","highlight":"金杯·光芒·路径","imgUrl":"https://pic1.imgdb.cn/i/0345qqYLTRuqmAthMf3YhO.jpg"},
{"id":15,"name":"恶魔","emoji":"😈","element":"土","number":"15","type":"major","age":"成年","role":"束缚者","time":"子夜","mood":"欲望","event":"禁锢","desc":"物质之奴。锁链看似松弛，倒五角星是扭曲的灵性。","reverseDesc":"打破束缚，重获自由。意识到枷锁的虚幻，开始挣脱。","highlight":"羊角·锁链·倒五角星","imgUrl":"https://pic1.imgdb.cn/i/0345qqYLHJ3eoOkl1sfb79.jpg"},
{"id":16,"name":"高塔","emoji":"🏰","element":"火","number":"16","type":"major","age":"无常","role":"毁灭者","time":"深夜","mood":"崩溃","event":"颠覆","desc":"幻象崩塌。闪电击中王冠，坠落是唯一的清醒。","reverseDesc":"逃避毁灭，虚假安全。抗拒必要的改变，或逃避真相。","highlight":"闪电·高塔·王冠","imgUrl":"https://pic1.imgdb.cn/i/0345qqYKh8bSylx6ut7it0.jpg"},
{"id":17,"name":"星星","emoji":"⭐","element":"风","number":"17","type":"major","age":"青年","role":"疗愈者","time":"深夜","mood":"希望","event":"静默","desc":"倾倒生命之水。八芒星是指引，赤足踏在干涸与丰饶之间。","reverseDesc":"希望破灭，失去信心。理想主义受挫，或失去方向感。","highlight":"八芒星·水罐·大地","imgUrl":"https://pic1.imgdb.cn/i/0345qqYJKMjtpZ9b4010Y0.jpg"},
{"id":18,"name":"月亮","emoji":"🌙","element":"水","number":"18","type":"major","age":"中年","role":"守夜人","time":"子夜","mood":"恐惧","event":"潜行","desc":"潜意识潮汐。狼与犬代表驯服与野性，塔是心智边界。","reverseDesc":"恐惧消散，真相大白。面对潜意识，或从幻觉中清醒。","highlight":"龙虾·小径·塔","imgUrl":"https://pic1.imgdb.cn/i/0345qqYLxlbkpMsCrtEWQq.jpg"},
{"id":19,"name":"太阳","emoji":"☀️","element":"火","number":"19","type":"major","age":"儿童","role":"生命","time":"清晨","mood":"喜悦","event":"重生","desc":"赤裸的真理。太阳花与围墙，孩童骑在白马之上。","reverseDesc":"过度乐观，短暂喜悦。表面的快乐掩盖深层问题。","highlight":"太阳·孩童·白马·向日葵","imgUrl":"https://pic1.imgdb.cn/i/0345qpnVvz0JuAawJK0WVG.jpg"},
{"id":20,"name":"审判","emoji":"📯","element":"火","number":"20","type":"major","age":"中年","role":"觉醒者","time":"黎明","mood":"召唤","event":"觉醒","desc":"终极召唤。号角吹响，棺中之人缓缓起身。","reverseDesc":"自我怀疑，拒绝召唤。害怕改变，或逃避内心的呼唤。","highlight":"天使·号角·棺材","imgUrl":"https://pic1.imgdb.cn/i/0345qpnqn6rAGCGIs5E1bi.jpg"},
{"id":21,"name":"世界","emoji":"🌍","element":"土","number":"21","type":"major","age":"圆满","role":"完成者","time":"永恒","mood":"完整","event":"成就","desc":"圆融归一。四角元素环绕，中央是舞动的生命。","reverseDesc":"未完成，延迟成就。缺乏 closure，或逃避完成的责任。","highlight":"花环·四兽","imgUrl":"https://pic1.imgdb.cn/i/0345qpnTmuAGgkU7YslLeJ.jpg"},
{"id":22,"name":"权杖Ace","emoji":"🔥","element":"火","number":"A","type":"wands","age":"开端","role":"行动者","time":"黎明","mood":"激情","event":"启动","desc":"火焰之种。云中伸出权杖，新行动正在发芽。","reverseDesc":"错失良机，能量受阻。创意被压抑，或行动被延迟。","highlight":"云手·权杖·城堡","imgUrl":"https://pic1.imgdb.cn/i/034GY89MlkZfUbvU2Z4mER.jpg"},
{"id":23,"name":"权杖二","emoji":"⚡","element":"火","number":"2","type":"wands","age":"青年","role":"决策者","time":"清晨","mood":"抉择","event":"计划","desc":"视野与选择。手握地球，远眺海平线。","reverseDesc":"恐惧改变，犹豫不决。害怕离开舒适区，或过度分析。","highlight":"权杖·地球·城墙","imgUrl":"https://pic1.imgdb.cn/i/034GY89Wo9QijOGEkknhwO.jpg"},
{"id":24,"name":"权杖三","emoji":"⛵","element":"火","number":"3","type":"wands","age":"壮年","role":"探索者","time":"正午","mood":"远征","event":"出发","desc":"扬帆起航。三根权杖立成港口，船队等待潮汐。","reverseDesc":"延迟出发，团队不和。计划受阻，或团队合作出现问题。","highlight":"权杖·船·海","imgUrl":"https://pic1.imgdb.cn/i/034GY89ezrkxwYRHcvgiWs.jpg"},
{"id":25,"name":"权杖四","emoji":"🏠","element":"火","number":"4","type":"wands","age":"成年","role":"定居者","time":"黄昏","mood":"庆祝","event":"扎根","desc":"家园与欢庆。四根权杖撑起花环，根基已稳。","reverseDesc":"家庭不和，缺乏支持。庆祝变成冲突，或离开舒适区。","highlight":"花环·权杖·城堡","imgUrl":"https://pic1.imgdb.cn/i/034GY8AYT3Q57AK0RMzZ4c.jpg"},
{"id":26,"name":"权杖五","emoji":"⚔️","element":"火","number":"5","type":"wands","age":"青年","role":"竞争者","time":"午后","mood":"冲突","event":"对抗","desc":"竞争之火。五根权杖交织，冲突是成长的代价。","reverseDesc":"避免冲突，内部不和。逃避竞争，或冲突在暗中进行。","highlight":"权杖·争斗·城堡","imgUrl":"https://pic1.imgdb.cn/i/034GYDiBWKJ8mlIGgkuOQX.jpg"},
{"id":27,"name":"权杖六","emoji":"🏆","element":"火","number":"6","type":"wands","age":"壮年","role":"胜利者","time":"正午","mood":"荣耀","event":"凯旋","desc":"胜利的游行。骑士头戴花环，权杖高举。","reverseDesc":"骄傲自满，延迟胜利。过度自信导致失败，或胜利被推迟。","highlight":"花环·权杖·马","imgUrl":"https://pic1.imgdb.cn/i/034GYDhCnF8uaAOCQpTQsa.jpg"},
{"id":28,"name":"权杖七","emoji":"🛡️","element":"火","number":"7","type":"wands","age":"成年","role":"防御者","time":"黄昏","mood":"坚持","event":"抵抗","desc":"孤军奋战。一人持杖对抗六杖，勇气是最后的武器。","reverseDesc":"放弃抵抗，不堪重负。放弃立场，或无法应对挑战。","highlight":"权杖·山顶·防御","imgUrl":"https://pic1.imgdb.cn/i/034GYDfz9J8ev1Tjvakzo5.jpg"},
{"id":29,"name":"权杖八","emoji":"⚡","element":"火","number":"8","type":"wands","age":"壮年","role":"行动者","time":"清晨","mood":"迅速","event":"进展","desc":"疾速前行。八根权杖破空，momentum不可阻挡。","reverseDesc":"延迟阻碍，混乱无序。行动受阻，或过度匆忙导致错误。","highlight":"权杖·速度","imgUrl":"https://pic1.imgdb.cn/i/034GYDfaOHTBI0hs2aGHW3.jpg"},
{"id":30,"name":"权杖九","emoji":"🛡️","element":"火","number":"9","type":"wands","age":"中年","role":"幸存者","time":"深夜","mood":"警觉","event":"防御","desc":"伤痕累累。战士紧抓权杖，最后一战即将来临。","reverseDesc":"精疲力竭，放弃防御。过度防御导致疲惫，或准备不足。","highlight":"权杖·绷带·防御","imgUrl":"https://pic1.imgdb.cn/i/034GYDg32wNsNuRTA5woxA.jpg"},
{"id":31,"name":"权杖十","emoji":"🏋️","element":"火","number":"10","type":"wands","age":"壮年","role":"负重者","time":"黄昏","mood":"压力","event":"承担","desc":"重负前行。十根权杖压弯脊背，责任是成长的代价。","reverseDesc":"不堪重负，拒绝责任。无法承担，或过度承担导致崩溃。","highlight":"权杖·重压·前行","imgUrl":"https://pic1.imgdb.cn/i/034GYDiKUUV4yhJYUVscUn.jpg"},
{"id":32,"name":"权杖侍从","emoji":"📜","element":"火","number":"侍从","type":"wands","age":"少年","role":"信使","time":"清晨","mood":"好奇","event":"消息","desc":"热情的信使。年轻侍从带来新消息与可能性。","reverseDesc":"消息延迟，缺乏方向。冲动行事，或消息不准确。","highlight":"权杖·卷轴","imgUrl":"https://pic1.imgdb.cn/i/034GY88a7qJqH1nVIuS4tR.jpg"},
{"id":33,"name":"权杖骑士","emoji":"🐴","element":"火","number":"骑士","type":"wands","age":"青年","role":"冒险者","time":"正午","mood":"冲动","event":"行动","desc":"冲动的骑士。火焰般热情，行动先于思考。","reverseDesc":"鲁莽冲动，失控愤怒。行动过于急躁，或失去控制。","highlight":"权杖·马","imgUrl":"https://pic1.imgdb.cn/i/034GY86W8LwwcqcibUkCE3.jpg"},
{"id":34,"name":"权杖王后","emoji":"👑","element":"火","number":"王后","type":"wands","age":"成年","role":"统治者","time":"午后","mood":"自信","event":"领导","desc":"火焰女王。自信而热情，黑猫是她神秘的伙伴。","reverseDesc":"专横霸道，嫉妒控制。过度强势，或情绪失控。","highlight":"权杖·黑猫","imgUrl":"https://pic1.imgdb.cn/i/034GY86uncYXWteBgIuLKu.jpg"},
{"id":35,"name":"权杖国王","emoji":"🤴","element":"火","number":"国王","type":"wands","age":"中年","role":"领袖","time":"正午","mood":"权威","event":"统治","desc":"火焰之王。成熟的领导力，狮子彰显威严。","reverseDesc":"暴虐专制，冲动易怒。滥用权力，或失去控制。","highlight":"权杖·狮子","imgUrl":"https://pic1.imgdb.cn/i/034GY85GRf0BsazrXoJo34.jpg"},
{"id":36,"name":"圣杯Ace","emoji":"🌊","element":"水","number":"A","type":"cups","age":"开端","role":"感受者","time":"黎明","mood":"情感","event":"涌现","desc":"情感之源。云中涌出五道水流，爱如泉涌。","reverseDesc":"情感阻塞，错失爱。情感被压抑，或机会被错过。","highlight":"圣杯·云手·鸽子","imgUrl":"https://pic1.imgdb.cn/i/034GY0vj6lQxv4Fs0nc9RU.jpg"},
{"id":37,"name":"圣杯二","emoji":"💕","element":"水","number":"2","type":"cups","age":"青年","role":"伴侣","time":"清晨","mood":"和谐","event":"结合","desc":"灵魂伴侣。两杯相交，赫尔墨斯之杖在中间。","reverseDesc":"关系失衡，分离不和。合作破裂，或情感不匹配。","highlight":"双杯·赫尔墨斯之杖","imgUrl":"https://pic1.imgdb.cn/i/034GY0ynsUrANxwOQtektn.jpg"},
{"id":38,"name":"圣杯三","emoji":"🎉","element":"水","number":"3","type":"cups","age":"成年","role":"庆祝者","time":"正午","mood":"欢乐","event":"团聚","desc":"欢庆时刻。三女子举杯，丰收与友谊。","reverseDesc":"过度放纵，表面欢乐。虚假的庆祝，或友谊破裂。","highlight":"三杯·舞蹈·丰收","imgUrl":"https://pic1.imgdb.cn/i/034GY0yhpu6gklUWlwbJah.jpg"},
{"id":39,"name":"圣杯四","emoji":"😔","element":"水","number":"4","type":"cups","age":"青年","role":"沉思者","time":"午后","mood":"倦怠","event":"失望","desc":"情感倦怠。青年无视第四杯，冷漠是心灵的寒冬。","reverseDesc":"新的开始，接受机会。走出倦怠，重新投入生活。","highlight":"树下·四杯","imgUrl":"https://pic1.imgdb.cn/i/034GY11KEyrQ4HKOm0CunX.jpg"},
{"id":40,"name":"圣杯五","emoji":"😢","element":"水","number":"5","type":"cups","age":"壮年","role":"哀悼者","time":"黄昏","mood":"悲伤","event":"失去","desc":"失落之痛。三杯倾倒，但身后两杯仍站立。","reverseDesc":"走出悲伤，看到希望。接受失去，重新找到快乐。","highlight":"三杯·桥","imgUrl":"https://pic1.imgdb.cn/i/034GY1BUXdiyQpo2AYAUtQ.jpg"},
{"id":41,"name":"圣杯六","emoji":"🌸","element":"水","number":"6","type":"cups","age":"儿童","role":"回忆者","time":"清晨","mood":"怀旧","event":"回忆","desc":"童年回忆。孩童互赠花朵，纯真年代。","reverseDesc":"困于过去，无法前进。过度怀旧，或童年阴影。","highlight":"孩童·花朵·城堡","imgUrl":"https://pic1.imgdb.cn/i/034GY1DwVyZZj1w6yF8pHq.jpg"},
{"id":42,"name":"圣杯七","emoji":"🌈","element":"水","number":"7","type":"cups","age":"青年","role":"梦想家","time":"午后","mood":"幻想","event":"选择","desc":"幻象之杯。七杯浮现不同幻象，选择是甜蜜的陷阱。","reverseDesc":"面对现实，做出选择。看清幻象，做出决定。","highlight":"七杯·云","imgUrl":"https://pic1.imgdb.cn/i/034GY1J0n4N3nb7HXJXhk5.jpg"},
{"id":43,"name":"圣杯八","emoji":"🚶","element":"水","number":"8","type":"cups","age":"壮年","role":"离开者","time":"黄昏","mood":"失望","event":"离去","desc":"悄然离去。放下八杯，追寻更高的意义。","reverseDesc":"逃避问题，放弃努力。放弃得太早，或逃避责任。","highlight":"八杯·月","imgUrl":"https://pic1.imgdb.cn/i/034GY1J4CqrvMlpwug9QkR.jpg"},
{"id":44,"name":"圣杯九","emoji":"😊","element":"水","number":"9","type":"cups","age":"成年","role":"满足者","time":"夜晚","mood":"满足","event":"实现","desc":"愿望达成。九杯整齐排列，满足写在脸上。","reverseDesc":"虚假满足，内在空虚。表面的快乐掩盖深层不满。","highlight":"九杯","imgUrl":"https://pic1.imgdb.cn/i/034GY86w3xckajdSzb60wU.jpg"},
{"id":45,"name":"圣杯十","emoji":"👨‍👩‍👧‍👦","element":"水","number":"10","type":"cups","age":"圆满","role":"幸福者","time":"正午","mood":"幸福","event":"圆满","desc":"家庭幸福。十杯彩虹之下，家庭是爱的港湾。","reverseDesc":"家庭不和，关系破裂。家庭问题，或理想化破灭。","highlight":"彩虹·十杯·家庭","imgUrl":"https://pic1.imgdb.cn/i/034GY867Za40soHfmnz1Jo.jpg"},
{"id":46,"name":"圣杯侍从","emoji":"🐟","element":"水","number":"侍从","type":"cups","age":"少年","role":"梦想家","time":"清晨","mood":"浪漫","event":"幻想","desc":"浪漫的梦想家。侍从凝视杯中的鱼，想象力无限。","reverseDesc":"情感不成熟，逃避现实。过度幻想，或情感依赖。","highlight":"鱼·蝴蝶","imgUrl":"https://pic1.imgdb.cn/i/034GY0tYmahhWQDLkjBgCE.jpg"},
{"id":47,"name":"圣杯骑士","emoji":"🐚","element":"水","number":"骑士","type":"cups","age":"青年","role":"追求者","time":"午后","mood":"浪漫","event":"追求","desc":"浪漫骑士。手持圣杯，追求心灵的理想。","reverseDesc":"情感逃避，承诺恐惧。害怕承诺，或情感不稳定。","highlight":"圣杯·贝壳·马","imgUrl":"https://pic1.imgdb.cn/i/034GY0vkHai39n4amGTK5P.jpg"},
{"id":48,"name":"圣杯王后","emoji":"🦀","element":"水","number":"王后","type":"cups","age":"成年","role":"关怀者","time":"黄昏","mood":"温柔","event":"滋养","desc":"温柔女王。情感深邃如海，螃蟹是她的象征。","reverseDesc":"情绪失控，过度敏感。被情绪淹没，或情感操纵。","highlight":"圣杯·螃蟹","imgUrl":"https://pic1.imgdb.cn/i/034GXmj8Rxd9Rafev5PZ4A.jpg"},
{"id":49,"name":"圣杯国王","emoji":"🚢","element":"水","number":"国王","type":"cups","age":"中年","role":"掌控者","time":"夜晚","mood":"平静","event":"掌控","desc":"情感之主。成熟掌控情感，船象征稳定。","reverseDesc":"情感压抑，操纵控制。情感冷漠，或操纵他人情感。","highlight":"圣杯·船","imgUrl":"https://pic1.imgdb.cn/i/034GXmiTVZNIS0qanvFaoi.jpg"},
{"id":50,"name":"宝剑Ace","emoji":"⚔️","element":"风","number":"A","type":"swords","age":"开端","role":"思想者","time":"黎明","mood":"清晰","event":"突破","desc":"思想之剑。云中伸出宝剑，王冠是心智的胜利。","reverseDesc":"混乱思维，错误决定。思维受阻，或判断失误。","highlight":"宝剑·云手·王冠","imgUrl":"https://pic1.imgdb.cn/i/034GXbuk0Xk58Fby7NOVhc.jpg"},
{"id":51,"name":"宝剑二","emoji":"⚔️","element":"风","number":"2","type":"swords","age":"青年","role":"抉择者","time":"夜晚","mood":"犹豫","event":"僵持","desc":"艰难抉择。蒙眼持剑，僵持是暂时的平衡。","reverseDesc":"真相大白，做出决定。打破僵局，或看清真相。","highlight":"蒙眼·双剑·月亮","imgUrl":"https://pic1.imgdb.cn/i/034GXbuWqTDlJgHsMx72Rh.jpg"},
{"id":52,"name":"宝剑三","emoji":"💔","element":"风","number":"3","type":"swords","age":"壮年","role":"受伤者","time":"深夜","mood":"痛苦","event":"心碎","desc":"心碎之痛。三剑刺穿红心，风暴是情感的洗礼。","reverseDesc":"走出痛苦，开始愈合。接受失去，或原谅他人。","highlight":"心脏·三剑·雨","imgUrl":"https://pic1.imgdb.cn/i/034GXbvnuEgp7vmOz5LXC6.jpg"},
{"id":53,"name":"宝剑四","emoji":"🛌","element":"风","number":"4","type":"swords","age":"成年","role":"休息者","time":"清晨","mood":"平静","event":"恢复","desc":"休憩恢复。四剑悬挂，静卧是战后的宁静。","reverseDesc":"无法休息，焦虑不安。拒绝休息，或过度焦虑。","highlight":"四剑·教堂·休息","imgUrl":"https://pic1.imgdb.cn/i/034GXbvGAsmv5XQQtzGQac.jpg"},
{"id":54,"name":"宝剑五","emoji":"🏃","element":"风","number":"5","type":"swords","age":"青年","role":"胜利者","time":"黄昏","mood":"空虚","event":"争斗","desc":"空洞胜利。胜者回望败者，代价是孤独。","reverseDesc":"和解宽恕，放弃争斗。承认失败，或寻求和解。","highlight":"五剑","imgUrl":"https://pic1.imgdb.cn/i/034GXbvudFKoaen8Mg6ti7.jpg"},
{"id":55,"name":"宝剑六","emoji":"🚣","element":"风","number":"6","type":"swords","age":"壮年","role":"旅行者","time":"清晨","mood":"疗愈","event":"过渡","desc":"疗愈之旅。驶向平静水域，带着过去的伤痛前行。","reverseDesc":"无法前进，困于过去。拒绝疗愈，或无法放下。","highlight":"船·六剑·过渡","imgUrl":"https://pic1.imgdb.cn/i/034GXbyggV5RJnwKRdyiGV.jpg"},
{"id":56,"name":"宝剑七","emoji":"🗡️","element":"风","number":"7","type":"swords","age":"青年","role":"策略者","time":"夜晚","mood":"隐秘","event":"谋略","desc":"隐秘行动。偷偷带走五剑，留下两把。","reverseDesc":"策略失败，被识破。欺骗被揭穿，或策略失误。","highlight":"五剑·帐篷·策略","imgUrl":"https://pic1.imgdb.cn/i/034GXbydAvwwF9RnJSKtg5.jpg"},
{"id":57,"name":"宝剑八","emoji":"⛓️","element":"风","number":"8","type":"swords","age":"成年","role":"困缚者","time":"深夜","mood":"束缚","event":"困境","desc":"自我束缚。蒙眼困于剑阵，但脚未被绑。","reverseDesc":"打破束缚，重获自由。意识到枷锁的虚幻，开始挣脱。","highlight":"八剑·蒙眼","imgUrl":"https://pic1.imgdb.cn/i/034GXbyfVvXYJo6TyhyB9l.jpg"},
{"id":58,"name":"宝剑九","emoji":"😰","element":"风","number":"9","type":"swords","age":"壮年","role":"焦虑者","time":"深夜","mood":"恐惧","event":"噩梦","desc":"噩梦惊醒。焦虑是心灵的牢笼，九剑悬挂床头。","reverseDesc":"恐惧消散，找到希望。面对恐惧，或寻求帮助。","highlight":"九剑·噩梦","imgUrl":"https://pic1.imgdb.cn/i/034GXbyzz34ToMMHPoEnPj.jpg"},
{"id":59,"name":"宝剑十","emoji":"⚰️","element":"风","number":"10","type":"swords","age":"壮年","role":"终结者","time":"黎明","mood":"结束","event":"终结","desc":"终结之痛。十剑刺穿背影，但也意味着新的开始。","reverseDesc":"绝处逢生，开始恢复。从最低点开始回升，或找到新方向。","highlight":"十剑","imgUrl":"https://pic1.imgdb.cn/i/034GXbyrVBovsG85k2DVQ5.jpg"},
{"id":60,"name":"宝剑侍从","emoji":"📨","element":"风","number":"侍从","type":"swords","age":"少年","role":"侦察兵","time":"清晨","mood":"好奇","event":"刺探","desc":"好奇的侦察兵。刺探新消息，带来真相。","reverseDesc":"八卦流言，缺乏专注。传播谣言，或注意力分散。","highlight":"宝剑·消息","imgUrl":"https://pic1.imgdb.cn/i/034GXg1j2M0JxMlaSJdO2g.jpg"},
{"id":61,"name":"宝剑骑士","emoji":"⚡","element":"风","number":"骑士","type":"swords","age":"青年","role":"冲锋者","time":"正午","mood":"激进","event":"冲锋","desc":"风暴骑士。冲锋陷阵毫不犹豫，如风般迅疾。","reverseDesc":"冲动鲁莽，言语伤人。行动过于激进，或言语攻击。","highlight":"宝剑·风暴","imgUrl":"https://pic1.imgdb.cn/i/034GXfycuI6xSwKotRGH4B.jpg"},
{"id":62,"name":"宝剑王后","emoji":"👁️","element":"风","number":"王后","type":"swords","age":"成年","role":"洞察者","time":"深夜","mood":"通透","event":"洞察","desc":"通透女王。手举真理之剑，看透一切虚妄。","reverseDesc":"冷酷无情，过度批判。缺乏同情心，或过于严苛。","highlight":"宝剑·手·真理","imgUrl":"https://pic1.imgdb.cn/i/034GXfyJPEMdGPTY4jptks.jpg"},
{"id":63,"name":"宝剑国王","emoji":"⚖️","element":"风","number":"国王","type":"swords","age":"中年","role":"裁决者","time":"正午","mood":"公正","event":"裁决","desc":"理性之主。公正裁决一切，思维清晰如剑。","reverseDesc":"滥用权力，冷酷专制。独裁统治，或缺乏公正。","highlight":"宝剑·裁决","imgUrl":"https://pic1.imgdb.cn/i/034GXfzAL3hCylB68R8Rxf.jpg"},
{"id":64,"name":"星币Ace","emoji":"💰","element":"土","number":"A","type":"pentacles","age":"开端","role":"创造者","time":"黎明","mood":"机遇","event":"种子","desc":"财富之种。云中手捧金币，新机遇降临。","reverseDesc":"错失良机，财务损失。机会被错过，或投资失败。","highlight":"星币·云手","imgUrl":"https://pic1.imgdb.cn/i/034GXfwNzkhbOELHGbMwcw.jpg"},
{"id":65,"name":"星币二","emoji":"🤹","element":"土","number":"2","type":"pentacles","age":"青年","role":"平衡者","time":"清晨","mood":"波动","event":"平衡","desc":"平衡之道。在波动中保持节奏，如杂耍般 juggling。","reverseDesc":"失衡混乱，过度承诺。无法平衡，或承担过多。","highlight":"星币·波浪·平衡","imgUrl":"https://pic1.imgdb.cn/i/034GXg2z1JSowTBugufDSU.jpg"},
{"id":66,"name":"星币三","emoji":"🏛️","element":"土","number":"3","type":"pentacles","age":"壮年","role":"工匠","time":"正午","mood":"专注","event":"合作","desc":"技艺精进。工匠在教堂雕刻，专注与合作。","reverseDesc":"缺乏技能，团队合作差。技艺不足，或团队不和。","highlight":"工匠·教堂·技艺","imgUrl":"https://pic1.imgdb.cn/i/034GXg3C5GIYcJxoVZLtYf.jpg"},
{"id":67,"name":"星币四","emoji":"🤲","element":"土","number":"4","type":"pentacles","age":"成年","role":"守财者","time":"黄昏","mood":"固守","event":"保守","desc":"固守财富。紧抓金币不放，害怕失去。","reverseDesc":"慷慨分享，放手控制。学会分享，或放下执念。","highlight":"星币·金币","imgUrl":"https://pic1.imgdb.cn/i/034GXg4Hjjt8x9O6Q29epx.jpg"},
{"id":68,"name":"星币五","emoji":"🥶","element":"土","number":"5","type":"pentacles","age":"壮年","role":"困境者","time":"深夜","mood":"艰难","event":"困境","desc":"物质困境。风雪中的教堂，寻求帮助。","reverseDesc":"走出困境，获得帮助。困难结束，或得到援助。","highlight":"风雪·教堂·困境","imgUrl":"https://pic1.imgdb.cn/i/034GXg5SeX6AtpXVTIlAA6.jpg"},
{"id":69,"name":"星币六","emoji":"🎁","element":"土","number":"6","type":"pentacles","age":"成年","role":"施予者","time":"正午","mood":"慷慨","event":"馈赠","desc":"给予与接受。商人的慷慨，天平衡量。","reverseDesc":"债务负担，不平等交换。过度给予，或债务问题。","highlight":"天平·给予","imgUrl":"https://pic1.imgdb.cn/i/034GXg7RHY6FpyDMypPYyt.jpg"},
{"id":70,"name":"星币七","emoji":"🌱","element":"土","number":"7","type":"pentacles","age":"壮年","role":"耕耘者","time":"午后","mood":"期待","event":"等待","desc":"耕耘等待。果实即将成熟，耐心等待收获。","reverseDesc":"缺乏耐心，投资失误。急于求成，或投资失败。","highlight":"果实·耕耘","imgUrl":"https://pic1.imgdb.cn/i/034GXmeF5xVJJy4dOGTC1V.jpg"},
{"id":71,"name":"星币八","emoji":"🔨","element":"土","number":"8","type":"pentacles","age":"壮年","role":"学徒","time":"清晨","mood":"勤奋","event":"精进","desc":"专注技艺。工匠打磨星币，日复一日。","reverseDesc":"缺乏专注，技能不足。敷衍了事，或技艺不精。","highlight":"工匠·打磨·勤奋","imgUrl":"https://pic1.imgdb.cn/i/034GXma4xu45wJ0xEGKbT5.jpg"},
{"id":72,"name":"星币九","emoji":"🦚","element":"土","number":"9","type":"pentacles","age":"成年","role":"享受者","time":"午后","mood":"满足","event":"享受","desc":"独立富足。果园中的优雅，孔雀开屏。","reverseDesc":"依赖他人，失去独立。过度依赖，或财务问题。","highlight":"果园·孔雀·优雅","imgUrl":"https://pic1.imgdb.cn/i/034GXmelqSkiVsSWXlnzby.jpg"},
{"id":73,"name":"星币十","emoji":"👨‍👩‍👧‍👦","element":"土","number":"10","type":"pentacles","age":"圆满","role":"传承者","time":"正午","mood":"传承","event":"legacy","desc":"家族传承。世代积累的财富，家族城堡。","reverseDesc":"家庭不和，财务损失。家族问题，或继承纠纷。","highlight":"家族·城堡·传承","imgUrl":"https://pic1.imgdb.cn/i/034GXmdsZoXo07sVfHF99R.jpg"},
{"id":74,"name":"星币侍从","emoji":"📚","element":"土","number":"侍从","type":"pentacles","age":"少年","role":"学习者","time":"清晨","mood":"好学","event":"学习","desc":"勤奋学徒。专注学习技艺，书本与星币。","reverseDesc":"缺乏动力，机会错失。学习懈怠，或机会错过。","highlight":"星币·书本","imgUrl":"https://pic1.imgdb.cn/i/034GXmixL4XOEHkmQRgJPa.jpg"},
{"id":75,"name":"星币骑士","emoji":"🐢","element":"土","number":"骑士","type":"pentacles","age":"青年","role":"执行者","time":"午后","mood":"稳健","event":"执行","desc":"稳健骑士。脚踏实地前行，不急不躁。","reverseDesc":"固执僵化，缺乏灵活。过于保守，或拒绝改变。","highlight":"星币·稳健","imgUrl":"https://pic1.imgdb.cn/i/034GXmhmQGEDiHDC4H7asX.jpg"},
{"id":76,"name":"星币王后","emoji":"🐇","element":"土","number":"王后","type":"pentacles","age":"成年","role":"滋养者","time":"午后","mood":"丰饶","event":"滋养","desc":"丰饶女王。手抚兔子坐于花园，大地之母。","reverseDesc":"过度依赖，物质主义。过于物质化，或失去自然连接。","highlight":"星币·兔子·花园","imgUrl":"https://pic1.imgdb.cn/i/034GXmgoHCSecrvHVCuDXp.jpg"},
{"id":77,"name":"星币国王","emoji":"👑","element":"土","number":"国王","type":"pentacles","age":"中年","role":"掌控者","time":"正午","mood":"权威","event":"掌控","desc":"财富之主。成熟掌控物质，王座稳固。","reverseDesc":"贪婪腐败，物质至上。过度追求物质，或财务腐败。","highlight":"星币·财富","imgUrl":"https://pic1.imgdb.cn/i/034GXmeHL0MsFCWrjmnmzb.jpg"}
];

const tarotSymbols = [
    { type: '关联库', symbol: '白马', cards: ['死神', '太阳'], meaning: '死亡与新生，同一匹马跨越生命周期两端' },
    { type: '关联库', symbol: '高塔', cards: ['高塔', '月亮'], meaning: '同一座尖顶石塔，显与隐的边界' },
    { type: '关联库', symbol: '旗帜', cards: ['死神', '太阳'], meaning: '同款旗帜，宣告终结与生命欢庆' },
    { type: '关联库', symbol: '玫瑰', cards: ['愚人', '死神', '魔术师'], meaning: '同种玫瑰（白/红），纯真→终结→创造' },
    { type: '关联库', symbol: '天使', cards: ['恋人', '审判', '节制'], meaning: '同一位神圣信使，神意介入人间' },
    { type: '关联库', symbol: '狮子', cards: ['力量', '权杖国王', '权杖王后'], meaning: '同一狮子/狮头装饰，驯服的原始力量' },
    { type: '关联库', symbol: '蛇', cards: ['恋人', '圣杯二'], meaning: '同一条蛇，智慧与关系的张力' },
    { type: '关联库', symbol: '向日葵', cards: ['太阳', '权杖王后'], meaning: '同一株向日葵，追随光明' },
    { type: '关联库', symbol: '百合', cards: ['魔术师', '皇后'], meaning: '同一朵白百合，纯洁与滋养' },
    { type: '关联库', symbol: '花环/桂冠', cards: ['力量', '世界', '权杖六', '宝剑Ace'], meaning: '同款胜利花环，成就与荣耀' },
    { type: '关联库', symbol: '王冠（十字顶）', cards: ['皇帝', '死神'], meaning: '同款十字顶王冠，世俗权威的终结' },
    { type: '关联库', symbol: '王冠（圆顶）', cards: ['皇后', '权杖王后'], meaning: '同款圆顶金冠，阴性滋养型王权' },
    { type: '关联库', symbol: '王冠（尖顶/三重冠）', cards: ['教皇', '战车'], meaning: '同款三重冠，精神与世俗结合' },
    { type: '关联库', symbol: '王冠（星冠）', cards: ['战车', '星星'], meaning: '同款星冠，宇宙指引与胜利' },
    { type: '关联库', symbol: '帆船', cards: ['权杖三', '星币二', '圣杯国王', '宝剑六'], meaning: '同款帆船，旅程与过渡' },
    { type: '关联库', symbol: '天平', cards: ['正义', '星币六'], meaning: '同款天平，公正与平衡' },
    { type: '关联库', symbol: '无限符号', cards: ['魔术师', '星币二', '力量'], meaning: '∞，无限潜能与永恒循环' },
    { type: '素材库', symbol: '山脉', cards: ['愚人', '隐士', '恋人', '皇帝', '节制', '审判', '权杖侍从', '权杖骑士', '星币Ace', '星币侍从'], meaning: '险阻、远方、蓄势、超越' },
    { type: '素材库', symbol: '河流/水流', cards: ['皇后', '节制', '月亮', '审判', '圣杯Ace', '圣杯八', '圣杯骑士'], meaning: '潜意识流动、过渡、远方' },
    { type: '素材库', symbol: '小径', cards: ['愚人', '隐士', '月亮', '节制'], meaning: '人生道路、追寻' },
    { type: '素材库', symbol: '海/浪', cards: ['宝剑二', '星币二'], meaning: '情感起伏、潜意识波动' },
    { type: '素材库', symbol: '太阳', cards: ['太阳', '恋人', '死神', '节制'], meaning: '意识、生命之源、启迪' },
    { type: '素材库', symbol: '月亮', cards: ['女祭司', '月亮', '圣杯八'], meaning: '直觉、潜意识、暗中之光' },
    { type: '素材库', symbol: '星星', cards: ['星星', '战车', '皇后'], meaning: '希望、指引、天命' },
    { type: '素材库', symbol: '云', cards: ['愚人', '审判', '圣杯四', '圣杯七', '宝剑侍从', '宝剑骑士'], meaning: '思绪、迷雾、神圣遮蔽' },
    { type: '素材库', symbol: '城堡', cards: ['权杖Ace', '权杖二', '权杖四', '圣杯五', '圣杯六', '星币四', '星币十', '星币国王'], meaning: '安全感、归宿、成就' }
];

function getDualElements(card) {
    const primary = card.element;
    let secondary = null;
    if (['侍从', '骑士', '王后', '国王'].includes(card.number)) {
        secondary = RANK_ELEMENT[card.number];
    }
    return { primary, secondary };
}
function getMixElementDesc(primary, secondary) {
    if (!secondary) return null;
    const key = primary + '+' + secondary;
    return MIX_ELEMENT_DESC[key] || `${primary}与${secondary}的融合`;
}

function switchPosition(pos) {
    currentPosition = pos;
    document.getElementById('uprightTab').classList.toggle('active', pos === 'upright');
    document.getElementById('reversedTab').classList.toggle('active', pos === 'reversed');
    const imgContainer = document.getElementById('detailImgContainer');
    const indicator = document.getElementById('reversedIndicator');
    const descBox = document.getElementById('modalDesc');
    if (pos === 'reversed') {
        imgContainer.classList.add('reversed');
        indicator.style.display = 'block';
        descBox.classList.add('reversed');
        descBox.innerHTML = `<strong>${currentCard.name} · 逆位</strong> — ${currentCard.reverseDesc}`;
    } else {
        imgContainer.classList.remove('reversed');
        indicator.style.display = 'none';
        descBox.classList.remove('reversed');
        descBox.innerHTML = `<strong>${currentCard.name} · 正位</strong> — ${currentCard.desc}`;
    }
}

function getTypeName(type) {
    const names = { major: '大阿卡纳', wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币' };
    return names[type] || type;
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    document.querySelectorAll('.view-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetView = document.getElementById(view + 'View');
    if (targetView) targetView.classList.add('active');

    const contentLayer = document.getElementById('contentLayer');
    if(contentLayer) {
        requestAnimationFrame(()=>{
            contentLayer.scrollTop = 0;
        })
    }

    if (view === 'history') renderHistory();
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderGrid();
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      const cardGrid = document.getElementById('cardGrid');
      if(cardGrid){
        cardGrid.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    })
  })
}

function renderGrid() {
    const grid = document.getElementById('cardGrid');
    if (!grid) return;
    let cards = TAROT_DATA;
    if (currentFilter !== 'all') {
        cards = cards.filter(c => c.type === currentFilter);
    }
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
        cards = cards.filter(c => c.name.toLowerCase().includes(searchTerm));
    }
    grid.innerHTML = cards.map(card => {
        const isFav = favorites.includes(card.id);
        const dual = getDualElements(card);
        const elementHtml = dual.secondary ?
            `<div class="card-elements"><span class="element-tag element-${ELEMENT_MAP[dual.primary].class}">${ELEMENT_MAP[dual.primary].icon}</span><span class="element-tag element-${ELEMENT_MAP[dual.secondary].class}">${ELEMENT_MAP[dual.secondary].icon}</span></div>` :
            `<div class="card-elements"><span class="element-tag element-${ELEMENT_MAP[dual.primary].class}">${ELEMENT_MAP[dual.primary].icon} ${dual.primary}</span></div>`;
        return `
                    <div class="card ${isFav ? 'favorite' : ''}" onclick="openCard(${card.id})">
                        <div class="card-img">
                            <img src="${card.imgUrl}" alt="${card.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'card-emoji\\'>${card.emoji}</span>'">
                        </div>
                        <div class="card-name">${card.name}</div>${elementHtml}
                    </div>`;
    }).join('');
}

function openCard(id, isReversed = false) {
    currentPosition = isReversed ? "reversed" : "upright";
    currentCard = TAROT_DATA.find(c => c.id === id);
    if (!currentCard) return;
    const img = document.getElementById('modalImg');
    if (img) {
        img.src = currentCard.imgUrl;
        img.onerror = function () {
            this.style.display = 'none';
            this.parentElement.innerHTML = `<div style="font-size:5rem;text-align:center;padding:2rem;">${currentCard.emoji}</div>`;
        };
        img.style.display = 'block';
    }
    renderElementDisplay(currentCard);
    const modalTitle = document.getElementById('modalTitle');
    if (modalTitle) modalTitle.innerHTML = `${currentCard.emoji} ${currentCard.name}`;
    const modalInfo = document.getElementById('modalInfo');
    if (modalInfo) {
        modalInfo.innerHTML = `
                    <div class="info-item"><div class="info-label">元素</div>${currentCard.element}</div>
                    <div class="info-item"><div class="info-label">数字</div>${currentCard.number}</div>
                    <div class="info-item"><div class="info-label">类别</div>${getTypeName(currentCard.type)}</div>
                    <div class="info-item"><div class="info-label">视觉焦点</div>${currentCard.highlight}</div>`;
    }
    switchPosition(currentPosition);
    const favBtn = document.getElementById('favoriteBtn');
    if (favBtn) {
        favBtn.textContent = favorites.includes(currentCard.id) ? '★ 已收藏' : '☆ 收藏';
        favBtn.classList.toggle('active', favorites.includes(currentCard.id));
    }
    const modalNote = document.getElementById('modalNote');
    if (modalNote) modalNote.value = notes[currentCard.id] || '';
    const modal = document.getElementById('modal');
    if (modal) modal.classList.add('active');
    renderRelatedCards(currentCard);
    setSpiritContext(`当前牌面：${currentCard.name}（${currentPosition === 'reversed' ? '逆位' : '正位'}）。元素：${currentCard.element}。画面符号：${currentCard.highlight}`);
}

function renderElementDisplay(card) {
    const dual = getDualElements(card);
    const elementDisplay = document.getElementById('elementDisplay');
    if (!elementDisplay) return;
    let html = '<h4>🔮 元素构成</h4>';
    if (dual.secondary) {
        html += `<div class="element-pair">
                    <div class="element-box element-${ELEMENT_MAP[dual.primary].class}">${ELEMENT_MAP[dual.primary].icon} 主元素：${dual.primary}</div>
                    <span style="color:#8f7a6b">+</span>
                    <div class="element-box element-${ELEMENT_MAP[dual.secondary].class}">${ELEMENT_MAP[dual.secondary].icon} 次元素：${dual.secondary}</div>
                </div>
                <div class="element-mix-desc">${getMixElementDesc(dual.primary, dual.secondary)}</div>`;
    } else {
        html += `<div class="element-pair"><div class="element-box element-${ELEMENT_MAP[dual.primary].class}">${ELEMENT_MAP[dual.primary].icon} ${dual.primary}元素</div></div><div class="element-mix-desc">纯粹的${dual.primary}元素能量</div>`;
    }
    elementDisplay.innerHTML = html;
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
    currentCard = null;
}
function closeModalScroll() {
    const scrollPos = window.scrollY;
    closeModal();
    setTimeout(() => window.scrollTo({ top: scrollPos, behavior: 'auto' }), 10);
}
function toggleFavorite() {
    if (!currentCard) return;
    const idx = favorites.indexOf(currentCard.id);
    if (idx > -1) {
        favorites.splice(idx, 1);
        showToast('已取消收藏');
    } else {
        favorites.push(currentCard.id);
        showToast('已收藏');
    }
    localStorage.setItem('tarot_favorites', JSON.stringify(favorites));
    const favBtn = document.getElementById('favoriteBtn');
    if (favBtn) {
        favBtn.textContent = favorites.includes(currentCard.id) ? '★ 已收藏' : '☆ 收藏';
        favBtn.classList.toggle('active', favorites.includes(currentCard.id));
    }
    renderGrid();
}
function shareCard() {
    if (!currentCard) return;
    const posText = currentPosition === 'reversed' ? '逆位' : '正位';
    const text = `【${currentCard.name}·${posText}】${currentPosition === 'reversed' ? currentCard.reverseDesc : currentCard.desc}`;
    if (navigator.share) {
        navigator.share({ title: currentCard.name, text, url: window.location.href });
    } else {
        navigator.clipboard.writeText(text).then(() => showToast('已复制到剪贴板'));
    }
}
function saveNote() {
    if (!currentCard) return;
    const modalNote = document.getElementById('modalNote');
    if (modalNote) {
        notes[currentCard.id] = modalNote.value;
        localStorage.setItem('tarot_notes', JSON.stringify(notes));
        showToast('备注已保存');
    }
}

function renderRelatedCards(card) {
    const container = document.getElementById('relatedCards');
    const grid = document.getElementById('relatedGrid');
    if (!container || !grid) return;
    const hits = tarotSymbols.filter(s => s.cards.includes(card.name));
    if (!hits.length) {
        container.style.display = 'none';
        return;
    }
    container.style.display = 'block';
    grid.innerHTML = hits.map(s => {
        const isLink = s.type === '关联库';
        const others = s.cards.filter(n => n !== card.name).join(' / ');
        return `<div class="symbol-chip ${isLink ? 'chip-link' : 'chip-material'}" onclick="showSymbolCard('${s.symbol}')">
                    <div class="chip-icon">${isLink ? '🔗' : '🎨'}</div>
                    <div class="chip-text"><div class="chip-name">${s.symbol}</div><div class="chip-type">${s.type}</div></div>
                    <div class="chip-others">${others}</div>
                </div>`;
    }).join('');
}

function showSymbolCard(symbolName) {
    const s = tarotSymbols.find(x => x.symbol === symbolName);
    if (!s) return;
    const isLink = s.type === '关联库';
    const accent = isLink ? '#b77e5e' : '#8f7a6b';
    const html = `<div class="symbol-modal" onclick="this.remove()">
                <div class="symbol-modal-inner ${isLink ? 'symbol-related' : 'symbol-material'}" onclick="event.stopPropagation()">
                    <div class="symbol-modal-header" style="color:${accent}">${isLink ? '🔗 关联库' : '🎨 画面素材'}</div>
                    <h3 style="color:#ebd6c2;margin:.3rem 0 .5rem;font-size:1.3rem">${s.symbol}</h3>
                    <p class="symbol-meaning">${s.meaning}</p>
                    <div class="symbol-hint">${isLink ? '📖 关联库：用于理解牌与牌之间的叙事联系' : '🖌️ 素材库：仅作为画面元素与创作参考'}</div>
                    <hr style="border:0;border-top:1px solid #3f2e2a;margin:.8rem 0">
                    <div style="font-size:.75rem;color:#d9946b;margin-bottom:.4rem">出现牌面（${s.cards.length}张）</div>
                    <div class="symbol-tags">${s.cards.map(name => { const c = TAROT_DATA.find(x => x.name === name); return `<span class="symbol-tag">${c ? c.emoji : ''} ${name}</span>`; }).join('')}</div>
                    <button class="close-scroll-btn" onclick="this.closest('.symbol-modal').remove()">✕ 合上符号卷轴</button>
                </div>
            </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

function drawCard() {
    const deck = document.getElementById('deck');
    if (!deck) return;
    deck.classList.add('shuffling');
    setTimeout(() => {
        deck.classList.remove('shuffling');
        const randomCard = TAROT_DATA[Math.floor(Math.random() * TAROT_DATA.length)];
        const isReversed = Math.random() > 0.5;
        const result = document.getElementById('drawResult');
        if (!result) return;
        addToHistory(randomCard, isReversed);
        const posClass = isReversed ? "reversed" : "";
        const badge = isReversed ? '<div class="reversed-badge">逆位</div>' : "";
        result.innerHTML = `<div class="draw-card ${posClass}">
                    <div class="card" onclick="openCard(${randomCard.id}, ${isReversed})" style="position:relative;">${badge}
                        <div class="card-img"><img src="${randomCard.imgUrl}" alt="${randomCard.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'card-emoji\\'>${randomCard.emoji}</span>'"></div>
                        <div class="card-name">${randomCard.name} ${isReversed ? '↓' : '↑'}</div>
                    </div>
                </div>`;
    }, 500);
}

function addToHistory(card, isReversed = false) {
    const record = {
        cardId: card.id,
        isReversed: isReversed,
        cardName: card.name,
        cardEmoji: card.emoji,
        cardImg: card.imgUrl,
        timestamp: new Date().toISOString()
    };
    history.unshift(record);
    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem('tarot_history', JSON.stringify(history));
}

function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    if (history.length === 0) {
        list.innerHTML = '<div style="text-align:center;color:#8f7a6b;padding:2rem;">暂无占卜记录</div>';
        return;
    }
    list.innerHTML = history.map(record => {
        const date = new Date(record.timestamp);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        const revClass = record.isReversed ? 'reversed' : '';
        const revBadge = record.isReversed ? '↓逆位' : '';
        return `<div class="history-item" onclick="openCard(${record.cardId}, ${!!record.isReversed})">
                    <div class="history-date">${dateStr}</div>
                    <div class="history-cards">
                        <div class="history-card-mini ${revClass}"><img src="${record.cardImg}" alt="${record.cardName}${revBadge}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'font-size:1.5rem;text-align:center;line-height:75px\\'>${record.cardEmoji}</div>'"></div>
                        <div style="display:flex;flex-direction:column;align-items:flex-start;justify-content:center;"><div style="color:#ebd6c2;font-weight:bold;">${record.cardName} ${revBadge}</div><div style="color:#8f7a6b;font-size:0.7rem;">点击查看详情</div></div>
                    </div>
                </div>`;
    }).join('');
}

let spreadCards = [];
function drawSpread() {
    const def = SPREAD_DEFS[currentSpread];
    const deckEl = document.getElementById('spreadDeck');
    if (!deckEl) return;
    deckEl.classList.add('shuffling');
    setTimeout(() => {
        deckEl.classList.remove('shuffling');
        spreadCards = [];
        for (let i = 0; i < def.count; i++) {
            const c = TAROT_DATA[Math.floor(Math.random() * TAROT_DATA.length)];
            const rev = Math.random() > 0.5;
            spreadCards.push({ card: c, reversed: rev });
            addToHistory(c, rev);
        }
        const grid = document.getElementById('spreadResult');
        const interp = document.getElementById('spreadInterp');
        interp.style.display = 'block';
        interp.innerHTML = `<strong>${def.label}</strong><br>${def.desc}`;
        grid.innerHTML = spreadCards.map((sc, idx) => {
            const pos = def.slots[idx];
            const mean = def.meanings[idx];
            const revCls = sc.reversed ? 'reversed' : '';
            const badge = sc.reversed ? '<div class="reversed-badge">逆位</div>' : '';
            return `<div class="spread-slot">
                        <div class="draw-card ${revCls}" onclick="openCard(${sc.card.id},${sc.reversed})" style="position:relative;">${badge}
                            <div class="card-img"><img src="${sc.card.imgUrl}" alt="${sc.card.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'card-emoji\\'>${sc.card.emoji}</span>'"></div>
                        </div>
                        <div class="spread-label">${pos}</div>
                        <div class="spread-meaning">${mean}</div>
                    </div>`;
        }).join('');
    }, 600);
}

document.querySelector('#spreadSelector')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-spread]');
    if (!btn) return;
    document.querySelectorAll('#spreadSelector .btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentSpread = btn.dataset.spread;
    const def = SPREAD_DEFS[currentSpread];
    document.getElementById('spreadCount').innerText = def.count + ' 张';
    document.getElementById('spreadResult').innerHTML = '';
    document.getElementById('spreadInterp').style.display = 'none';
});

function checkDailyCard() {
    const today = new Date().toDateString();
    if (dailyCard && dailyCard.date !== today) {
        dailyCard = null;
        localStorage.removeItem('tarot_daily');
    }
}
function showDailyCard() {
    checkDailyCard();
    const today = new Date().toDateString();
    if (!dailyCard) {
        const c = TAROT_DATA[Math.floor(Math.random() * TAROT_DATA.length)];
        const rev = Math.random() > 0.5;
        dailyCard = { date: today, cardId: c.id, reversed: rev };
        localStorage.setItem('tarot_daily', JSON.stringify(dailyCard));
    }
    openCard(dailyCard.cardId, dailyCard.reversed);
}

function openLibrary() {
    document.getElementById('libraryModal').classList.add('active');
}
function closeLibrary() {
    document.getElementById('libraryModal').classList.remove('active');
}
function filterSymbolCat(cat, evt) {
    evt?.stopPropagation();
    currentSymbolFilter = cat;
    document.querySelectorAll('.symbol-cat-btn').forEach(b => b.classList.remove('active'));
    evt?.target?.classList.add('active');
    searchSymbols();
}
function searchSymbols() {
    const input = document.getElementById('symbolSearchInput');
    const keyword = input ? input.value.trim().toLowerCase() : '';
    let arr = tarotSymbols;
    if (currentSymbolFilter !== 'all') {
        arr = arr.filter(s => s.type === (currentSymbolFilter === 'element' ? '关联库' : '素材库'));
    }
    if (keyword) {
        arr = arr.filter(s => s.symbol.toLowerCase().includes(keyword) || s.meaning.toLowerCase().includes(keyword) || s.cards.some(n => n.toLowerCase().includes(keyword)));
    }
    const resDom = document.getElementById('symbolResults');
    if (!resDom) return;
    if (!arr.length) {
        resDom.innerHTML = `<div style="text-align:center;color:#8f7a6b;padding:1rem;">无匹配结果</div>`;
        return;
    }
    resDom.innerHTML = arr.map(s => {
        const isLink = s.type === '关联库';
        return `<div class="symbol-result" onclick="showSymbolCard('${s.symbol}')">
                    <div><span class="symbol-match">${s.symbol}</span> <span style="font-size:0.65rem;color:#8f7a6b">[${s.type}]</span></div>
                    <div style="font-size:0.75rem;color:#ebd6c2;margin-top:0.3rem;line-height:1.5">${s.meaning}</div>
                </div>`;
    }).join('');
}

// 原版AI精灵，完整保留 fetch /api/chat，无开关
let spiritContext = '';
function setSpiritContext(ctx) {
    spiritContext = ctx;
    const el = document.getElementById('spirit-context');
    if(el) el.innerText = ctx;
}
function openSpirit() {
    document.getElementById('ai-spirit-modal').classList.add('active');
}
function closeSpirit() {
    document.getElementById('ai-spirit-modal').classList.remove('active');
}

async function askSpirit() {
    if(aiIsLoading) return;
    aiIsLoading = true;

    const inp = document.getElementById('spirit-input');
    const out = document.getElementById('spirit-output');
    const sendBtn = document.querySelector('.spirit-actions button');

    const q = inp.value.trim();
    if(!q) {
        out.innerText = "请输入你的问题，或者先点开一张牌再提问。";
        aiIsLoading = false;
        return;
    }

    out.innerText = "思考中...";
    sendBtn.disabled = true;
    sendBtn.innerText = "占卜思考中…";

    try {
        const res = await fetch("/api/chat", {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({
                context: spiritContext,
                question: q
            })
        });
        const data = await res.json();
        out.innerText = data.answer || "没有返回回答";
    } catch(err) {
        out.innerHTML = `<div style="color:#ff8888">⚠️ API接口请求失败<br>${err.message}<br>请确认后端服务已经启动，api接口可访问。</div>`;
    } finally {
        aiIsLoading = false;
        sendBtn.disabled = false;
        sendBtn.innerText = "发送";
        inp.value = '';
    }
}

function bindEvents() {
    document.querySelectorAll('[data-view]').forEach(btn=>{
        btn.addEventListener('click',e=>{
            const v = e.target.dataset.view;
            switchView(v);
        })
    })
    document.querySelectorAll('[data-filter]').forEach(btn=>{
        btn.addEventListener('click',e=>{
            const f = e.target.dataset.filter;
            setFilter(f);
        })
    })
    let searchTimer;
    const searchInput = document.getElementById('searchInput');
    if(searchInput){
        searchInput.addEventListener('input',()=>{
            clearTimeout(searchTimer);
            searchTimer = setTimeout(renderGrid,300);
        })
    }
    document.getElementById('deck')?.addEventListener('click',drawCard);
    document.getElementById('spreadDeck')?.addEventListener('click',drawSpread);
    document.getElementById('modalClose')?.addEventListener('click',closeModal);
    document.getElementById('modal')?.addEventListener('click',e=>{ if(e.target.id==='modal') closeModal(); });
    document.getElementById('favoriteBtn')?.addEventListener('click',toggleFavorite);
    document.getElementById('shareBtn')?.addEventListener('click',shareCard);
    document.getElementById('modalNote')?.addEventListener('blur',saveNote);
    document.getElementById('dailyBtn')?.addEventListener('click',showDailyCard);
}

window.addEventListener('DOMContentLoaded',()=>{
    initBlackHole();
    bindEvents();
    renderGrid();
    checkDailyCard();
});
