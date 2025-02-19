export interface ActionFunctionMap {
  [action: string]: { onActivate: ((entity: any, hasChanged: boolean) => void) | null; onDeactivate: ((entity: any) => void) | null }
}
