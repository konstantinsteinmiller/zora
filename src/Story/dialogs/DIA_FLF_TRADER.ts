export default [
  {
    id: 'DIA_FLF_TRADER_HI',
    order: 1,
    text: 'Hi, who are you?',
    condition: () => true,
    permanent: false,
    important: false,
    on: () => {
      addDia('DIA_FLF_TRADER_HI', '> Hi, who are you?')
      addDia('DIA_FLF_TRADER_HI_BE_GONE // Do I know you? Be gone, I am busy. Fucking amateur fairy trainer.')
      addDia('DIA_FLF_TRADER_HI_MKAY // > Mkay...')
      addDia('DIA_FLF_TRADER_HI_WAIT// Waaaait.')
      addDia('DIA_FLF_TRADER_HI_YOU_SAID //> What? You said I have to leave')
      addDia('DIA_FLF_TRADER_HI_LOOSER //Loooser. Go get a fairy before you talk to me again.')
    },
  },

  {
    id: 'DIA_FLF_TRADER_FAIRY_DUST',
    order: 6,
    text: 'Do you have some fairy dust for me?',
    condition: () => knows('DIA_FLF_TRADER_HI'),
    permanent: false,
    important: false,
    on: () => {
      addDia(
        'DIA_FLF_TRADER_FAIRY_DUST // > Do you have some fairy dust for me?',
        "DIA_FLF_TRADER_FAIRY_DUST_SURE // Sure man, I'm rich."
      )
    },
    onFinished: () => {
      addFairyDust(5)
    },
  },

  {
    id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD',
    order: 3,
    text: 'Are you happy with the current state of the world?',
    condition: () => true,
    permanent: true,
    important: false,
    on: () => {
      addDia('DIA_FLF_TRADER_CURRENT_STATE_WORLD // Are you happy with the current state of the world?')
      addChoices(
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES',
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO',
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION'
      )
    },
  },

  {
    id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES',
    order: 2,
    /* doesn't have a condition function as it is always just added within dialogs */
    text: 'Yes, of cause',
    on: () => {
      addDia(
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_PROGRESS // > Yeah, actually I love the progress of this project.',
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_MUSIC // Oh sure, your right, we are even getting some cool music tracks.',
        "DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_CAKE // > That's just the icing on the cake."
      )
    },
  },

  {
    id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO',
    order: 1,
    /* doesn't have a condition function as it is always just added within dialogs */
    text: 'No, not really',
    on: () => {
      addDia(
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_NOT_HAPPY // > I am not happy with the current state of the world. We are missing some cool worlds to explore and catch more fairies.',
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_AWAIT_3D // Well what can we do? We need to await what the 3d level designers are building for us.',
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_AGREE_AWAIT // > Yeah, your right, chill and code then.',
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_CALM // Exactly, calm down man.'
      )
    },
  },

  {
    id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION',
    order: 3,
    /* doesn't have a condition function as it is always just added within dialogs */
    text: 'Do I even have any choice?',
    on: () => {
      addDia(
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION_NO_FUN // > Do I even have any choice? I mean, the fairies are waiting for us, but no world, no exploration, no fun.',
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION_AGREE // Absolutely!',
        'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_CHOICE_QUESTION_ANYWAYS // > Anyways...'
      )
    },
  },

  {
    id: 'DIA_END',
    order: 999,
    text: 'I got to go (END)',
    condition: () => true,
    permanent: true,
    important: false,
    on: () => {
      addDia({
        text: `> I got to go`,
        speech: 'DIA_END_GOT_TO_GO',
        type: 'end',
      })
    },
  },
]
