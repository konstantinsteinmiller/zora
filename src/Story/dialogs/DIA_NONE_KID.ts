export default [
  {
    id: 'DIA_NONE_KID_TRADE_FAIRY',
    order: 1,
    text: 'Hey',
    condition: () => !knows('DIA_NONE_KID_TRADE_FAIRY_YES'),
    permanent: false,
    important: true,
    on: () => {
      addDia(
        'DIA_NONE_KID_TRADE_FAIRY // Hey you! Do you have a Light Queen fairy by any chance? I would like to trade my Jeanie fairy for a Light Queen fairy.'
      )

      if (isPrimaryFairy('Light Queen') || true) {
        addChoices('DIA_NONE_KID_TRADE_FAIRY_YES')
      }
      addChoices('DIA_NONE_KID_TRADE_FAIRY_NO')
    },
    onFinished: () => {},
  },

  {
    id: 'DIA_NONE_KID_TRADE_FAIRY_PERM',
    order: 1,
    text: 'I would like to trade my Jeanie fairy for your Light Queen fairy',
    condition: () => !knows('DIA_NONE_KID_TRADE_FAIRY_YES'),
    permanent: true,
    important: false,
    on: () => {
      addDia(
        'DIA_NONE_KID_TRADE_FAIRY_PERM // Do you have a Light Queen fairy by any chance? I would like to trade my Jeanie fairy for a Light Queen fairy.'
      )

      if (isPrimaryFairy('Light Queen') || true) {
        addChoices('DIA_NONE_KID_TRADE_FAIRY_YES')
      }
      addChoices('DIA_NONE_KID_TRADE_FAIRY_NO')
    },
    onFinished: () => {},
  },

  {
    id: 'DIA_NONE_KID_TRADE_FAIRY_YES',
    order: 5,
    text: 'Actually, here is one (trade Jeanie for Light Queen)',
    permanent: false,
    important: false,
    on: () => {
      addDia(
        'DIA_NONE_KID_TRADE_FAIRY_YES // > Actually, here is my Light Queen fairy.',
        'DIA_NONE_KID_TRADE_FAIRY_REWARD // Amazing, thank you buddy, I will give you some fairy dust as compensation.'
      )

      tradeFairy('Light Queen', {
        name: 'Jeanie',
        level: 10,
        primaryAttackSpell: {
          name: 'Flower Power',
          damage: 10,
          speed: 1,
          element: 'nature',
        },
        primaryDefenseSpell: {
          name: 'Natures Shield',
          defense: 1.5,
          mana: 10,
          element: 'nature',
        },
      })
    },
    onFinished: () => {
      addFairyDust(35)
    },
  },

  {
    id: 'DIA_NONE_KID_TRADE_FAIRY_NO',
    order: 6,
    text: "I don't have one right now",
    permanent: false,
    important: false,
    on: () => {
      addDia(
        "DIA_NONE_KID_TRADE_FAIRY_NO // > Sorry, I don't have one right now. But I will keep an eye out for it.",
        "DIA_NONE_KID_TRADE_FAIRY_WAITING // I'll be waiting here."
      )
    },
    onFinished: () => {},
  },
]
