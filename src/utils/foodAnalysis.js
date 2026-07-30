import Anthropic from '@anthropic-ai/sdk'

const FOOD_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Коротка назва страви українською' },
    protein: { type: 'number', description: 'Білки в грамах' },
    fat: { type: 'number', description: 'Жири в грамах' },
    carbs: { type: 'number', description: 'Вуглеводи в грамах' },
    kcal: { type: 'number', description: 'Калорійність в ккал' },
  },
  required: ['name', 'protein', 'fat', 'carbs', 'kcal'],
  additionalProperties: false,
}

export async function analyzeFoodPhoto({ apiKey, base64Data, mediaType }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.messages.create({
    model: 'claude-opus-5',
    max_tokens: 1024,
    output_config: {
      effort: 'low',
      format: { type: 'json_schema', schema: FOOD_SCHEMA },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Data },
          },
          {
            type: 'text',
            text: 'Проаналізуй фото їжі. Визнач приблизну порцію та оціни калорійність і БЖВ (білки/жири/вуглеводи в грамах) для всієї порції на тарілці/фото.',
          },
        ],
      },
    ],
  })

  if (response.stop_reason === 'refusal') {
    throw new Error('Модель відмовилась аналізувати це фото.')
  }

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock) throw new Error('Порожня відповідь від моделі.')

  const parsed = JSON.parse(textBlock.text)
  return {
    name: String(parsed.name),
    protein: Math.round(Number(parsed.protein)),
    fat: Math.round(Number(parsed.fat)),
    carbs: Math.round(Number(parsed.carbs)),
    kcal: Math.round(Number(parsed.kcal)),
  }
}

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const base64 = result.slice(result.indexOf(',') + 1)
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
