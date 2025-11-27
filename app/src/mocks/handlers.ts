import { http, HttpResponse } from "msw";
import type {
  ChatMessage,
  InterviewQuestion,
  NarrativeMaterial,
  Question,
  ReadingPassage,
  ReportData,
} from "../types";

const phq9Options = ["0 完全不会", "1 好几天", "2 超过一周", "3 几乎每天"];

const questions: Question[] = [
  {
    id: "q1",
    title: "做事时提不起劲或没有兴趣。",
    options: phq9Options,
    type: "single",
  },
  {
    id: "q2",
    title: "感到心情低落，沮丧或绝望。",
    options: phq9Options,
    type: "single",
  },
  {
    id: "q3",
    title: "入睡困难、睡不安或睡得过多。",
    options: phq9Options,
    type: "single",
  },
  {
    id: "q4",
    title: "感觉疲倦或没有活力。",
    options: phq9Options,
    type: "single",
  },
  {
    id: "q5",
    title: "食欲不振或吃太多。",
    options: phq9Options,
    type: "single",
  },
  {
    id: "q6",
    title: "觉得自己很糟或觉得自己很失败，或让自己、让家人失望。",
    options: phq9Options,
    type: "single",
  },
  {
    id: "q7",
    title: "对事物专注有困难，例如看报纸或看电视时。",
    options: phq9Options,
    type: "single",
  },
  {
    id: "q8",
    title:
      "行动或说话速度缓慢到别人已经察觉。或刚好相反——变得比平日更烦躁或坐立不安，动来动去。",
    options: phq9Options,
    type: "single",
  },
  {
    id: "q9",
    title: "有不如死掉或用某种方式伤害自己的念头。",
    options: phq9Options,
    type: "single",
  },
];

const materials: NarrativeMaterial[] = [
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `n${101 + i}`,
    imageUrl: `/picture/${101 + i}.png`,
    instruction: "观察图片 10-15 秒后，用 1-3 句话描述你看到的内容和感受。",
    category: "negative" as const,
  })),
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `m${201 + i}`,
    imageUrl: `/picture/${201 + i}.png`,
    instruction: "观察图片 10-15 秒后，用 1-3 句话描述你看到的内容和感受。",
    category: "neutral" as const,
  })),
  ...Array.from({ length: 10 }).map((_, i) => ({
    id: `p${301 + i}`,
    imageUrl: `/picture/${301 + i}.png`,
    instruction: "观察图片 10-15 秒后，用 1-3 句话描述你看到的内容和感受。",
    category: "positive" as const,
  })),
];

