import useDialog from '@/use/useDialog.ts'
import $ from '@/global'

const { knows, currentDialog, choicesList } = useDialog()
export default [
  {
    id: 'DIA_FLF_TRADER_HI',
    order: 1,
    text: 'Hi, who are you?',
    condition: () => true,
    permanent: false,
    important: false,
    on: () => {
      currentDialog.value = [
        {
          text: '> Hi, who are you?',
          speech: 'DIA_FLF_TRADER_HI',
        },
        {
          text: 'Do I know you? Be gone, I am busy. Fucking amateur fairy trainer.',
          speech: 'DIA_FLF_TRADER_HI_BE_GONE',
        },
        {
          text: '> Mkay...',
          speech: 'DIA_FLF_TRADER_HI_MKAY',
        },
        {
          text: 'Waaaait.',
          speech: 'DIA_FLF_TRADER_HI_WAIT',
        },
        {
          text: '> What? You said I have to leave',
          speech: 'DIA_FLF_TRADER_HI_YOU_SAID',
        },
        {
          text: 'Loooser. Go get a fairy before you talk to me again.',
          speech: 'DIA_FLF_TRADER_HI_LOOSER',
        },
      ]
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
      currentDialog.value = [
        {
          text: '> Do you have some fairy dust for me?',
          speech: 'DIA_FLF_TRADER_FAIRY_DUST',
        },
        {
          text: "Sure man, I'm rich.",
          speech: 'DIA_FLF_TRADER_FAIRY_DUST_SURE',
        },
      ]
    },
    onFinished: () => {
      $.trainer.currency.fairyDust += 5
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
      currentDialog.value = [
        {
          text: 'Are you happy with the current state of the world?',
          speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD',
        },
      ]

      choicesList.value = [
        {
          id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES',
          order: 2,
          text: 'Yes, of cause',
          on: () => {
            currentDialog.value = [
              {
                text: '> Yeah, actually I love the progress of this project.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_PROGRESS',
              },
              {
                text: 'Oh sure, your right, we are even getting some cool music tracks.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_MUSIC',
              },
              {
                text: "> That's just the icing on the cake.",
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_YES_CAKE',
              },
            ]
          },
        },
        {
          id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO',
          order: 1,
          text: 'No, not really',
          on: () => {
            currentDialog.value = [
              {
                text: '> I am not happy with the current state of the world. We are missing some cool worlds to explore and catch more fairies.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_NOT_HAPPY',
              },
              {
                text: 'Well what can we do? We need to await what the 3d level designers are building for us.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_AWAIT_3D',
              },
              {
                text: '> Yeah, your right, chill and code then.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_AGREE_AWAIT',
              },
              {
                text: 'Exactly, calm down man.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_CALM',
              },
            ]
          },
        },
        {
          id: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION',
          order: 3,
          text: 'Do I even have any choice?',
          on: () => {
            currentDialog.value = [
              {
                text: '> Do I even have any choice? I mean, the fairies are waiting for us, but no world, no exploration, no fun.',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION_NO_FUN',
              },
              {
                text: 'Absolutely!',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_CHOICE_QUESTION_AGREE',
              },
              {
                text: '> Anyways...',
                speech: 'DIA_FLF_TRADER_CURRENT_STATE_WORLD_NO_CHOICE_QUESTION_ANYWAYS',
              },
            ]
          },
        },
      ]
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
      currentDialog.value = [
        {
          text: `> I got to go`,
          speech: 'DIA_END_GOT_TO_GO',
          type: 'end',
        },
      ]
    },
  },
]
