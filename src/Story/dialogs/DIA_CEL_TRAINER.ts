import useDialog from '@/use/useDialog.ts'
import $ from '@/global'

const { knows, currentDialog, choicesList } = useDialog()
export default [
  {
    id: 'DIA_CEL_TRAINER_HI',
    order: 1,
    text: 'Hi, who are you?',
    condition: () => true,
    permanent: false,
    important: false,
    on: () => {
      currentDialog.value = [
        {
          text: '> Hi, who are you?',
          speech: 'DIA_CEL_TRAINER_HI',
        },
        {
          text: "I ain't got time for this.",
          speech: 'DIA_CEL_TRAINER_HI_NO_TIME',
        },
        {
          text: '> Why so reserved? Do you need any help?',
          speech: 'DIA_CEL_TRAINER_HI_HELP',
        },
        {
          text: 'Actually, I do need help. I trained my energy fairy to well. It got too strong for me to handle and flew away.',
          speech: 'DIA_CEL_TRAINER_HI_NEED_HELP',
        },
        {
          text: '> So you want me to catch it for you? Where did it go?',
          speech: 'DIA_CEL_TRAINER_HI_WHERE',
        },
        {
          text: "That's the thing, I think it fled to a fairy sanctuary, there must be one beyond the unexplored wilderness.",
          speech: 'DIA_CEL_TRAINER_HI_WILDERNESS',
        },
      ]
    },
    onFinished: () => {
      choicesList.value = [
        {
          id: 'DIA_CEL_TRAINER_HELP_CATCH_YES',
          order: 6,
          text: 'Sure, I will catch it for you.',
          condition: () => knows('DIA_CEL_TRAINER_HI'),
          permanent: false,
          important: false,
          on: () => {
            currentDialog.value = [
              {
                text: "> Don't worry, I will catch it for you if I find it.",
                speech: 'DIA_CEL_TRAINER_HELP_CATCH_YES',
              },
              {
                text: 'That would be fantastic, I can pay you with energy essences.',
                speech: 'DIA_CEL_TRAINER_HELP_CATCH_YES_PAY_INFO',
              },
            ]
          },
          onFinished: () => {},
        },
        {
          id: 'DIA_CEL_TRAINER_HELP_CATCH_NO',
          order: 6,
          text: "No, I can't help you.",
          condition: () => knows('DIA_CEL_TRAINER_HI'),
          permanent: false,
          important: false,
          on: () => {
            currentDialog.value = [
              {
                text: '> Sorry, I am busy right now.',
                speech: 'DIA_CEL_TRAINER_HELP_CATCH_NO',
              },
              {
                text: 'Well. Then I got to find someone else.',
                speech: 'DIA_CEL_TRAINER_HELP_CATCH_NO_ANOTHER',
              },
            ]
          },
          onFinished: () => {},
        },
      ]
    },
  },
]