const readingPool: ReadingPassage[] = [
  {
    id: 1,
    title: "画画组（合并上下段）",
    content:
      "那一年我大概上小学四年级，我画了一幅画，画的是我们家的样子。\n我把画拿给妈妈看，她戴上眼镜，仔细端详起来，眼睛都放光了，乐呵呵地说：“哎呦，这画儿真不赖！咱家闺女将来准能当个大画家！” 她一把搂住我，不停地夸。我脸上有点发烧，心里却美滋滋的，点点头，告诉妈妈这幅画确实是我画的。妈妈高兴地又亲了我一口。\n一下午，我都美颠颠的，盼着爸爸早点下班回家。我用胶带把画贴在客厅的墙上，还用彩色的卡纸剪了些小花装饰了一下。傍晚时分，我一直竖着耳朵听门外的脚步声，想象着爸爸下班回家看到画时惊讶的样子，心里像吃了蜜一样甜。\n\n“来，让爸爸看看。”爸爸放下公文包，拿起我画的画，凑到眼前看了看。\n我害羞地低下了头，期待着爸爸的夸奖。“这画．．．不咋地嘛。”爸爸把画放回了原处，语气敷衍。\n我的眼泪开始在眼眶里打转，心里像被什么东西堵住了。\n“哎，你这人，怎么说话呢。”妈妈有些不乐意了。\n爸爸似乎不想跟妈妈争，“我只是说，画画这事儿，得实事求是，画得好就多夸夸，画得一般就…”\n我再也无法控制自己的情绪，扑到床上，深深地把头埋在枕头里。客厅里，爸爸妈妈还在继续争论着关于那幅画的事情，此后，我想我再也不愿拿起那支画笔。",
  },
  {
    id: 2,
    title: "诗歌组（合并上下段）",
    content:
      "记得七八岁的时候，我写了第一首诗。母亲一念完那首诗，眼睛亮亮，兴奋地嚷着：“巴迪，这是你写的吗？多美的诗啊！精彩极了！”她搂着我，不住地赞扬。我既腼腆又得意洋洋，点头告诉她诗确实是我写的。她高兴得再次拥抱了我。\n整个下午我都怀着一种自豪感等待父亲回来。我用漂亮的花体字把诗认认真真抄写了一遍，还用彩色笔在它的周围上画了一圈花边。将近七点钟的时候，我悄悄走进饭厅，满怀信心地把它平平整整地放在餐桌父亲的位置上。\n\n“我自己会判断的。”父亲开始读诗。\n我把头埋得低低的。诗只有十行，可我觉得他读了很长的时间。\n“我看这首诗糟糕透了。”父亲把诗放回原处。\n我的眼睛湿润了，头也沉重得抬不起来。\n“亲爱的，我真不懂你这是什么意思！”母亲嚷道，“这不是在你的公司里。巴迪还是个孩子，这是他写的第一首诗。他需要鼓励。”\n“我不明白，”父亲并不退让，“难道世界上糟糕的诗还不够多么？哪条法律规定巴迪一定要成为诗人？”\n我再也受不了了。我冲出饭厅，跑进自己的房间，扑到床上痛哭起来。饭厅里，父母还在为那首诗争吵着。",
  },
  {
    id: 3,
    title: "第四篇",
    content:
      "小女孩只好赤光脚走，一双小脚冻得红一块青一块了。她的旧围裙里兜着许多火柴，手里还也还拿着一把。这一整天里，谁也没有买过她一根火柴，谁也没有没有给过她一个钱。她在一座房子的墙角里坐下来，蜷着腿缩成一团。她觉得更冷了。她不敢回家，因为她没卖掉一根火柴，没挣到一个钱，爸爸一定会打她的。再说，家里跟街上衣样冷，他们头上只有个房顶，虽然最大的裂缝已经用草和破布堵住了，风还是可以罐进来。",
  },
  {
    id: 4,
    title: "第五篇",
    content:
      "读小学的时候，我的外祖母去世了。外祖母生前最疼爱我。我无法排除自己的忧伤，每天在学校的操场上一圈一圈地跑着，跑得累倒在地上，扑在草坪上痛哭。那哀痛的日子持续了很久，爸爸妈妈也不知道如何安慰我。他们知道与其欺骗我说外祖母睡着了，还不如对我说实话：外祖母永远不会回来了。我每天放学回家，在庭院时看着太阳一寸一寸地沉进了山头，就知道一天真的过完了。虽然明天还会有新的太阳，但永远不会有今天的太阳了。",
  },
  {
    id: 5,
    title: "第六篇",
    content:
      "我的发现起始于梦中飞行。每天夜里做梦我都飞，我对飞行是那样迷恋，只要双脚一点，轻轻跃起，就能离开地面飞向空中。后来，我甚至学会了滑翔，在街道上空，在白烨林梢头，在青青的草地和澄澈的湖面上盘旋。我的身体是那样轻盈，可以随心所欲，运转自如，凭着双臂舒展和双腿弹动，似乎想去哪里就能飞到那里。",
  },
  {
    id: 6,
    title: "第七篇",
    content:
      "从腊八起，铺户中就加紧的上年货，街上加多了货摊子——卖春联的、卖年画的、卖蜜供的、卖水仙花的等等都是只在这一季节才会出现的。这些赶年的摊子都教儿童们的心跳得特别快一些。在胡同里，吆喝的声音也比平时更多更复杂起来，其中也有仅在腊月才出现的，像卖书的，松枝的、薏仁米的、年糕的等等。",
  },
];

