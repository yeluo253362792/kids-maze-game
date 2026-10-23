(function (root) {
  const LEVEL_CATALOG = [
  {
    "id": "forest",
    "title": "森林小动物",
    "size": 10,
    "seed": 120,
    "maxNest": 2,
    "theme": "forest",
    "playerEmoji": "🦊",
    "goalEmoji": "🏠",
    "colors": null
  },
  {
    "id": "ocean",
    "title": "海底冒险",
    "size": 15,
    "seed": 102,
    "maxNest": 2,
    "theme": "ocean",
    "playerEmoji": "🐢",
    "goalEmoji": "🐚",
    "colors": null
  },
  {
    "id": "space",
    "title": "星空火箭",
    "size": 20,
    "seed": 23,
    "maxNest": 2,
    "theme": "space",
    "playerEmoji": "🚀",
    "goalEmoji": "🪐",
    "colors": null
  },
  {
    "id": "candy",
    "title": "糖果王国",
    "size": 15,
    "seed": 46,
    "maxNest": 2,
    "theme": "candy",
    "playerEmoji": "🍬",
    "goalEmoji": "🍭",
    "colors": null
  },
  {
    "id": "dino",
    "title": "恐龙乐园",
    "size": 15,
    "seed": 62,
    "maxNest": 3,
    "theme": "dino",
    "playerEmoji": "🦕",
    "goalEmoji": "🥚",
    "colors": null
  },
  {
    "id": "farm",
    "title": "开心农场",
    "size": 15,
    "seed": 2,
    "maxNest": 2,
    "theme": "farm",
    "playerEmoji": "🐑",
    "goalEmoji": "🌾",
    "colors": null
  },
  {
    "id": "pirate",
    "title": "海盗寻宝",
    "size": 20,
    "seed": 16,
    "maxNest": 2,
    "theme": "pirate",
    "playerEmoji": "🏴‍☠️",
    "goalEmoji": "💎",
    "colors": null
  },
  {
    "id": "snow",
    "title": "雪地小屋",
    "size": 20,
    "seed": 8,
    "maxNest": 3,
    "theme": "snow",
    "playerEmoji": "🐧",
    "goalEmoji": "⛄",
    "colors": null
  },
  {
    "id": "volcano",
    "title": "火山探险",
    "size": 20,
    "seed": 30,
    "maxNest": 2,
    "theme": "volcano",
    "playerEmoji": "🦎",
    "goalEmoji": "🌋",
    "colors": null
  },
  {
    "id": "garden",
    "title": "蝴蝶花园",
    "size": 25,
    "seed": 26,
    "maxNest": 2,
    "theme": "garden",
    "playerEmoji": "🦋",
    "goalEmoji": "🌸",
    "colors": null
  },
  {
    "id": "train",
    "title": "小火车",
    "size": 25,
    "seed": 11,
    "maxNest": 3,
    "theme": "train",
    "playerEmoji": "🚂",
    "goalEmoji": "🚉",
    "colors": null
  },
  {
    "id": "castle",
    "title": "城堡骑士",
    "size": 25,
    "seed": 50,
    "maxNest": 2,
    "theme": "castle",
    "playerEmoji": "🐴",
    "goalEmoji": "🏰",
    "colors": null
  },
  {
    "id": "desert",
    "title": "沙漠绿洲",
    "size": 30,
    "seed": 58,
    "maxNest": 2,
    "theme": "desert",
    "playerEmoji": "🐪",
    "goalEmoji": "🌴",
    "colors": null
  },
  {
    "id": "rainbow",
    "title": "彩虹滑梯",
    "size": 30,
    "seed": 34,
    "maxNest": 3,
    "theme": "rainbow",
    "playerEmoji": "🦄",
    "goalEmoji": "🌈",
    "colors": null
  },
  {
    "id": "moon",
    "title": "月亮兔子",
    "size": 30,
    "seed": 31,
    "maxNest": 2,
    "theme": "moon",
    "playerEmoji": "🐰",
    "goalEmoji": "🌙",
    "colors": null
  },
  {
    "id": "bee",
    "title": "蜜蜂花园",
    "size": 15,
    "seed": 200,
    "maxNest": 2,
    "theme": "bee",
    "playerEmoji": "🐝",
    "goalEmoji": "🍯",
    "colors": {
      "bg": "hsl(13 35% 14%)",
      "ink": "hsl(13 20% 92%)",
      "onAccent": "hsl(13 35% 14%)",
      "wall": "hsl(13 40% 42%)",
      "path": "hsl(13 30% 22%)",
      "accent": "hsl(53 75% 58%)",
      "btn": "hsl(53 70% 65%)"
    }
  },
  {
    "id": "library",
    "title": "小小图书馆",
    "size": 15,
    "seed": 201,
    "maxNest": 2,
    "theme": "library",
    "playerEmoji": "📚",
    "goalEmoji": "📖",
    "colors": {
      "bg": "hsl(54 55% 90%)",
      "ink": "hsl(54 45% 22%)",
      "onAccent": "hsl(54 45% 22%)",
      "wall": "hsl(54 45% 48%)",
      "path": "hsl(54 40% 96%)",
      "accent": "hsl(104 75% 55%)",
      "btn": "hsl(104 70% 68%)"
    }
  },
  {
    "id": "bakery",
    "title": "甜蜜面包房",
    "size": 16,
    "seed": 202,
    "maxNest": 3,
    "theme": "bakery",
    "playerEmoji": "🥐",
    "goalEmoji": "🥖",
    "colors": {
      "bg": "hsl(95 55% 90%)",
      "ink": "hsl(95 45% 22%)",
      "onAccent": "hsl(95 45% 22%)",
      "wall": "hsl(95 45% 48%)",
      "path": "hsl(95 40% 96%)",
      "accent": "hsl(145 75% 55%)",
      "btn": "hsl(145 70% 68%)"
    }
  },
  {
    "id": "circus",
    "title": "欢乐马戏团",
    "size": 16,
    "seed": 203,
    "maxNest": 2,
    "theme": "circus",
    "playerEmoji": "🤡",
    "goalEmoji": "🎪",
    "colors": {
      "bg": "hsl(136 55% 90%)",
      "ink": "hsl(136 45% 22%)",
      "onAccent": "hsl(136 45% 22%)",
      "wall": "hsl(136 45% 48%)",
      "path": "hsl(136 40% 96%)",
      "accent": "hsl(186 75% 55%)",
      "btn": "hsl(186 70% 68%)"
    }
  },
  {
    "id": "soccer",
    "title": "足球小将",
    "size": 16,
    "seed": 204,
    "maxNest": 2,
    "theme": "soccer",
    "playerEmoji": "⚽",
    "goalEmoji": "🥅",
    "colors": {
      "bg": "hsl(177 55% 90%)",
      "ink": "hsl(177 45% 22%)",
      "onAccent": "hsl(177 45% 22%)",
      "wall": "hsl(177 45% 48%)",
      "path": "hsl(177 40% 96%)",
      "accent": "hsl(227 75% 55%)",
      "btn": "hsl(227 70% 68%)"
    }
  },
  {
    "id": "ballet",
    "title": "芭蕾小舞台",
    "size": 16,
    "seed": 205,
    "maxNest": 3,
    "theme": "ballet",
    "playerEmoji": "🩰",
    "goalEmoji": "🎀",
    "colors": {
      "bg": "hsl(218 55% 90%)",
      "ink": "hsl(218 45% 22%)",
      "onAccent": "hsl(218 45% 22%)",
      "wall": "hsl(218 45% 48%)",
      "path": "hsl(218 40% 96%)",
      "accent": "hsl(268 75% 55%)",
      "btn": "hsl(268 70% 68%)"
    }
  },
  {
    "id": "robot",
    "title": "机器人工厂",
    "size": 17,
    "seed": 206,
    "maxNest": 2,
    "theme": "robot",
    "playerEmoji": "🤖",
    "goalEmoji": "🔋",
    "colors": {
      "bg": "hsl(259 55% 90%)",
      "ink": "hsl(259 45% 22%)",
      "onAccent": "hsl(259 45% 22%)",
      "wall": "hsl(259 45% 48%)",
      "path": "hsl(259 40% 96%)",
      "accent": "hsl(309 75% 55%)",
      "btn": "hsl(309 70% 68%)"
    }
  },
  {
    "id": "dragon",
    "title": "龙之山谷",
    "size": 17,
    "seed": 207,
    "maxNest": 2,
    "theme": "dragon",
    "playerEmoji": "🐉",
    "goalEmoji": "🏯",
    "colors": {
      "bg": "hsl(300 55% 90%)",
      "ink": "hsl(300 45% 22%)",
      "onAccent": "hsl(300 45% 22%)",
      "wall": "hsl(300 45% 48%)",
      "path": "hsl(300 40% 96%)",
      "accent": "hsl(350 75% 55%)",
      "btn": "hsl(350 70% 68%)"
    }
  },
  {
    "id": "phoenix",
    "title": "火鸟神殿",
    "size": 17,
    "seed": 208,
    "maxNest": 3,
    "theme": "phoenix",
    "playerEmoji": "🔥",
    "goalEmoji": "🪺",
    "colors": {
      "bg": "hsl(341 55% 90%)",
      "ink": "hsl(341 45% 22%)",
      "onAccent": "hsl(341 45% 22%)",
      "wall": "hsl(341 45% 48%)",
      "path": "hsl(341 40% 96%)",
      "accent": "hsl(31 75% 55%)",
      "btn": "hsl(31 70% 68%)"
    }
  },
  {
    "id": "kite",
    "title": "放风筝日",
    "size": 17,
    "seed": 209,
    "maxNest": 2,
    "theme": "kite",
    "playerEmoji": "🎐",
    "goalEmoji": "☁️",
    "colors": {
      "bg": "hsl(22 35% 14%)",
      "ink": "hsl(22 20% 92%)",
      "onAccent": "hsl(22 35% 14%)",
      "wall": "hsl(22 40% 42%)",
      "path": "hsl(22 30% 22%)",
      "accent": "hsl(62 75% 58%)",
      "btn": "hsl(62 70% 65%)"
    }
  },
  {
    "id": "pond",
    "title": "荷塘月色",
    "size": 18,
    "seed": 210,
    "maxNest": 2,
    "theme": "pond",
    "playerEmoji": "🐸",
    "goalEmoji": "🪷",
    "colors": {
      "bg": "hsl(63 55% 90%)",
      "ink": "hsl(63 45% 22%)",
      "onAccent": "hsl(63 45% 22%)",
      "wall": "hsl(63 45% 48%)",
      "path": "hsl(63 40% 96%)",
      "accent": "hsl(113 75% 55%)",
      "btn": "hsl(113 70% 68%)"
    }
  },
  {
    "id": "bamboo",
    "title": "熊猫竹林",
    "size": 18,
    "seed": 211,
    "maxNest": 3,
    "theme": "bamboo",
    "playerEmoji": "🐼",
    "goalEmoji": "🎋",
    "colors": {
      "bg": "hsl(104 55% 90%)",
      "ink": "hsl(104 45% 22%)",
      "onAccent": "hsl(104 45% 22%)",
      "wall": "hsl(104 45% 48%)",
      "path": "hsl(104 40% 96%)",
      "accent": "hsl(154 75% 55%)",
      "btn": "hsl(154 70% 68%)"
    }
  },
  {
    "id": "cherry",
    "title": "樱花小径",
    "size": 18,
    "seed": 212,
    "maxNest": 2,
    "theme": "cherry",
    "playerEmoji": "🌸",
    "goalEmoji": "⛩️",
    "colors": {
      "bg": "hsl(145 55% 90%)",
      "ink": "hsl(145 45% 22%)",
      "onAccent": "hsl(145 45% 22%)",
      "wall": "hsl(145 45% 48%)",
      "path": "hsl(145 40% 96%)",
      "accent": "hsl(195 75% 55%)",
      "btn": "hsl(195 70% 68%)"
    }
  },
  {
    "id": "peach",
    "title": "桃子果园",
    "size": 18,
    "seed": 213,
    "maxNest": 2,
    "theme": "peach",
    "playerEmoji": "🍑",
    "goalEmoji": "🧺",
    "colors": {
      "bg": "hsl(186 55% 90%)",
      "ink": "hsl(186 45% 22%)",
      "onAccent": "hsl(186 45% 22%)",
      "wall": "hsl(186 45% 48%)",
      "path": "hsl(186 40% 96%)",
      "accent": "hsl(236 75% 55%)",
      "btn": "hsl(236 70% 68%)"
    }
  },
  {
    "id": "lemon",
    "title": "柠檬汽水",
    "size": 19,
    "seed": 214,
    "maxNest": 3,
    "theme": "lemon",
    "playerEmoji": "🍋",
    "goalEmoji": "🧋",
    "colors": {
      "bg": "hsl(227 55% 90%)",
      "ink": "hsl(227 45% 22%)",
      "onAccent": "hsl(227 45% 22%)",
      "wall": "hsl(227 45% 48%)",
      "path": "hsl(227 40% 96%)",
      "accent": "hsl(277 75% 55%)",
      "btn": "hsl(277 70% 68%)"
    }
  },
  {
    "id": "grape",
    "title": "葡萄庄园",
    "size": 19,
    "seed": 215,
    "maxNest": 2,
    "theme": "grape",
    "playerEmoji": "🍇",
    "goalEmoji": "🧃",
    "colors": {
      "bg": "hsl(268 55% 90%)",
      "ink": "hsl(268 45% 22%)",
      "onAccent": "hsl(268 45% 22%)",
      "wall": "hsl(268 45% 48%)",
      "path": "hsl(268 40% 96%)",
      "accent": "hsl(318 75% 55%)",
      "btn": "hsl(318 70% 68%)"
    }
  },
  {
    "id": "melon",
    "title": "西瓜野餐",
    "size": 19,
    "seed": 216,
    "maxNest": 2,
    "theme": "melon",
    "playerEmoji": "🍉",
    "goalEmoji": "🧺",
    "colors": {
      "bg": "hsl(309 55% 90%)",
      "ink": "hsl(309 45% 22%)",
      "onAccent": "hsl(309 45% 22%)",
      "wall": "hsl(309 45% 48%)",
      "path": "hsl(309 40% 96%)",
      "accent": "hsl(359 75% 55%)",
      "btn": "hsl(359 70% 68%)"
    }
  },
  {
    "id": "berry",
    "title": "草莓甜心",
    "size": 19,
    "seed": 217,
    "maxNest": 3,
    "theme": "berry",
    "playerEmoji": "🍓",
    "goalEmoji": "🍰",
    "colors": {
      "bg": "hsl(350 55% 90%)",
      "ink": "hsl(350 45% 22%)",
      "onAccent": "hsl(350 45% 22%)",
      "wall": "hsl(350 45% 48%)",
      "path": "hsl(350 40% 96%)",
      "accent": "hsl(40 75% 55%)",
      "btn": "hsl(40 70% 68%)"
    }
  },
  {
    "id": "mango",
    "title": "芒果海滩",
    "size": 20,
    "seed": 218,
    "maxNest": 2,
    "theme": "mango",
    "playerEmoji": "🥭",
    "goalEmoji": "🏖️",
    "colors": {
      "bg": "hsl(31 35% 14%)",
      "ink": "hsl(31 20% 92%)",
      "onAccent": "hsl(31 35% 14%)",
      "wall": "hsl(31 40% 42%)",
      "path": "hsl(31 30% 22%)",
      "accent": "hsl(71 75% 58%)",
      "btn": "hsl(71 70% 65%)"
    }
  },
  {
    "id": "koala",
    "title": "考拉树屋",
    "size": 20,
    "seed": 219,
    "maxNest": 2,
    "theme": "koala",
    "playerEmoji": "🐨",
    "goalEmoji": "🌳",
    "colors": {
      "bg": "hsl(72 55% 90%)",
      "ink": "hsl(72 45% 22%)",
      "onAccent": "hsl(72 45% 22%)",
      "wall": "hsl(72 45% 48%)",
      "path": "hsl(72 40% 96%)",
      "accent": "hsl(122 75% 55%)",
      "btn": "hsl(122 70% 68%)"
    }
  },
  {
    "id": "tiger",
    "title": "老虎山洞",
    "size": 20,
    "seed": 220,
    "maxNest": 3,
    "theme": "tiger",
    "playerEmoji": "🐯",
    "goalEmoji": "🕳️",
    "colors": {
      "bg": "hsl(113 55% 90%)",
      "ink": "hsl(113 45% 22%)",
      "onAccent": "hsl(113 45% 22%)",
      "wall": "hsl(113 45% 48%)",
      "path": "hsl(113 40% 96%)",
      "accent": "hsl(163 75% 55%)",
      "btn": "hsl(163 70% 68%)"
    }
  },
  {
    "id": "lion",
    "title": "狮子草原",
    "size": 20,
    "seed": 221,
    "maxNest": 2,
    "theme": "lion",
    "playerEmoji": "🦁",
    "goalEmoji": "🌅",
    "colors": {
      "bg": "hsl(154 55% 90%)",
      "ink": "hsl(154 45% 22%)",
      "onAccent": "hsl(154 45% 22%)",
      "wall": "hsl(154 45% 48%)",
      "path": "hsl(154 40% 96%)",
      "accent": "hsl(204 75% 55%)",
      "btn": "hsl(204 70% 68%)"
    }
  },
  {
    "id": "elephant",
    "title": "大象乐园",
    "size": 21,
    "seed": 222,
    "maxNest": 2,
    "theme": "elephant",
    "playerEmoji": "🐘",
    "goalEmoji": "🥜",
    "colors": {
      "bg": "hsl(195 55% 90%)",
      "ink": "hsl(195 45% 22%)",
      "onAccent": "hsl(195 45% 22%)",
      "wall": "hsl(195 45% 48%)",
      "path": "hsl(195 40% 96%)",
      "accent": "hsl(245 75% 55%)",
      "btn": "hsl(245 70% 68%)"
    }
  },
  {
    "id": "giraffe",
    "title": "长颈鹿高塔",
    "size": 21,
    "seed": 223,
    "maxNest": 3,
    "theme": "giraffe",
    "playerEmoji": "🦒",
    "goalEmoji": "🗼",
    "colors": {
      "bg": "hsl(236 55% 90%)",
      "ink": "hsl(236 45% 22%)",
      "onAccent": "hsl(236 45% 22%)",
      "wall": "hsl(236 45% 48%)",
      "path": "hsl(236 40% 96%)",
      "accent": "hsl(286 75% 55%)",
      "btn": "hsl(286 70% 68%)"
    }
  },
  {
    "id": "monkey",
    "title": "猴子丛林",
    "size": 21,
    "seed": 224,
    "maxNest": 2,
    "theme": "monkey",
    "playerEmoji": "🐵",
    "goalEmoji": "🍌",
    "colors": {
      "bg": "hsl(277 55% 90%)",
      "ink": "hsl(277 45% 22%)",
      "onAccent": "hsl(277 45% 22%)",
      "wall": "hsl(277 45% 48%)",
      "path": "hsl(277 40% 96%)",
      "accent": "hsl(327 75% 55%)",
      "btn": "hsl(327 70% 68%)"
    }
  },
  {
    "id": "owl",
    "title": "猫头鹰夜校",
    "size": 21,
    "seed": 225,
    "maxNest": 2,
    "theme": "owl",
    "playerEmoji": "🦉",
    "goalEmoji": "🕯️",
    "colors": {
      "bg": "hsl(318 55% 90%)",
      "ink": "hsl(318 45% 22%)",
      "onAccent": "hsl(318 45% 22%)",
      "wall": "hsl(318 45% 48%)",
      "path": "hsl(318 40% 96%)",
      "accent": "hsl(8 75% 55%)",
      "btn": "hsl(8 70% 68%)"
    }
  },
  {
    "id": "duck",
    "title": "小鸭池塘",
    "size": 22,
    "seed": 226,
    "maxNest": 3,
    "theme": "duck",
    "playerEmoji": "🦆",
    "goalEmoji": "🪺",
    "colors": {
      "bg": "hsl(359 55% 90%)",
      "ink": "hsl(359 45% 22%)",
      "onAccent": "hsl(359 45% 22%)",
      "wall": "hsl(359 45% 48%)",
      "path": "hsl(359 40% 96%)",
      "accent": "hsl(49 75% 55%)",
      "btn": "hsl(49 70% 68%)"
    }
  },
  {
    "id": "swan",
    "title": "天鹅湖",
    "size": 22,
    "seed": 227,
    "maxNest": 2,
    "theme": "swan",
    "playerEmoji": "🦢",
    "goalEmoji": "👑",
    "colors": {
      "bg": "hsl(40 35% 14%)",
      "ink": "hsl(40 20% 92%)",
      "onAccent": "hsl(40 35% 14%)",
      "wall": "hsl(40 40% 42%)",
      "path": "hsl(40 30% 22%)",
      "accent": "hsl(80 75% 58%)",
      "btn": "hsl(80 70% 65%)"
    }
  },
  {
    "id": "dolphin",
    "title": "海豚海湾",
    "size": 22,
    "seed": 228,
    "maxNest": 2,
    "theme": "dolphin",
    "playerEmoji": "🐬",
    "goalEmoji": "🌊",
    "colors": {
      "bg": "hsl(81 55% 90%)",
      "ink": "hsl(81 45% 22%)",
      "onAccent": "hsl(81 45% 22%)",
      "wall": "hsl(81 45% 48%)",
      "path": "hsl(81 40% 96%)",
      "accent": "hsl(131 75% 55%)",
      "btn": "hsl(131 70% 68%)"
    }
  },
  {
    "id": "whale",
    "title": "鲸鱼歌唱",
    "size": 22,
    "seed": 229,
    "maxNest": 3,
    "theme": "whale",
    "playerEmoji": "🐋",
    "goalEmoji": "🎵",
    "colors": {
      "bg": "hsl(122 55% 90%)",
      "ink": "hsl(122 45% 22%)",
      "onAccent": "hsl(122 45% 22%)",
      "wall": "hsl(122 45% 48%)",
      "path": "hsl(122 40% 96%)",
      "accent": "hsl(172 75% 55%)",
      "btn": "hsl(172 70% 68%)"
    }
  },
  {
    "id": "crab",
    "title": "螃蟹沙滩",
    "size": 23,
    "seed": 230,
    "maxNest": 2,
    "theme": "crab",
    "playerEmoji": "🦀",
    "goalEmoji": "⛱️",
    "colors": {
      "bg": "hsl(163 55% 90%)",
      "ink": "hsl(163 45% 22%)",
      "onAccent": "hsl(163 45% 22%)",
      "wall": "hsl(163 45% 48%)",
      "path": "hsl(163 40% 96%)",
      "accent": "hsl(213 75% 55%)",
      "btn": "hsl(213 70% 68%)"
    }
  },
  {
    "id": "starfish",
    "title": "海星礁石",
    "size": 23,
    "seed": 231,
    "maxNest": 2,
    "theme": "starfish",
    "playerEmoji": "🌟",
    "goalEmoji": "🪸",
    "colors": {
      "bg": "hsl(204 55% 90%)",
      "ink": "hsl(204 45% 22%)",
      "onAccent": "hsl(204 45% 22%)",
      "wall": "hsl(204 45% 48%)",
      "path": "hsl(204 40% 96%)",
      "accent": "hsl(254 75% 55%)",
      "btn": "hsl(254 70% 68%)"
    }
  },
  {
    "id": "jellyfish",
    "title": "水母灯光",
    "size": 23,
    "seed": 232,
    "maxNest": 3,
    "theme": "jellyfish",
    "playerEmoji": "🪼",
    "goalEmoji": "💡",
    "colors": {
      "bg": "hsl(245 55% 90%)",
      "ink": "hsl(245 45% 22%)",
      "onAccent": "hsl(245 45% 22%)",
      "wall": "hsl(245 45% 48%)",
      "path": "hsl(245 40% 96%)",
      "accent": "hsl(295 75% 55%)",
      "btn": "hsl(295 70% 68%)"
    }
  },
  {
    "id": "coral",
    "title": "珊瑚宫殿",
    "size": 23,
    "seed": 233,
    "maxNest": 2,
    "theme": "coral",
    "playerEmoji": "🪸",
    "goalEmoji": "👑",
    "colors": {
      "bg": "hsl(286 55% 90%)",
      "ink": "hsl(286 45% 22%)",
      "onAccent": "hsl(286 45% 22%)",
      "wall": "hsl(286 45% 48%)",
      "path": "hsl(286 40% 96%)",
      "accent": "hsl(336 75% 55%)",
      "btn": "hsl(336 70% 68%)"
    }
  },
  {
    "id": "lighthouse",
    "title": "灯塔守望",
    "size": 24,
    "seed": 234,
    "maxNest": 2,
    "theme": "lighthouse",
    "playerEmoji": "🏮",
    "goalEmoji": "🔦",
    "colors": {
      "bg": "hsl(327 55% 90%)",
      "ink": "hsl(327 45% 22%)",
      "onAccent": "hsl(327 45% 22%)",
      "wall": "hsl(327 45% 48%)",
      "path": "hsl(327 40% 96%)",
      "accent": "hsl(17 75% 55%)",
      "btn": "hsl(17 70% 68%)"
    }
  },
  {
    "id": "submarine",
    "title": "潜水艇探险",
    "size": 24,
    "seed": 235,
    "maxNest": 3,
    "theme": "submarine",
    "playerEmoji": "🚤",
    "goalEmoji": "⚓",
    "colors": {
      "bg": "hsl(8 55% 90%)",
      "ink": "hsl(8 45% 22%)",
      "onAccent": "hsl(8 45% 22%)",
      "wall": "hsl(8 45% 48%)",
      "path": "hsl(8 40% 96%)",
      "accent": "hsl(58 75% 55%)",
      "btn": "hsl(58 70% 68%)"
    }
  },
  {
    "id": "airplane",
    "title": "小飞机旅行",
    "size": 24,
    "seed": 236,
    "maxNest": 2,
    "theme": "airplane",
    "playerEmoji": "✈️",
    "goalEmoji": "🧳",
    "colors": {
      "bg": "hsl(49 35% 14%)",
      "ink": "hsl(49 20% 92%)",
      "onAccent": "hsl(49 35% 14%)",
      "wall": "hsl(49 40% 42%)",
      "path": "hsl(49 30% 22%)",
      "accent": "hsl(89 75% 58%)",
      "btn": "hsl(89 70% 65%)"
    }
  },
  {
    "id": "helicopter",
    "title": "直升机救援",
    "size": 24,
    "seed": 237,
    "maxNest": 2,
    "theme": "helicopter",
    "playerEmoji": "🚁",
    "goalEmoji": "🆘",
    "colors": {
      "bg": "hsl(90 55% 90%)",
      "ink": "hsl(90 45% 22%)",
      "onAccent": "hsl(90 45% 22%)",
      "wall": "hsl(90 45% 48%)",
      "path": "hsl(90 40% 96%)",
      "accent": "hsl(140 75% 55%)",
      "btn": "hsl(140 70% 68%)"
    }
  },
  {
    "id": "balloon",
    "title": "热气球旅行",
    "size": 25,
    "seed": 238,
    "maxNest": 3,
    "theme": "balloon",
    "playerEmoji": "🎈",
    "goalEmoji": "🏔️",
    "colors": {
      "bg": "hsl(131 55% 90%)",
      "ink": "hsl(131 45% 22%)",
      "onAccent": "hsl(131 45% 22%)",
      "wall": "hsl(131 45% 48%)",
      "path": "hsl(131 40% 96%)",
      "accent": "hsl(181 75% 55%)",
      "btn": "hsl(181 70% 68%)"
    }
  },
  {
    "id": "bicycle",
    "title": "自行车郊游",
    "size": 25,
    "seed": 239,
    "maxNest": 2,
    "theme": "bicycle",
    "playerEmoji": "🚲",
    "goalEmoji": "🚩",
    "colors": {
      "bg": "hsl(172 55% 90%)",
      "ink": "hsl(172 45% 22%)",
      "onAccent": "hsl(172 45% 22%)",
      "wall": "hsl(172 45% 48%)",
      "path": "hsl(172 40% 96%)",
      "accent": "hsl(222 75% 55%)",
      "btn": "hsl(222 70% 68%)"
    }
  },
  {
    "id": "scooter",
    "title": "滑板车公园",
    "size": 25,
    "seed": 240,
    "maxNest": 2,
    "theme": "scooter",
    "playerEmoji": "🛴",
    "goalEmoji": "🛹",
    "colors": {
      "bg": "hsl(213 55% 90%)",
      "ink": "hsl(213 45% 22%)",
      "onAccent": "hsl(213 45% 22%)",
      "wall": "hsl(213 45% 48%)",
      "path": "hsl(213 40% 96%)",
      "accent": "hsl(263 75% 55%)",
      "btn": "hsl(263 70% 68%)"
    }
  },
  {
    "id": "piano",
    "title": "钢琴小屋",
    "size": 25,
    "seed": 241,
    "maxNest": 3,
    "theme": "piano",
    "playerEmoji": "🎹",
    "goalEmoji": "🎼",
    "colors": {
      "bg": "hsl(254 55% 90%)",
      "ink": "hsl(254 45% 22%)",
      "onAccent": "hsl(254 45% 22%)",
      "wall": "hsl(254 45% 48%)",
      "path": "hsl(254 40% 96%)",
      "accent": "hsl(304 75% 55%)",
      "btn": "hsl(304 70% 68%)"
    }
  },
  {
    "id": "drum",
    "title": "鼓点广场",
    "size": 26,
    "seed": 242,
    "maxNest": 2,
    "theme": "drum",
    "playerEmoji": "🥁",
    "goalEmoji": "🎉",
    "colors": {
      "bg": "hsl(295 55% 90%)",
      "ink": "hsl(295 45% 22%)",
      "onAccent": "hsl(295 45% 22%)",
      "wall": "hsl(295 45% 48%)",
      "path": "hsl(295 40% 96%)",
      "accent": "hsl(345 75% 55%)",
      "btn": "hsl(345 70% 68%)"
    }
  },
  {
    "id": "violin",
    "title": "小提琴森林",
    "size": 26,
    "seed": 243,
    "maxNest": 2,
    "theme": "violin",
    "playerEmoji": "🎻",
    "goalEmoji": "🌲",
    "colors": {
      "bg": "hsl(336 55% 90%)",
      "ink": "hsl(336 45% 22%)",
      "onAccent": "hsl(336 45% 22%)",
      "wall": "hsl(336 45% 48%)",
      "path": "hsl(336 40% 96%)",
      "accent": "hsl(26 75% 55%)",
      "btn": "hsl(26 70% 68%)"
    }
  },
  {
    "id": "trumpet",
    "title": "喇叭乐园",
    "size": 26,
    "seed": 244,
    "maxNest": 3,
    "theme": "trumpet",
    "playerEmoji": "🎺",
    "goalEmoji": "🎊",
    "colors": {
      "bg": "hsl(17 55% 90%)",
      "ink": "hsl(17 45% 22%)",
      "onAccent": "hsl(17 45% 22%)",
      "wall": "hsl(17 45% 48%)",
      "path": "hsl(17 40% 96%)",
      "accent": "hsl(67 75% 55%)",
      "btn": "hsl(67 70% 68%)"
    }
  },
  {
    "id": "paint",
    "title": "小小画家",
    "size": 26,
    "seed": 245,
    "maxNest": 2,
    "theme": "paint",
    "playerEmoji": "🎨",
    "goalEmoji": "🖼️",
    "colors": {
      "bg": "hsl(58 35% 14%)",
      "ink": "hsl(58 20% 92%)",
      "onAccent": "hsl(58 35% 14%)",
      "wall": "hsl(58 40% 42%)",
      "path": "hsl(58 30% 22%)",
      "accent": "hsl(98 75% 58%)",
      "btn": "hsl(98 70% 65%)"
    }
  },
  {
    "id": "crayon",
    "title": "蜡笔小镇",
    "size": 27,
    "seed": 246,
    "maxNest": 2,
    "theme": "crayon",
    "playerEmoji": "✏️",
    "goalEmoji": "📒",
    "colors": {
      "bg": "hsl(99 55% 90%)",
      "ink": "hsl(99 45% 22%)",
      "onAccent": "hsl(99 45% 22%)",
      "wall": "hsl(99 45% 48%)",
      "path": "hsl(99 40% 96%)",
      "accent": "hsl(149 75% 55%)",
      "btn": "hsl(149 70% 68%)"
    }
  },
  {
    "id": "puzzle",
    "title": "拼图迷宫",
    "size": 27,
    "seed": 247,
    "maxNest": 3,
    "theme": "puzzle",
    "playerEmoji": "🧩",
    "goalEmoji": "✨",
    "colors": {
      "bg": "hsl(140 55% 90%)",
      "ink": "hsl(140 45% 22%)",
      "onAccent": "hsl(140 45% 22%)",
      "wall": "hsl(140 45% 48%)",
      "path": "hsl(140 40% 96%)",
      "accent": "hsl(190 75% 55%)",
      "btn": "hsl(190 70% 68%)"
    }
  },
  {
    "id": "blocks",
    "title": "积木城堡",
    "size": 27,
    "seed": 248,
    "maxNest": 2,
    "theme": "blocks",
    "playerEmoji": "🧱",
    "goalEmoji": "🏗️",
    "colors": {
      "bg": "hsl(181 55% 90%)",
      "ink": "hsl(181 45% 22%)",
      "onAccent": "hsl(181 45% 22%)",
      "wall": "hsl(181 45% 48%)",
      "path": "hsl(181 40% 96%)",
      "accent": "hsl(231 75% 55%)",
      "btn": "hsl(231 70% 68%)"
    }
  },
  {
    "id": "teddy",
    "title": "泰迪熊商店",
    "size": 27,
    "seed": 249,
    "maxNest": 2,
    "theme": "teddy",
    "playerEmoji": "🧸",
    "goalEmoji": "🎁",
    "colors": {
      "bg": "hsl(222 55% 90%)",
      "ink": "hsl(222 45% 22%)",
      "onAccent": "hsl(222 45% 22%)",
      "wall": "hsl(222 45% 48%)",
      "path": "hsl(222 40% 96%)",
      "accent": "hsl(272 75% 55%)",
      "btn": "hsl(272 70% 68%)"
    }
  },
  {
    "id": "dollhouse",
    "title": "娃娃屋",
    "size": 28,
    "seed": 250,
    "maxNest": 3,
    "theme": "dollhouse",
    "playerEmoji": "🏡",
    "goalEmoji": "🚪",
    "colors": {
      "bg": "hsl(263 55% 90%)",
      "ink": "hsl(263 45% 22%)",
      "onAccent": "hsl(263 45% 22%)",
      "wall": "hsl(263 45% 48%)",
      "path": "hsl(263 40% 96%)",
      "accent": "hsl(313 75% 55%)",
      "btn": "hsl(313 70% 68%)"
    }
  },
  {
    "id": "sandbox",
    "title": "沙坑乐园",
    "size": 28,
    "seed": 251,
    "maxNest": 3,
    "theme": "sandbox",
    "playerEmoji": "🪣",
    "goalEmoji": "🏖️",
    "colors": {
      "bg": "hsl(304 55% 90%)",
      "ink": "hsl(304 45% 22%)",
      "onAccent": "hsl(304 45% 22%)",
      "wall": "hsl(304 45% 48%)",
      "path": "hsl(304 40% 96%)",
      "accent": "hsl(354 75% 55%)",
      "btn": "hsl(354 70% 68%)"
    }
  },
  {
    "id": "playground",
    "title": "游乐场",
    "size": 28,
    "seed": 252,
    "maxNest": 3,
    "theme": "playground",
    "playerEmoji": "🛝",
    "goalEmoji": "🎠",
    "colors": {
      "bg": "hsl(345 55% 90%)",
      "ink": "hsl(345 45% 22%)",
      "onAccent": "hsl(345 45% 22%)",
      "wall": "hsl(345 45% 48%)",
      "path": "hsl(345 40% 96%)",
      "accent": "hsl(35 75% 55%)",
      "btn": "hsl(35 70% 68%)"
    }
  },
  {
    "id": "carousel",
    "title": "旋转木马",
    "size": 28,
    "seed": 253,
    "maxNest": 3,
    "theme": "carousel",
    "playerEmoji": "🎠",
    "goalEmoji": "🎟️",
    "colors": {
      "bg": "hsl(26 55% 90%)",
      "ink": "hsl(26 45% 22%)",
      "onAccent": "hsl(26 45% 22%)",
      "wall": "hsl(26 45% 48%)",
      "path": "hsl(26 40% 96%)",
      "accent": "hsl(76 75% 55%)",
      "btn": "hsl(76 70% 68%)"
    }
  },
  {
    "id": "ferris",
    "title": "摩天轮之夜",
    "size": 29,
    "seed": 254,
    "maxNest": 3,
    "theme": "ferris",
    "playerEmoji": "🎡",
    "goalEmoji": "🌃",
    "colors": {
      "bg": "hsl(67 35% 14%)",
      "ink": "hsl(67 20% 92%)",
      "onAccent": "hsl(67 35% 14%)",
      "wall": "hsl(67 40% 42%)",
      "path": "hsl(67 30% 22%)",
      "accent": "hsl(107 75% 58%)",
      "btn": "hsl(107 70% 65%)"
    }
  },
  {
    "id": "coaster",
    "title": "过山车冒险",
    "size": 29,
    "seed": 255,
    "maxNest": 3,
    "theme": "coaster",
    "playerEmoji": "🎢",
    "goalEmoji": "😆",
    "colors": {
      "bg": "hsl(108 55% 90%)",
      "ink": "hsl(108 45% 22%)",
      "onAccent": "hsl(108 45% 22%)",
      "wall": "hsl(108 45% 48%)",
      "path": "hsl(108 40% 96%)",
      "accent": "hsl(158 75% 55%)",
      "btn": "hsl(158 70% 68%)"
    }
  },
  {
    "id": "magic",
    "title": "魔术帽",
    "size": 29,
    "seed": 256,
    "maxNest": 3,
    "theme": "magic",
    "playerEmoji": "🎩",
    "goalEmoji": "🐇",
    "colors": {
      "bg": "hsl(149 55% 90%)",
      "ink": "hsl(149 45% 22%)",
      "onAccent": "hsl(149 45% 22%)",
      "wall": "hsl(149 45% 48%)",
      "path": "hsl(149 40% 96%)",
      "accent": "hsl(199 75% 55%)",
      "btn": "hsl(199 70% 68%)"
    }
  },
  {
    "id": "wizard",
    "title": "小巫师学院",
    "size": 29,
    "seed": 257,
    "maxNest": 3,
    "theme": "wizard",
    "playerEmoji": "🧙",
    "goalEmoji": "🔮",
    "colors": {
      "bg": "hsl(190 55% 90%)",
      "ink": "hsl(190 45% 22%)",
      "onAccent": "hsl(190 45% 22%)",
      "wall": "hsl(190 45% 48%)",
      "path": "hsl(190 40% 96%)",
      "accent": "hsl(240 75% 55%)",
      "btn": "hsl(240 70% 68%)"
    }
  },
  {
    "id": "fairy",
    "title": "仙女花园",
    "size": 30,
    "seed": 258,
    "maxNest": 3,
    "theme": "fairy",
    "playerEmoji": "🧚",
    "goalEmoji": "🌷",
    "colors": {
      "bg": "hsl(231 55% 90%)",
      "ink": "hsl(231 45% 22%)",
      "onAccent": "hsl(231 45% 22%)",
      "wall": "hsl(231 45% 48%)",
      "path": "hsl(231 40% 96%)",
      "accent": "hsl(281 75% 55%)",
      "btn": "hsl(281 70% 68%)"
    }
  },
  {
    "id": "elf",
    "title": "精灵树洞",
    "size": 30,
    "seed": 259,
    "maxNest": 3,
    "theme": "elf",
    "playerEmoji": "🧝",
    "goalEmoji": "🪵",
    "colors": {
      "bg": "hsl(272 55% 90%)",
      "ink": "hsl(272 45% 22%)",
      "onAccent": "hsl(272 45% 22%)",
      "wall": "hsl(272 45% 48%)",
      "path": "hsl(272 40% 96%)",
      "accent": "hsl(322 75% 55%)",
      "btn": "hsl(322 70% 68%)"
    }
  },
  {
    "id": "mushroom",
    "title": "蘑菇村",
    "size": 30,
    "seed": 260,
    "maxNest": 3,
    "theme": "mushroom",
    "playerEmoji": "🍄",
    "goalEmoji": "🏘️",
    "colors": {
      "bg": "hsl(313 55% 90%)",
      "ink": "hsl(313 45% 22%)",
      "onAccent": "hsl(313 45% 22%)",
      "wall": "hsl(313 45% 48%)",
      "path": "hsl(313 40% 96%)",
      "accent": "hsl(3 75% 55%)",
      "btn": "hsl(3 70% 68%)"
    }
  },
  {
    "id": "acorn",
    "title": "橡果森林",
    "size": 30,
    "seed": 261,
    "maxNest": 3,
    "theme": "acorn",
    "playerEmoji": "🌰",
    "goalEmoji": "🐿️",
    "colors": {
      "bg": "hsl(354 55% 90%)",
      "ink": "hsl(354 45% 22%)",
      "onAccent": "hsl(354 45% 22%)",
      "wall": "hsl(354 45% 48%)",
      "path": "hsl(354 40% 96%)",
      "accent": "hsl(44 75% 55%)",
      "btn": "hsl(44 70% 68%)"
    }
  },
  {
    "id": "campfire",
    "title": "篝火营地",
    "size": 31,
    "seed": 262,
    "maxNest": 3,
    "theme": "campfire",
    "playerEmoji": "🏕️",
    "goalEmoji": "🔥",
    "colors": {
      "bg": "hsl(35 55% 90%)",
      "ink": "hsl(35 45% 22%)",
      "onAccent": "hsl(35 45% 22%)",
      "wall": "hsl(35 45% 48%)",
      "path": "hsl(35 40% 96%)",
      "accent": "hsl(85 75% 55%)",
      "btn": "hsl(85 70% 68%)"
    }
  },
  {
    "id": "tent",
    "title": "帐篷过夜",
    "size": 31,
    "seed": 263,
    "maxNest": 3,
    "theme": "tent",
    "playerEmoji": "⛺",
    "goalEmoji": "🌟",
    "colors": {
      "bg": "hsl(76 35% 14%)",
      "ink": "hsl(76 20% 92%)",
      "onAccent": "hsl(76 35% 14%)",
      "wall": "hsl(76 40% 42%)",
      "path": "hsl(76 30% 22%)",
      "accent": "hsl(116 75% 58%)",
      "btn": "hsl(116 70% 65%)"
    }
  },
  {
    "id": "mountain",
    "title": "登山小路",
    "size": 31,
    "seed": 264,
    "maxNest": 3,
    "theme": "mountain",
    "playerEmoji": "⛰️",
    "goalEmoji": "🚩",
    "colors": {
      "bg": "hsl(117 55% 90%)",
      "ink": "hsl(117 45% 22%)",
      "onAccent": "hsl(117 45% 22%)",
      "wall": "hsl(117 45% 48%)",
      "path": "hsl(117 40% 96%)",
      "accent": "hsl(167 75% 55%)",
      "btn": "hsl(167 70% 68%)"
    }
  },
  {
    "id": "river",
    "title": "小河漂流",
    "size": 31,
    "seed": 265,
    "maxNest": 3,
    "theme": "river",
    "playerEmoji": "🛶",
    "goalEmoji": "🏞️",
    "colors": {
      "bg": "hsl(158 55% 90%)",
      "ink": "hsl(158 45% 22%)",
      "onAccent": "hsl(158 45% 22%)",
      "wall": "hsl(158 45% 48%)",
      "path": "hsl(158 40% 96%)",
      "accent": "hsl(208 75% 55%)",
      "btn": "hsl(208 70% 68%)"
    }
  },
  {
    "id": "waterfall",
    "title": "瀑布秘境",
    "size": 32,
    "seed": 266,
    "maxNest": 3,
    "theme": "waterfall",
    "playerEmoji": "💦",
    "goalEmoji": "🌈",
    "colors": {
      "bg": "hsl(199 55% 90%)",
      "ink": "hsl(199 45% 22%)",
      "onAccent": "hsl(199 45% 22%)",
      "wall": "hsl(199 45% 48%)",
      "path": "hsl(199 40% 96%)",
      "accent": "hsl(249 75% 55%)",
      "btn": "hsl(249 70% 68%)"
    }
  },
  {
    "id": "glacier",
    "title": "冰川奇遇",
    "size": 32,
    "seed": 267,
    "maxNest": 3,
    "theme": "glacier",
    "playerEmoji": "🧊",
    "goalEmoji": "❄️",
    "colors": {
      "bg": "hsl(240 55% 90%)",
      "ink": "hsl(240 45% 22%)",
      "onAccent": "hsl(240 45% 22%)",
      "wall": "hsl(240 45% 48%)",
      "path": "hsl(240 40% 96%)",
      "accent": "hsl(290 75% 55%)",
      "btn": "hsl(290 70% 68%)"
    }
  },
  {
    "id": "aurora",
    "title": "极光夜空",
    "size": 32,
    "seed": 268,
    "maxNest": 3,
    "theme": "aurora",
    "playerEmoji": "🌌",
    "goalEmoji": "✨",
    "colors": {
      "bg": "hsl(281 55% 90%)",
      "ink": "hsl(281 45% 22%)",
      "onAccent": "hsl(281 45% 22%)",
      "wall": "hsl(281 45% 48%)",
      "path": "hsl(281 40% 96%)",
      "accent": "hsl(331 75% 55%)",
      "btn": "hsl(331 70% 68%)"
    }
  },
  {
    "id": "comet",
    "title": "彗星轨道",
    "size": 32,
    "seed": 269,
    "maxNest": 3,
    "theme": "comet",
    "playerEmoji": "☄️",
    "goalEmoji": "🛸",
    "colors": {
      "bg": "hsl(322 55% 90%)",
      "ink": "hsl(322 45% 22%)",
      "onAccent": "hsl(322 45% 22%)",
      "wall": "hsl(322 45% 48%)",
      "path": "hsl(322 40% 96%)",
      "accent": "hsl(12 75% 55%)",
      "btn": "hsl(12 70% 68%)"
    }
  },
  {
    "id": "satellite",
    "title": "卫星站",
    "size": 33,
    "seed": 270,
    "maxNest": 3,
    "theme": "satellite",
    "playerEmoji": "🛰️",
    "goalEmoji": "📡",
    "colors": {
      "bg": "hsl(3 55% 90%)",
      "ink": "hsl(3 45% 22%)",
      "onAccent": "hsl(3 45% 22%)",
      "wall": "hsl(3 45% 48%)",
      "path": "hsl(3 40% 96%)",
      "accent": "hsl(53 75% 55%)",
      "btn": "hsl(53 70% 68%)"
    }
  },
  {
    "id": "alien",
    "title": "友好外星人",
    "size": 33,
    "seed": 271,
    "maxNest": 3,
    "theme": "alien",
    "playerEmoji": "👽",
    "goalEmoji": "👾",
    "colors": {
      "bg": "hsl(44 55% 90%)",
      "ink": "hsl(44 45% 22%)",
      "onAccent": "hsl(44 45% 22%)",
      "wall": "hsl(44 45% 48%)",
      "path": "hsl(44 40% 96%)",
      "accent": "hsl(94 75% 55%)",
      "btn": "hsl(94 70% 68%)"
    }
  },
  {
    "id": "cat",
    "title": "小猫咖啡馆",
    "size": 33,
    "seed": 272,
    "maxNest": 3,
    "theme": "cat",
    "playerEmoji": "🐱",
    "goalEmoji": "☕",
    "colors": {
      "bg": "hsl(85 35% 14%)",
      "ink": "hsl(85 20% 92%)",
      "onAccent": "hsl(85 35% 14%)",
      "wall": "hsl(85 40% 42%)",
      "path": "hsl(85 30% 22%)",
      "accent": "hsl(125 75% 58%)",
      "btn": "hsl(125 70% 65%)"
    }
  },
  {
    "id": "puppy",
    "title": "小狗乐园",
    "size": 33,
    "seed": 273,
    "maxNest": 3,
    "theme": "puppy",
    "playerEmoji": "🐶",
    "goalEmoji": "🦴",
    "colors": {
      "bg": "hsl(126 55% 90%)",
      "ink": "hsl(126 45% 22%)",
      "onAccent": "hsl(126 45% 22%)",
      "wall": "hsl(126 45% 48%)",
      "path": "hsl(126 40% 96%)",
      "accent": "hsl(176 75% 55%)",
      "btn": "hsl(176 70% 68%)"
    }
  },
  {
    "id": "hamster",
    "title": "仓鼠滚轮",
    "size": 34,
    "seed": 274,
    "maxNest": 3,
    "theme": "hamster",
    "playerEmoji": "🐹",
    "goalEmoji": "🛞",
    "colors": {
      "bg": "hsl(167 55% 90%)",
      "ink": "hsl(167 45% 22%)",
      "onAccent": "hsl(167 45% 22%)",
      "wall": "hsl(167 45% 48%)",
      "path": "hsl(167 40% 96%)",
      "accent": "hsl(217 75% 55%)",
      "btn": "hsl(217 70% 68%)"
    }
  },
  {
    "id": "chick",
    "title": "小鸡农场",
    "size": 34,
    "seed": 275,
    "maxNest": 3,
    "theme": "chick",
    "playerEmoji": "🐥",
    "goalEmoji": "🌽",
    "colors": {
      "bg": "hsl(208 55% 90%)",
      "ink": "hsl(208 45% 22%)",
      "onAccent": "hsl(208 45% 22%)",
      "wall": "hsl(208 45% 48%)",
      "path": "hsl(208 40% 96%)",
      "accent": "hsl(258 75% 55%)",
      "btn": "hsl(258 70% 68%)"
    }
  },
  {
    "id": "peacock",
    "title": "孔雀开屏",
    "size": 34,
    "seed": 276,
    "maxNest": 3,
    "theme": "peacock",
    "playerEmoji": "🦚",
    "goalEmoji": "💎",
    "colors": {
      "bg": "hsl(249 55% 90%)",
      "ink": "hsl(249 45% 22%)",
      "onAccent": "hsl(249 45% 22%)",
      "wall": "hsl(249 45% 48%)",
      "path": "hsl(249 40% 96%)",
      "accent": "hsl(299 75% 55%)",
      "btn": "hsl(299 70% 68%)"
    }
  },
  {
    "id": "parrot",
    "title": "鹦鹉学堂",
    "size": 34,
    "seed": 277,
    "maxNest": 3,
    "theme": "parrot",
    "playerEmoji": "🦜",
    "goalEmoji": "🗣️",
    "colors": {
      "bg": "hsl(290 55% 90%)",
      "ink": "hsl(290 45% 22%)",
      "onAccent": "hsl(290 45% 22%)",
      "wall": "hsl(290 45% 48%)",
      "path": "hsl(290 40% 96%)",
      "accent": "hsl(340 75% 55%)",
      "btn": "hsl(340 70% 68%)"
    }
  },
  {
    "id": "flamingo",
    "title": "火烈鸟湖",
    "size": 35,
    "seed": 278,
    "maxNest": 3,
    "theme": "flamingo",
    "playerEmoji": "🦩",
    "goalEmoji": "💗",
    "colors": {
      "bg": "hsl(331 55% 90%)",
      "ink": "hsl(331 45% 22%)",
      "onAccent": "hsl(331 45% 22%)",
      "wall": "hsl(331 45% 48%)",
      "path": "hsl(331 40% 96%)",
      "accent": "hsl(21 75% 55%)",
      "btn": "hsl(21 70% 68%)"
    }
  },
  {
    "id": "hedgehog",
    "title": "刺猬落叶",
    "size": 35,
    "seed": 279,
    "maxNest": 3,
    "theme": "hedgehog",
    "playerEmoji": "🦔",
    "goalEmoji": "🍂",
    "colors": {
      "bg": "hsl(12 55% 90%)",
      "ink": "hsl(12 45% 22%)",
      "onAccent": "hsl(12 45% 22%)",
      "wall": "hsl(12 45% 48%)",
      "path": "hsl(12 40% 96%)",
      "accent": "hsl(62 75% 55%)",
      "btn": "hsl(62 70% 68%)"
    }
  },
  {
    "id": "squirrel",
    "title": "松鼠储粮",
    "size": 38,
    "seed": 280,
    "maxNest": 3,
    "theme": "squirrel",
    "playerEmoji": "🐿️",
    "goalEmoji": "🌰",
    "colors": {
      "bg": "hsl(53 55% 90%)",
      "ink": "hsl(53 45% 22%)",
      "onAccent": "hsl(53 45% 22%)",
      "wall": "hsl(53 45% 48%)",
      "path": "hsl(53 40% 96%)",
      "accent": "hsl(103 75% 55%)",
      "btn": "hsl(103 70% 68%)"
    }
  },
  {
    "id": "otter",
    "title": "水獭河边",
    "size": 40,
    "seed": 281,
    "maxNest": 3,
    "theme": "otter",
    "playerEmoji": "🦦",
    "goalEmoji": "🪨",
    "colors": {
      "bg": "hsl(94 35% 14%)",
      "ink": "hsl(94 20% 92%)",
      "onAccent": "hsl(94 35% 14%)",
      "wall": "hsl(94 40% 42%)",
      "path": "hsl(94 30% 22%)",
      "accent": "hsl(134 75% 58%)",
      "btn": "hsl(134 70% 65%)"
    }
  },
  {
    "id": "seal",
    "title": "海豹冰面",
    "size": 42,
    "seed": 282,
    "maxNest": 3,
    "theme": "seal",
    "playerEmoji": "🦭",
    "goalEmoji": "🧊",
    "colors": {
      "bg": "hsl(135 55% 90%)",
      "ink": "hsl(135 45% 22%)",
      "onAccent": "hsl(135 45% 22%)",
      "wall": "hsl(135 45% 48%)",
      "path": "hsl(135 40% 96%)",
      "accent": "hsl(185 75% 55%)",
      "btn": "hsl(185 70% 68%)"
    }
  },
  {
    "id": "cloud",
    "title": "云朵软床",
    "size": 45,
    "seed": 283,
    "maxNest": 3,
    "theme": "cloud",
    "playerEmoji": "☁️",
    "goalEmoji": "😴",
    "colors": {
      "bg": "hsl(176 55% 90%)",
      "ink": "hsl(176 45% 22%)",
      "onAccent": "hsl(176 45% 22%)",
      "wall": "hsl(176 45% 48%)",
      "path": "hsl(176 40% 96%)",
      "accent": "hsl(226 75% 55%)",
      "btn": "hsl(226 70% 68%)"
    }
  }
];
  root.LEVEL_CATALOG = LEVEL_CATALOG;
  if (typeof module !== 'undefined' && module.exports) module.exports = LEVEL_CATALOG;
})(typeof globalThis !== 'undefined' ? globalThis : this);
