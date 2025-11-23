import { http, HttpResponse } from 'msw';
import type { ChatMessage, NarrativeMaterial, Question, ReportData } from '../types';

const questions: Question[] = [
  {
    id: 'q1',
    title: '过去两周，你是否常常感到紧张、焦虑或烦躁？',
    options: ['完全没有', '几天', '一半以上的天数', '几乎每天'],
    type: 'single',
  },
  {
    id: 'q2',
    title: '你是否难以控制自己的担忧？',
    options: ['完全没有', '几天', '一半以上的天数', '几乎每天'],
    type: 'single',
  },
  {
    id: 'q3',
    title: '是否因为担心而难以放松？',
    options: ['完全没有', '几天', '一半以上的天数', '几乎每天'],
    type: 'single',
  },
  {
    id: 'q4',
    title: '是否感到坐立不安或无法安静下来？',
    options: ['完全没有', '几天', '一半以上的天数', '几乎每天'],
    type: 'single',
  },
  {
    id: 'q5',
    title: '是否容易被激怒或烦躁？',
    options: ['完全没有', '几天', '一半以上的天数', '几乎每天'],
    type: 'single',
  },
  {
    id: 'q6',
    title: '是否常有某种可怕事情会发生的感觉？',
    options: ['完全没有', '几天', '一半以上的天数', '几乎每天'],
    type: 'single',
  },
  {
    id: 'q7',
    title: '这些问题给你的学习或社交带来多大困扰？',
    options: ['完全没有', '一点点', '中等', '非常严重'],
    type: 'single',
  },
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
