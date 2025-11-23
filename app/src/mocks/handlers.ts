import { http, HttpResponse } from 'msw';
import type { ChatMessage, NarrativeMaterial, Question, ReportData } from '../types';

const phq9Options = ['完全不会', '好几天', '一半以上的天数', '几乎每天'];

const questions: Question[] = [
  { id: 'q1', title: '做事时提不起劲或没有兴趣', options: phq9Options, type: 'single' },
  { id: 'q2', title: '感到心情低落、沮丧或绝望', options: phq9Options, type: 'single' },
  { id: 'q3', title: '入睡困难、睡不着或睡得太多', options: phq9Options, type: 'single' },
  { id: 'q4', title: '感到疲倦或没有活力', options: phq9Options, type: 'single' },
  { id: 'q5', title: '食欲不振或吃得太多', options: phq9Options, type: 'single' },
  { id: 'q6', title: '觉得自己很糟，或觉得让自己/家人失望', options: phq9Options, type: 'single' },
  { id: 'q7', title: '对事物专注有困难，例如阅读或看电视时', options: phq9Options, type: 'single' },
  {
    id: 'q8',
    title: '动作或说话速度慢到被察觉，或相反——烦躁、坐立不安',
    options: phq9Options,
    type: 'single',
  },
  { id: 'q9', title: '有不如死掉或伤害自己的念头', options: phq9Options, type: 'single' },
];

const materials: NarrativeMaterial[] = [
  {
    id: 'm1',
    imageUrl: 'https://picsum.photos/seed/therapy/960/600',
    instruction: '观察图片，描述场景、人物情绪以及让你联想到的故事。',
  },
];

const introMessages: ChatMessage[] = [
  { id: 'c1', role: 'ai', type: 'text', content: '你好，我是你的心理陪伴助手，我们先聊聊最近的状态。' },
  {
    id: 'c2',
    role: 'ai',
    type: 'options',
    content: '你最近的睡眠怎么样？',
    options: ['很好', '一般', '不好'],
  },
];

const reportData: ReportData = {
  anxietyScore: 9,
  authenticityScore: 55,
  radar: [
    { dimension: '睡眠', value: 65 },
    { dimension: '情绪', value: 70 },
    { dimension: '真实性', value: 55 },
    { dimension: '压力', value: 62 },
  ],
  insights: ['建议规律作息，避免熬夜', '适当进行户外运动', '当感到压力时尝试深呼吸练习'],
};

export const handlers = [
  http.get('/api/scale', () => {
    return HttpResponse.json({ questions });
  }),
  http.post('/api/scale', async ({ request }) => {
    await request.json();
    return HttpResponse.json({ success: true });
  }),
  http.get('/api/narrative/materials', () => {
    return HttpResponse.json({ materials });
  }),
  http.post('/api/narrative/upload', async () => {
    await new Promise((res) => setTimeout(res, 600));
    return HttpResponse.json({ success: true, videoId: 'vid_mock_123' });
  }),
  http.post('/api/chat', async ({ request }) => {
    await request.json();
    return HttpResponse.json({ messages: introMessages });
  }),
  http.get('/api/report', () => {
    return HttpResponse.json(reportData);
  }),
];
