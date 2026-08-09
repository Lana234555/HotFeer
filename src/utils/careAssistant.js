import Anthropic from '@anthropic-ai/sdk'

const CARE_PLAN_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: 'Короткий підсумок рекомендованого підходу українською, 1-2 речення' },
    cautions: {
      type: 'array',
      items: { type: 'string' },
      description: 'Застереження через хвороби, алергії, судини чи вагітність. Порожній масив якщо протипоказань немає.',
    },
    items: {
      type: 'array',
      description: 'Персональний план догляду, 6-9 пунктів на ранок/день/вечір',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'короткий унікальний slug латиницею, напр. dry-brushing' },
          label: { type: 'string', description: 'Назва пункту догляду українською' },
          time: { type: 'string', enum: ['Ранок', 'День', 'Вечір'] },
          hint: { type: 'string', description: 'Коротка інструкція, до 6 слів' },
        },
        required: ['id', 'label', 'time', 'hint'],
        additionalProperties: false,
      },
    },
  },
  required: ['summary', 'cautions', 'items'],
  additionalProperties: false,
}

export async function generateCarePlan({ apiKey, answers, previousPlan }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const answersText = answers.map((a) => `- ${a.question} → ${a.answer || '(пропущено)'}`).join('\n')
  const previousText = previousPlan?.items?.length
    ? `\n\nПопередній план догляду (онови його з урахуванням нових відповідей, не переписуй з нуля без потреби):\n${JSON.stringify(previousPlan.items)}`
    : ''

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 1500,
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: CARE_PLAN_SCHEMA },
    },
    messages: [
      {
        role: 'user',
        content:
          'Ти — асистент з домашнього догляду проти целюліту. На основі анкети склади персональний щоденний план домашнього догляду (6-9 пунктів на ранок/день/вечір).\n' +
          'ОБОВʼЯЗКОВО врахуй згадані хвороби, алергії, судини, вагітність чи ліки — прибери небезпечні процедури й опиши застереження у cautions. Якщо протипоказань немає, залиш cautions порожнім масивом.\n\n' +
          `Відповіді анкети:\n${answersText}` +
          previousText,
      },
    ],
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('Модель відмовилась генерувати план.')
  }

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock) throw new Error('Порожня відповідь від моделі.')

  const parsed = JSON.parse(textBlock.text)
  return {
    summary: String(parsed.summary || ''),
    cautions: Array.isArray(parsed.cautions) ? parsed.cautions.map(String) : [],
    items: Array.isArray(parsed.items)
      ? parsed.items.map((i) => ({
          id: String(i.id),
          label: String(i.label),
          time: String(i.time),
          hint: String(i.hint || ''),
        }))
      : [],
  }
}
