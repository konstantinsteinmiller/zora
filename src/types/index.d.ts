export interface ENUM {
  [key: string]: string
}

export type Player = {
  teamUuid: string
  name: string
  color: string
  resource: number
  unitsList: Unit[] | null
}

// export type Team = {
//   teamUuid: string
//   name: string
//   color: string
//   resource: number
//   unitsList: Unit[] | null
// }
//
// export type Unit = {
//   teamUuid: string
//   color: string
//   position: number
//   unit: {
//     name?: string
//     type: string
//     movesList: Array<string>
//     specialMoves: Array<string>
//     pathFn: any
//     dottedType?: string
//   }
// }
//
// export interface IUnitBlueprint {
//   type: string
//   movesList: string[]
//   specialMoves: string[]
//   pathFn: () => string
// }
//
// export type Step = {
//   target: string
//   title: string
//   description: string
//   stepCallback?: any
//   sizeModifier?: number
//   ringModifier?: number
//   additionalTarget?: string
// }
//
// export type SocialEntry = {
//   url?: string
//   icon?: string
//   name: string
// }
//
// export type Match = {
//   matchName: string
//   matchUsersList: string[]
//   winner: string
//   isDraw: boolean
//   result: string
//   matchStatus: string
// }
//
// export type CharacterController = {
//   userUuid: playerUuid
//   name: string
//   matchesList: Match[]
//   mmr: number
//   wins: number
//   losses: number
//   draws: number
//   gamesPlayed: number
//   userResources: number
// }
//
// export type Campaign = {
//   type: string
//   name: string
//   open: boolean
//   image: string
//   unitsList?: Unit[]
// }
//
// export type CampaignModel = Campaign & {
//   difficulty: number
//   reward: number
//   openNextType: string
// }
