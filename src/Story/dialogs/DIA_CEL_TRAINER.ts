export default [
  {
    id: 'DIA_CEL_TRAINER_HI',
    order: 1,
    text: 'Hi, who are you?',
    condition: () => true,
    permanent: false,
    important: false,
    on: () => {
      addDia(
        'DIA_CEL_TRAINER_HI // > Hi, who are you?',
        "DIA_CEL_TRAINER_HI_NO_TIME // I ain't got time for this.",
        'DIA_CEL_TRAINER_HI_HELP // > Why so reserved? Do you need any help?',
        'DIA_CEL_TRAINER_HI_NEED_HELP // Actually, I do need help. I trained my energy fairy to well. It got too strong for me to handle and flew away.',
        'DIA_CEL_TRAINER_HI_WHERE // > So you want me to catch it for you? Where did it go?',
        "DIA_CEL_TRAINER_HI_WILDERNESS // That's the thing, I think it fled to a fairy sanctuary, there must be one beyond the unexplored wilderness."
      )
    },
    onFinished: () => {
      addChoices('DIA_CEL_TRAINER_HELP_CATCH_YES', 'DIA_CEL_TRAINER_HELP_CATCH_NO')
    },
  },

  {
    id: 'DIA_CEL_TRAINER_HELP_CATCH_YES',
    order: 5,
    text: 'Sure, I will catch it for you',
    permanent: false,
    important: false,
    on: () => {
      addDia(
        "DIA_CEL_TRAINER_HELP_CATCH_YES // > Don't worry, I will catch it for you if I find it.",
        'DIA_CEL_TRAINER_HELP_CATCH_YES_PAY_INFO // That would be fantastic, I can pay you with energy essences.'
      )
    },
    onFinished: () => {},
  },

  {
    id: 'DIA_CEL_TRAINER_HELP_CATCH_NO',
    order: 6,
    text: "No, I can't help you",
    permanent: false,
    important: false,
    on: () => {
      addDia(
        'DIA_CEL_TRAINER_HELP_CATCH_NO // > Sorry, I am busy right now.',
        'DIA_CEL_TRAINER_HELP_CATCH_NO_ANOTHER // Well. Then I got to find someone else.'
      )
    },
    onFinished: () => {},
  },
]
