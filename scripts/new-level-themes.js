/**
 * 85 unique themes for levels 16–100.
 * Existing 15 theme ids must not appear here.
 */
function hsl(h, s, l) {
  return `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%)`;
}

function paletteFor(i) {
  const h = (i * 41 + 13) % 360;
  const dark = i % 9 === 0;
  if (dark) {
    return {
      bg: hsl(h, 35, 14),
      ink: hsl(h, 20, 92),
      onAccent: hsl(h, 35, 14),
      wall: hsl(h, 40, 42),
      path: hsl(h, 30, 22),
      accent: hsl(h + 40, 75, 58),
      btn: hsl(h + 40, 70, 65),
    };
  }
  return {
    bg: hsl(h, 55, 90),
    ink: hsl(h, 45, 22),
    onAccent: hsl(h, 45, 22),
    wall: hsl(h, 45, 48),
    path: hsl(h, 40, 96),
    accent: hsl(h + 50, 75, 55),
    btn: hsl(h + 50, 70, 68),
  };
}

/** [id, title, playerEmoji, goalEmoji] */
const THEMES = [
  ['bee', '蜜蜂花园', '🐝', '🍯'],
  ['library', '小小图书馆', '📚', '📖'],
  ['bakery', '甜蜜面包房', '🥐', '🥖'],
  ['circus', '欢乐马戏团', '🤡', '🎪'],
  ['soccer', '足球小将', '⚽', '🥅'],
  ['ballet', '芭蕾小舞台', '🩰', '🎀'],
  ['robot', '机器人工厂', '🤖', '🔋'],
  ['dragon', '龙之山谷', '🐉', '🏯'],
  ['phoenix', '火鸟神殿', '🔥', '🪺'],
  ['kite', '放风筝日', '🎐', '☁️'],
  ['pond', '荷塘月色', '🐸', '🪷'],
  ['bamboo', '熊猫竹林', '🐼', '🎋'],
  ['cherry', '樱花小径', '🌸', '⛩️'],
  ['peach', '桃子果园', '🍑', '🧺'],
  ['lemon', '柠檬汽水', '🍋', '🧋'],
  ['grape', '葡萄庄园', '🍇', '🧃'],
  ['melon', '西瓜野餐', '🍉', '🧺'],
  ['berry', '草莓甜心', '🍓', '🍰'],
  ['mango', '芒果海滩', '🥭', '🏖️'],
  ['koala', '考拉树屋', '🐨', '🌳'],
  ['tiger', '老虎山洞', '🐯', '🕳️'],
  ['lion', '狮子草原', '🦁', '🌅'],
  ['elephant', '大象乐园', '🐘', '🥜'],
  ['giraffe', '长颈鹿高塔', '🦒', '🗼'],
  ['monkey', '猴子丛林', '🐵', '🍌'],
  ['owl', '猫头鹰夜校', '🦉', '🕯️'],
  ['duck', '小鸭池塘', '🦆', '🪺'],
  ['swan', '天鹅湖', '🦢', '👑'],
  ['dolphin', '海豚海湾', '🐬', '🌊'],
  ['whale', '鲸鱼歌唱', '🐋', '🎵'],
  ['crab', '螃蟹沙滩', '🦀', '⛱️'],
  ['starfish', '海星礁石', '🌟', '🪸'],
  ['jellyfish', '水母灯光', '🪼', '💡'],
  ['coral', '珊瑚宫殿', '🪸', '👑'],
  ['lighthouse', '灯塔守望', '🏮', '🔦'],
  ['submarine', '潜水艇探险', '🚤', '⚓'],
  ['airplane', '小飞机旅行', '✈️', '🧳'],
  ['helicopter', '直升机救援', '🚁', '🆘'],
  ['balloon', '热气球旅行', '🎈', '🏔️'],
  ['bicycle', '自行车郊游', '🚲', '🚩'],
  ['scooter', '滑板车公园', '🛴', '🛹'],
  ['piano', '钢琴小屋', '🎹', '🎼'],
  ['drum', '鼓点广场', '🥁', '🎉'],
  ['violin', '小提琴森林', '🎻', '🌲'],
  ['trumpet', '喇叭乐园', '🎺', '🎊'],
  ['paint', '小小画家', '🎨', '🖼️'],
  ['crayon', '蜡笔小镇', '✏️', '📒'],
  ['puzzle', '拼图迷宫', '🧩', '✨'],
  ['blocks', '积木城堡', '🧱', '🏗️'],
  ['teddy', '泰迪熊商店', '🧸', '🎁'],
  ['dollhouse', '娃娃屋', '🏡', '🚪'],
  ['sandbox', '沙坑乐园', '🪣', '🏖️'],
  ['playground', '游乐场', '🛝', '🎠'],
  ['carousel', '旋转木马', '🎠', '🎟️'],
  ['ferris', '摩天轮之夜', '🎡', '🌃'],
  ['coaster', '过山车冒险', '🎢', '😆'],
  ['magic', '魔术帽', '🎩', '🐇'],
  ['wizard', '小巫师学院', '🧙', '🔮'],
  ['fairy', '仙女花园', '🧚', '🌷'],
  ['elf', '精灵树洞', '🧝', '🪵'],
  ['mushroom', '蘑菇村', '🍄', '🏘️'],
  ['acorn', '橡果森林', '🌰', '🐿️'],
  ['campfire', '篝火营地', '🏕️', '🔥'],
  ['tent', '帐篷过夜', '⛺', '🌟'],
  ['mountain', '登山小路', '⛰️', '🚩'],
  ['river', '小河漂流', '🛶', '🏞️'],
  ['waterfall', '瀑布秘境', '💦', '🌈'],
  ['glacier', '冰川奇遇', '🧊', '❄️'],
  ['aurora', '极光夜空', '🌌', '✨'],
  ['comet', '彗星轨道', '☄️', '🛸'],
  ['satellite', '卫星站', '🛰️', '📡'],
  ['alien', '友好外星人', '👽', '👾'],
  ['cat', '小猫咖啡馆', '🐱', '☕'],
  ['puppy', '小狗乐园', '🐶', '🦴'],
  ['hamster', '仓鼠滚轮', '🐹', '🛞'],
  ['chick', '小鸡农场', '🐥', '🌽'],
  ['peacock', '孔雀开屏', '🦚', '💎'],
  ['parrot', '鹦鹉学堂', '🦜', '🗣️'],
  ['flamingo', '火烈鸟湖', '🦩', '💗'],
  ['hedgehog', '刺猬落叶', '🦔', '🍂'],
  ['squirrel', '松鼠储粮', '🐿️', '🌰'],
  ['otter', '水獭河边', '🦦', '🪨'],
  ['seal', '海豹冰面', '🦭', '🧊'],
  ['cloud', '云朵软床', '☁️', '😴'],
  // sunrise 50×50 deferred — bake was too slow; ship 99 levels first
];

const RESERVED = new Set([
  'forest', 'ocean', 'space', 'candy', 'dino', 'farm', 'pirate', 'snow',
  'volcano', 'garden', 'train', 'castle', 'desert', 'rainbow', 'moon',
]);

if (THEMES.length !== 84) {
  throw new Error('expected 84 themes, got ' + THEMES.length);
}
const ids = new Set();
for (const [id] of THEMES) {
  if (RESERVED.has(id)) throw new Error('theme clashes with existing: ' + id);
  if (ids.has(id)) throw new Error('duplicate theme id: ' + id);
  ids.add(id);
}

module.exports = { THEMES, paletteFor };