const interviewPool: Record<"A" | "B" | "C", InterviewQuestion[]> = {
  A: [
    {
      id: 1,
      category: "A",
      content: "回忆一下最近一次作梦，请描述一下梦的内容？",
    },
    { id: 2, category: "A", content: "你如何评价自己？" },
    { id: 3, category: "A", content: "周末一般都做什么？" },
    { id: 4, category: "A", content: "描述一下让自己印象深刻的一件事。" },
    { id: 5, category: "A", content: "生活中别人对自己的评价？" },
    { id: 6, category: "A", content: "你对未来生活有什么规划？" },
  ],
  B: [
    {
      id: 11,
      category: "B",
      content: "请描述最近一次你不开心的经历，你的感受如何?",
    },
    { id: 12, category: "B", content: "有没有特别后悔的事情，描述一下？" },
    {
      id: 13,
      category: "B",
      content: "有没有事情曾经让你感到很绝望/生活没有希望？",
    },
    {
      id: 14,
      category: "B",
      content: "最近有没有失眠的时候？失眠的时候会思考什么问题？",
    },
    {
      id: 15,
      category: "B",
      content: "什么时候你觉得自己很失败，或者让家人失望了？",
    },
    {
      id: 16,
      category: "B",
      content: "觉得自己有什么缺点吗？有尝试过改变吗？",
    },
  ],
  C: [
    {
      id: 21,
      category: "C",
      content: "回忆一下收到的最好的礼物是什么，你的感觉如何？",
    },
    {
      id: 22,
      category: "C",
      content: "最近最美味的食物，请描述一下当时的情景跟感受？",
    },
    {
      id: 23,
      category: "C",
      content:
        "请描述你的一个好朋友（包括年龄、工作、性格和爱好等），能不能描述一下跟他/她最美好的回忆？",
    },
    {
      id: 24,
      category: "C",
      content: "请描述一件你最喜欢从事的活动，你的感觉如何？",
    },
    { id: 25, category: "C", content: "描述一下你觉得很有成就感的一件事。" },
    { id: 26, category: "C", content: "你的偶像是谁？他/她对你有什么影响？" },
  ],
};

const introMessages: ChatMessage[] = [
  {
    id: "c1",
    role: "ai",
    type: "text",
    content: "你好，我是你的心理陪伴助手，我们先聊聊最近的状态。",
  },
  {
    id: "c2",
    role: "ai",
    type: "options",
    content: "你最近的睡眠怎么样？",
    options: ["很好", "一般", "不好"],
  },
];

const reportData: ReportData = {
  anxietyScore: 12,
  authenticityScore: 55,
  radar: [
    { dimension: "睡眠", value: 65 },
    { dimension: "情绪", value: 70 },
    { dimension: "真实性", value: 55 },
    { dimension: "压力", value: 62 },
  ],
  insights: [
    "建议规律作息，避免熬夜",
    "适当进行户外运动",
    "当感到压力时尝试深呼吸练习",
  ],
};

export const handlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      token: "mock_token",
      user: { id: body.phone, name: "演示用户", role: "student" },
    });
  }),
  http.post("/api/auth/register", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      token: "mock_token",
      user: { id: body.phone, name: body.name, role: body.role ?? "student" },
    });
  }),
  http.get("/api/scale", () => HttpResponse.json({ questions })),
  http.post("/api/scale", async ({ request }) => {
    await request.json();
    return HttpResponse.json({
      success: true,
      score: 12,
      severity: "轻度",
      summaryText: "从近期回答看，情绪低落频率较高，建议尽快与校心理老师沟通。",
    });
  }),
  http.get("/api/pictures", () => HttpResponse.json({ materials })),
  http.post("/api/pictures/text", async ({ request }) => {
    await request.json();
    return HttpResponse.json({ success: true });
  }),
  http.get("/api/readings", () => HttpResponse.json({ pool: readingPool })),
  http.post("/api/readings/record", async ({ request }) => {
    await request.json();
    return HttpResponse.json({ success: true });
  }),
  http.get("/api/interview/questions", ({ request }) => {
    const url = new URL(request.url);
    const category =
      (url.searchParams.get("category") as "A" | "B" | "C") ?? "A";
    const pool = interviewPool[category] ?? [];
    const picked = pool[Math.floor(Math.random() * pool.length)];
    return HttpResponse.json({ questions: picked ? [picked] : [] });
  }),
  http.post("/api/interview/answers", async ({ request }) => {
    await request.json();
    return HttpResponse.json({ success: true });
  }),
  http.post("/api/inference/local-binary", async ({ request }) => {
    await request.json();
    return HttpResponse.json({
      label: "低风险",
      summary: "根据量表与文本，当前风险较低，建议保持良好作息。",
      confidence: 0.78,
    });
  }),
  http.get("/api/narrative/materials", () => HttpResponse.json({ materials })), // legacy path fallback
  http.post("/api/narrative/upload", async () =>
    HttpResponse.json({ success: true, videoId: "vid_mock_123" }),
  ), // legacy
  http.post("/api/chat", async ({ request }) => {
    await request.json();
    return HttpResponse.json({ messages: introMessages });
  }),
  http.get("/api/report", () => HttpResponse.json(reportData)),
];
